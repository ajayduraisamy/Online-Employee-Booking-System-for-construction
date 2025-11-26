# app.py
import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import mysql.connector
import bcrypt
from functools import wraps

app = Flask(__name__)

# -------------------------
# CONFIG
# -------------------------
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'super-secret-key-2025')

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="Emp_db"
    )

app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False

CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# -------------------------
# AUTH HELPERS
# -------------------------
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"msg": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated

def require_role(*roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*a, **kw):
            if "role" not in session or session["role"] not in roles:
                return jsonify({"msg": "Forbidden"}), 403
            return f(*a, **kw)
        return wrapper
    return decorator

# -------------------------
# AUTO TABLE CREATION
# -------------------------
def create_tables():
    db = get_db_connection()
    cur = db.cursor()

    # users
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200),
        email VARCHAR(200) UNIQUE,
        password VARCHAR(255),
        role VARCHAR(50),
        phone VARCHAR(50),
        skills VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # bookings (client requests)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT,
        title VARCHAR(255),
        description TEXT,
        location VARCHAR(255),
        required_skills VARCHAR(255),
        start_date DATE,
        end_date DATE,
        budget DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # projects (created by manager or admin linked to a booking)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT,
        manager_id INT,
        project_name VARCHAR(255),
        start_date DATE,
        end_date DATE,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'planned',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # assignments
    cur.execute("""
    CREATE TABLE IF NOT EXISTS assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT,
        employee_id INT,
        assigned_by INT,
        role_desc VARCHAR(255),
        start_date DATE,
        end_date DATE,
        status VARCHAR(50) DEFAULT 'assigned',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    db.commit()
    cur.close()
    db.close()
    print("Tables created successfully!")

with app.app_context():
    create_tables()

# -------------------------
# UTIL: DB execute helpers
# -------------------------
def fetchall(query, params=None):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute(query, params or ())
        return cur.fetchall()
    except Exception as e:
        print("DB fetchall error:", e)
        return []
    finally:
        if cur: cur.close()
        if conn: conn.close()

def fetchone(query, params=None):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute(query, params or ())
        return cur.fetchone()
    except Exception as e:
        print("DB fetchone error:", e)
        return None
    finally:
        if cur: cur.close()
        if conn: conn.close()

def execute(query, params=None):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(query, params or ())
        conn.commit()
        return cur.lastrowid
    except Exception as e:
        print("DB execute error:", e)
        raise
    finally:
        if cur: cur.close()
        if conn: conn.close()

# -------------------------
# REGISTER
# -------------------------
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json or {}
    required = ["name", "email", "password", "role"]
    if not all(k in data and data[k] for k in required):
        return jsonify({"msg": "Missing fields"}), 400

    existing = fetchone("SELECT id FROM users WHERE email=%s", (data["email"],))
    if existing:
        return jsonify({"msg": "Email exists"}), 400

    hashed = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt()).decode()

    try:
        execute("""
            INSERT INTO users (name,email,password,role,phone,skills)
            VALUES (%s,%s,%s,%s,%s,%s)
        """, (data["name"], data["email"], hashed, data["role"], data.get("phone"), data.get("skills")))
    except Exception as e:
        return jsonify({"msg": "Register failed", "error": str(e)}), 500

    return jsonify({"msg": "User registered"})

# -------------------------
# LOGIN
# -------------------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json or {}
    if not data.get("email") or not data.get("password"):
        return jsonify({"msg": "Email and password required"}), 400

    user = fetchone("SELECT * FROM users WHERE email=%s", (data["email"],))
    if not user:
        return jsonify({"msg": "Invalid email"}), 400

    if not bcrypt.checkpw(data["password"].encode(), user["password"].encode()):
        return jsonify({"msg": "Wrong password"}), 400

    # set minimal session
    session["user_id"] = user["id"]
    session["role"] = user["role"]

    # remove password before returning
    user.pop("password", None)
    return jsonify({"msg": "Login OK", "user": user})

# -------------------------
# LOGOUT
# -------------------------
@app.route("/api/logout", methods=["POST"])
@login_required
def logout():
    session.clear()
    return jsonify({"msg": "Logged out"})

# -------------------------
# ADMIN: USERS CRUD
# -------------------------
@app.route("/api/admin/users", methods=["GET"])
@login_required
@require_role("admin")
def admin_list_users():
    rows = fetchall("SELECT id,name,email,role,phone,skills,created_at FROM users ORDER BY created_at DESC")
    return jsonify(rows)

@app.route("/api/admin/user", methods=["POST"])
@login_required
@require_role("admin")
def admin_create_user():
    data = request.json or {}
    required = ["name", "email", "password", "role"]
    if not all(k in data and data[k] for k in required):
        return jsonify({"msg": "Missing fields"}), 400

    if fetchone("SELECT id FROM users WHERE email=%s", (data["email"],)):
        return jsonify({"msg": "Email exists"}), 400

    hashed = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt()).decode()
    try:
        new_id = execute("""
            INSERT INTO users (name,email,password,role,phone,skills)
            VALUES (%s,%s,%s,%s,%s,%s)
        """, (data["name"], data["email"], hashed, data["role"], data.get("phone"), data.get("skills")))
    except Exception as e:
        return jsonify({"msg": "Create user failed", "error": str(e)}), 500

    return jsonify({"msg": "User created", "id": new_id})

@app.route("/api/admin/user/<int:user_id>", methods=["PUT"])
@login_required
@require_role("admin")
def admin_update_user(user_id):
    data = request.json or {}
    # Only update provided fields (except password handled separately)
    try:
        user = fetchone("SELECT id FROM users WHERE id=%s", (user_id,))
        if not user:
            return jsonify({"msg": "User not found"}), 404

        # update fields
        fields = []
        params = []
        for key in ("name","email","role","phone","skills"):
            if key in data:
                fields.append(f"{key}=%s")
                params.append(data[key])

        if "password" in data and data["password"]:
            hashed = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt()).decode()
            fields.append("password=%s")
            params.append(hashed)

        if not fields:
            return jsonify({"msg": "No fields to update"}), 400

        params.append(user_id)
        query = "UPDATE users SET " + ", ".join(fields) + " WHERE id=%s"
        execute(query, tuple(params))
    except Exception as e:
        return jsonify({"msg": "Update failed", "error": str(e)}), 500

    return jsonify({"msg": "User updated"})

@app.route("/api/admin/user/<int:user_id>", methods=["DELETE"])
@login_required
@require_role("admin")
def admin_delete_user(user_id):
    try:
        execute("DELETE FROM users WHERE id=%s", (user_id,))
    except Exception as e:
        return jsonify({"msg": "Delete failed", "error": str(e)}), 500
    return jsonify({"msg": "User deleted"})

# -------------------------
# EMPLOYEES LIST (for manager)
# -------------------------
@app.route("/api/employees", methods=["GET"])
@login_required
@require_role("manager","admin")
def list_employees():
    rows = fetchall("SELECT id,name,email,phone,skills FROM users WHERE role='employee' ORDER BY name")
    return jsonify(rows)

# -------------------------
# CLIENT: Create Booking
# -------------------------
@app.route("/api/bookings", methods=["POST"])
@login_required
@require_role("client")
def create_booking():
    data = request.json or {}
    required = ["title", "description"]
    if not all(k in data and data[k] for k in required):
        return jsonify({"msg": "Missing fields"}), 400

    try:
        execute("""
            INSERT INTO bookings (client_id,title,description,location,required_skills,start_date,end_date,budget,status)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            session["user_id"],
            data["title"],
            data["description"],
            data.get("location"),
            data.get("required_skills"),
            data.get("start_date"),
            data.get("end_date"),
            data.get("budget"),
            data.get("status") or "pending"
        ))
    except Exception as e:
        return jsonify({"msg": "Booking failed", "error": str(e)}), 500

    return jsonify({"msg": "Booking submitted"})

