export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            {/* Navigation Bar */}
            <nav className="border-b border-slate-700">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                            <span className="text-xl font-bold">Online Employee Booking System for Building Construction</span>
                        </div>
                        <div className="hidden md:flex space-x-8">
                            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
                            
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-400 rounded-full mb-8">
                        <span className="text-blue-300 text-sm font-medium">Streamline Your Workforce Management</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Manage Your Team
                        <span className="block text-blue-400 mt-2">Like Never Before</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                        A comprehensive platform for employee management, project bookings, task assignments,
                        and real-time collaboration across multiple roles and departments.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <a
                            href="/login"
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                            <span>Get Started</span>
                            <span>→</span>
                        </a>

                        <a
                            href="/register"
                            className="px-8 py-4 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg font-semibold text-lg transition-colors duration-200"
                        >
                            Create Account
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">4+</div>
                            <div className="text-slate-400 text-sm">User Roles</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">24/7</div>
                            <div className="text-slate-400 text-sm">Availability</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">100%</div>
                            <div className="text-slate-400 text-sm">Secure</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-cyan-400">99%</div>
                            <div className="text-slate-400 text-sm">Efficient</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="bg-slate-800/50 py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
                        <p className="text-slate-300 max-w-2xl mx-auto">
                            Everything you need to manage your workforce efficiently
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Feature 1 */}
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-xl">👑</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Role-Based Access</h3>
                            <p className="text-slate-300">
                                Separate dashboards for Admin, Manager, Employee, and Client with appropriate permissions and features.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-green-500 transition-colors">
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-xl">📊</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Project Management</h3>
                            <p className="text-slate-300">
                                Create projects, assign tasks, track progress, and manage deadlines efficiently.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-purple-500 transition-colors">
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-xl">⚡</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Real-time Updates</h3>
                            <p className="text-slate-300">
                                Live status tracking, instant notifications, and up-to-date project information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-700 py-12">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex justify-center items-center space-x-2 mb-6">
                        <div className="w-6 h-6 bg-blue-600 rounded"></div>
                        <span className="text-lg font-bold">WorkForce Pro</span>
                    </div>
                    <p className="text-slate-400 mb-4">
                        Streamlining workforce management for modern businesses
                    </p>
                    <div className="flex justify-center space-x-6 text-sm text-slate-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}