# Client: view own bookings
@app.route("/api/bookings/mine", methods=["GET"])
@login_required
@require_role("client")
def client_my_bookings():
    rows = fetchall("SELECT * FROM bookings WHERE client_id=%s ORDER BY created_at DESC", (session["user_id"],))
    return jsonify(rows)

# Client: update own booking
@app.route("/api/bookings/<int:booking_id>", methods=["PUT"])
@login_required
@require_role("client")
def client_update_booking(booking_id):
    data = request.json or {}
    booking = fetchone("SELECT * FROM bookings WHERE id=%s AND client_id=%s", (booking_id, session["user_id"]))
    if not booking:
        return jsonify({"msg": "Booking not found or access denied"}), 404

    fields = []
    params = []
    for key in ("title","description","location","required_skills","start_date","end_date","budget","status"):
        if key in data:
            fields.append(f"{key}=%s")
            params.append(data[key])

    if not fields:
        return jsonify({"msg": "No fields to update"}), 400

    params.append(booking_id)
    try:
        execute("UPDATE bookings SET " + ", ".join(fields) + " WHERE id=%s", tuple(params))
    except Exception as e:
        return jsonify({"msg": "Update failed", "error": str(e)}), 500

    return jsonify({"msg": "Booking updated"})

# Client: delete own booking
@app.route("/api/bookings/<int:booking_id>", methods=["DELETE"])
@login_required
@require_role("client")
def client_delete_booking(booking_id):
    booking = fetchone("SELECT * FROM bookings WHERE id=%s AND client_id=%s", (booking_id, session["user_id"]))
    if not booking:
        return jsonify({"msg": "Booking not found or access denied"}), 404
    try:
        execute("DELETE FROM bookings WHERE id=%s", (booking_id,))
    except Exception as e:
        return jsonify({"msg": "Delete failed", "error": str(e)}), 500
    return jsonify({"msg": "Booking deleted"})

# -------------------------
# MANAGER: View Bookings (all or filtered)
# -------------------------
@app.route("/api/bookings", methods=["GET"])
@login_required
@require_role("manager","admin")
def get_bookings():
    # optional query params: status, unassigned_only
    status = request.args.get("status")
    unassigned = request.args.get("unassigned")  # if "1" filter bookings with no project
    if unassigned == "1":
        rows = fetchall("""
            SELECT b.* FROM bookings b
            LEFT JOIN projects p ON p.booking_id = b.id
            WHERE p.id IS NULL
            ORDER BY b.created_at DESC
        """)
    elif status:
        rows = fetchall("SELECT * FROM bookings WHERE status=%s ORDER BY created_at DESC", (status,))
    else:
        rows = fetchall("SELECT * FROM bookings ORDER BY created_at DESC")
    return jsonify(rows)

# -------------------------
# MANAGER: Projects CRUD
# -------------------------
@app.route("/api/projects", methods=["POST"])
@login_required
@require_role("manager","admin")
def create_project():
    data = request.json or {}
    required = ["project_name","booking_id"]
    if not all(k in data and data[k] for k in required):
        return jsonify({"msg": "Missing fields"}), 400
    try:
        pid = execute("""
            INSERT INTO projects (booking_id,manager_id,project_name,start_date,end_date,notes,status)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
        """, (
            data["booking_id"],
            session["user_id"],
            data["project_name"],
            data.get("start_date"),
            data.get("end_date"),
            data.get("notes"),
            data.get("status") or "active"
        ))
    except Exception as e:
        return jsonify({"msg": "Create project failed", "error": str(e)}), 500
    return jsonify({"msg": "Project created", "project_id": pid})

@app.route("/api/projects", methods=["GET"])
@login_required
@require_role("manager","admin","employee")
def list_projects():
    # employees can optionally see projects they're assigned to
    if session["role"] == "employee":
        rows = fetchall("""
            SELECT p.* FROM projects p
            JOIN assignments a ON a.project_id = p.id
            WHERE a.employee_id=%s
            ORDER BY p.created_at DESC
        """, (session["user_id"],))
    else:
        rows = fetchall("SELECT * FROM projects ORDER BY created_at DESC")
    return jsonify(rows)

@app.route("/api/projects/<int:project_id>", methods=["PUT"])
@login_required
@require_role("manager","admin")
def update_project(project_id):
    data = request.json or {}
    project = fetchone("SELECT * FROM projects WHERE id=%s", (project_id,))
    if not project:
        return jsonify({"msg": "Project not found"}), 404

    fields = []
    params = []
    for key in ("project_name","start_date","end_date","notes","status","manager_id","booking_id"):
        if key in data:
            fields.append(f"{key}=%s")
            params.append(data[key])
    if not fields:
        return jsonify({"msg": "No fields to update"}), 400
    params.append(project_id)
    try:
        execute("UPDATE projects SET " + ", ".join(fields) + " WHERE id=%s", tuple(params))
    except Exception as e:
        return jsonify({"msg": "Update failed", "error": str(e)}), 500
    return jsonify({"msg": "Project updated"})

@app.route("/api/projects/<int:project_id>", methods=["DELETE"])
@login_required
@require_role("manager","admin")
def delete_project(project_id):
    if not fetchone("SELECT id FROM projects WHERE id=%s", (project_id,)):
        return jsonify({"msg": "Project not found"}), 404
    try:
        execute("DELETE FROM assignments WHERE project_id=%s", (project_id,))
        execute("DELETE FROM projects WHERE id=%s", (project_id,))
    except Exception as e:
        return jsonify({"msg": "Delete failed", "error": str(e)}), 500
    return jsonify({"msg": "Project and its assignments deleted"})

# -------------------------
# ASSIGNMENTS CRUD (Manager / Admin)
# -------------------------
@app.route("/api/assignments", methods=["POST"])
@login_required
@require_role("manager","admin")
def create_assignment():
    data = request.json or {}
    required = ["project_id","employee_id"]
    if not all(k in data and data[k] for k in required):
        return jsonify({"msg": "Missing fields"}), 400
    try:
        aid = execute("""
            INSERT INTO assignments (project_id,employee_id,assigned_by,role_desc,start_date,end_date,status)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
        """, (
            data["project_id"],
            data["employee_id"],
            session["user_id"],
            data.get("role_desc"),
            data.get("start_date"),
            data.get("end_date"),
            data.get("status") or "assigned"
        ))
    except Exception as e:
        return jsonify({"msg": "Create assignment failed", "error": str(e)}), 500
    return jsonify({"msg": "Assigned", "assignment_id": aid})

@app.route("/api/assignments", methods=["GET"])
@login_required
@require_role("manager","admin","employee")
def list_assignments():
    if session["role"] == "employee":
        rows = fetchall("SELECT * FROM assignments WHERE employee_id=%s ORDER BY created_at DESC", (session["user_id"],))
    else:
        rows = fetchall("SELECT * FROM assignments ORDER BY created_at DESC")
    return jsonify(rows)

@app.route("/api/assignments/<int:assign_id>", methods=["PUT"])
@login_required
@require_role("manager","admin")
def update_assignment(assign_id):
    if not fetchone("SELECT id FROM assignments WHERE id=%s", (assign_id,)):
        return jsonify({"msg": "Assignment not found"}), 404
    data = request.json or {}
    fields = []
    params = []
    for key in ("project_id","employee_id","role_desc","start_date","end_date","status"):
        if key in data:
            fields.append(f"{key}=%s")
            params.append(data[key])
    if not fields:
        return jsonify({"msg": "No fields to update"}), 400
    params.append(assign_id)
    try:
        execute("UPDATE assignments SET " + ", ".join(fields) + " WHERE id=%s", tuple(params))
    except Exception as e:
        return jsonify({"msg": "Update failed", "error": str(e)}), 500
    return jsonify({"msg": "Assignment updated"})

@app.route("/api/assignments/<int:assign_id>", methods=["DELETE"])
@login_required
@require_role("manager","admin")
def delete_assignment(assign_id):
    if not fetchone("SELECT id FROM assignments WHERE id=%s", (assign_id,)):
        return jsonify({"msg": "Assignment not found"}), 404
    try:
        execute("DELETE FROM assignments WHERE id=%s", (assign_id,))
    except Exception as e:
        return jsonify({"msg": "Delete failed", "error": str(e)}), 500
    return jsonify({"msg": "Assignment deleted"})

# -------------------------
# EMPLOYEE: Update assignment status (working/completed)
# -------------------------
@app.route("/api/assignments/<int:assign_id>/status", methods=["PUT"])
@login_required
@require_role("employee")
def employee_update_status(assign_id):
    assn = fetchone("SELECT * FROM assignments WHERE id=%s AND employee_id=%s", (assign_id, session["user_id"]))
    if not assn:
        return jsonify({"msg": "Assignment not found or access denied"}), 404
    data = request.json or {}
    new_status = data.get("status")
    if new_status not in ("assigned","working","completed","rejected"):
        return jsonify({"msg": "Invalid status"}), 400
    try:
        execute("UPDATE assignments SET status=%s WHERE id=%s", (new_status, assign_id))
    except Exception as e:
        return jsonify({"msg": "Update failed", "error": str(e)}), 500
    return jsonify({"msg": "Status updated"})

# -------------------------
# ADMIN: Bookings/Projects/Assignments CRUD (convenience endpoints)
# -------------------------
@app.route("/api/admin/bookings", methods=["GET"])
@login_required
@require_role("admin")
def admin_list_bookings():
    rows = fetchall("SELECT * FROM bookings ORDER BY created_at DESC")
    return jsonify(rows)

@app.route("/api/admin/bookings/<int:booking_id>", methods=["DELETE"])
@login_required
@require_role("admin")
def admin_delete_booking(booking_id):
    if not fetchone("SELECT id FROM bookings WHERE id=%s", (booking_id,)):
        return jsonify({"msg": "Booking not found"}), 404
    try:
        # delete related projects & assignments
        execute("DELETE FROM assignments WHERE project_id IN (SELECT id FROM projects WHERE booking_id=%s)", (booking_id,))
        execute("DELETE FROM projects WHERE booking_id=%s", (booking_id,))
        execute("DELETE FROM bookings WHERE id=%s", (booking_id,))
    except Exception as e:
        return jsonify({"msg": "Delete failed", "error": str(e)}), 500
    return jsonify({"msg": "Booking and related data deleted"})

# -------------------------
# DASHBOARD COUNTS (admin/manager)
# -------------------------
@app.route("/api/dashboard", methods=["GET"])
@login_required
@require_role("admin","manager")
def dashboard():
    total_users = fetchone("SELECT COUNT(*) as c FROM users") or {"c":0}
    total_employees = fetchone("SELECT COUNT(*) as c FROM users WHERE role='employee'") or {"c":0}
    total_bookings = fetchone("SELECT COUNT(*) as c FROM bookings") or {"c":0}
    total_projects = fetchone("SELECT COUNT(*) as c FROM projects") or {"c":0}
    pending_bookings = fetchone("SELECT COUNT(*) as c FROM bookings WHERE status='pending'") or {"c":0}
    data = {
        "total_users": total_users["c"],
        "total_employees": total_employees["c"],
        "total_bookings": total_bookings["c"],
        "total_projects": total_projects["c"],
        "pending_bookings": pending_bookings["c"]
    }
    return jsonify(data)

# -------------------------
# UTILITY: Get current user info
# -------------------------
@app.route("/api/me", methods=["GET"])
@login_required
def me():
    user = fetchone("SELECT id,name,email,role,phone,skills,created_at FROM users WHERE id=%s", (session["user_id"],))
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user)

# -------------------------
# RUN
# -------------------------
if __name__ == "__main__":
    # For development only; in production use proper WSGI server
    app.run(debug=True)
