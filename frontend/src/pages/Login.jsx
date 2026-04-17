import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Layers, Moon, Sun, ArrowRight, CheckCircle2, MessageSquare, Briefcase, Activity, Bell, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('password');
    const [darkMode, setDarkMode] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
            toast.success('Successfully logged in');
        } catch (err) {
            toast.error('Invalid credentials');
        }
    };

    const t = {
        bg: darkMode ? 'bg-[#0f172a]' : 'bg-white',
        bgSub: darkMode ? 'bg-[#1e293b]' : 'bg-gray-50/50',
        text: darkMode ? 'text-gray-100' : 'text-gray-900',
        textMuted: darkMode ? 'text-gray-400' : 'text-gray-600',
        card: darkMode ? 'bg-[#1e293b] border-gray-800' : 'bg-white border-gray-100',
        nav: darkMode ? 'bg-[#0f172a]/80 border-gray-800' : 'bg-white/80 border-gray-100',
        input: darkMode ? 'bg-[#0f172a] border-gray-700 text-white focus:bg-[#1e293b]' : 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white',
        linkText: darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
    };

    return (
        <div className={`min-h-screen font-sans scroll-smooth transition-colors duration-300 ${darkMode ? 'selection:bg-blue-900 selection:text-white' : 'selection:bg-blue-100 selection:text-blue-900'} ${t.bg} ${t.text}`}>
            
            {/* Navbar */}
            <nav className={`fixed w-full top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${t.nav}`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                            <Layers className="text-white h-5 w-5" />
                        </div>
                        <span className={`text-xl font-bold tracking-tight ${t.text}`}>TradeFlow</span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button onClick={() => setDarkMode(!darkMode)} className="text-gray-500 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-gray-200/10 cursor-pointer">
                            {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <a href="#login-portal" className={`text-sm font-medium transition-colors ${t.linkText}`}>Log In</a>
                        <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-all shadow-sm shadow-blue-200/20">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between min-h-[90vh]">
                
                {/* Left side text */}
                <div className="lg:w-1/2 pt-10 lg:pt-20 text-center lg:text-left z-10">
                    <p className="text-blue-500 font-bold text-xs tracking-widest uppercase mb-6 drop-shadow-sm">Vendor Management Platform</p>
                    <h1 className={`text-6xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight mb-6 ${t.text}`}>
                        Seamless <br/><span className="text-blue-600">Vendor</span><br/>Management
                    </h1>
                    <p className={`text-lg mb-10 max-w-xl leading-relaxed mx-auto lg:mx-0 ${t.textMuted}`}>
                        Empower your enterprise with a streamlined platform for managing vendors, tracking supply purchases, and analyzing live performance — all in one place.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-md font-medium transition-all shadow-md shadow-blue-200/20 flex items-center w-full sm:w-auto justify-center">
                            Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <a href="#login-portal" className={`border hover:border-blue-500 px-8 py-3.5 rounded-md font-medium transition-all w-full sm:w-auto justify-center flex ${t.card} ${t.text}`}>
                            Sign In
                        </a>
                    </div>
                </div>

                {/* Right side Login Portal */}
                <div id="login-portal" className="lg:w-[45%] mt-16 lg:mt-12 w-full max-w-md">
                    <div className={`rounded-2xl border shadow-xl p-8 md:p-10 relative overflow-hidden transition-colors ${t.card}`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                                <Lock className="text-blue-500 h-5 w-5" />
                            </div>
                            <div>
                                <h3 className={`font-bold ${t.text}`}>Secure Access Portal</h3>
                                <p className={`text-xs ${t.textMuted}`}>Login to TradeFlow Dashboard</p>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${t.textMuted}`}>Username</label>
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={`w-full rounded-lg px-4 py-3 text-sm transition-all outline-none focus:ring-1 focus:ring-blue-500 border ${t.input}`}
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${t.textMuted}`}>Password</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full rounded-lg px-4 py-3 text-sm transition-all outline-none focus:ring-1 focus:ring-blue-500 border ${t.input}`}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between pb-2">
                                <label className="flex items-center">
                                    <input type="checkbox" className={`rounded focus:ring-blue-500 h-4 w-4 ${darkMode ? 'bg-gray-800 border-gray-600 text-blue-500' : 'text-blue-600 border-gray-300'}`} />
                                    <span className={`ml-2 text-sm ${t.textMuted}`}>Remember me</span>
                                </label>
                                <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-400">Forgot password?</a>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors cursor-pointer shadow-md shadow-blue-500/20">
                                Authenticate Request
                            </button>
                        </form>
                        
                        <div className={`mt-8 pt-6 border-t text-center ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                            <p className="text-xs text-gray-500 flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                                Secure TLS Connection established
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className={`py-24 border-t transition-colors ${t.bgSub} ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-2xl mb-16">
                        <h2 className={`text-4xl font-bold mb-6 tracking-tight ${t.text}`}>Everything your enterprise needs</h2>
                        <p className={`text-lg ${t.textMuted}`}>A powerful, minimal toolkit designed for modern supply chain teams that want to scale fast without backend complexity.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className={`p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow ${t.card}`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                                <CheckCircle2 className="text-blue-500 h-6 w-6" />
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${t.text}`}>Smart Vendor Directory</h3>
                            <p className={`leading-relaxed text-sm ${t.textMuted}`}>Add missing vendors, track specific internal categories, and maintain structured network directories flawlessly without bloated interfaces.</p>
                        </div>
                        {/* Card 2 */}
                        <div className={`p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow ${t.card}`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                                <MessageSquare className="text-blue-500 h-6 w-6" />
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${t.text}`}>Dynamic Tracking Profiles</h3>
                            <p className={`leading-relaxed text-sm ${t.textMuted}`}>Store email contacts, track company payment terms, and log active operational status directly connected to a single unified dashboard view.</p>
                        </div>
                        {/* Card 3 */}
                        <div className={`p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow ${t.card}`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                                <Briefcase className="text-blue-500 h-6 w-6" />
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${t.text}`}>Comprehensive Transactions</h3>
                            <p className={`leading-relaxed text-sm ${t.textMuted}`}>Generate simulated and active ledger cycles, map exact transaction expenditures, and visualize the complete architecture of your network instantly.</p>
                        </div>
                        {/* Card 4 */}
                        <div className={`p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow ${t.card}`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                                <Activity className="text-blue-500 h-6 w-6" />
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${t.text}`}>Granular Analytics Reports</h3>
                            <p className={`leading-relaxed text-sm ${t.textMuted}`}>Convert dynamically aggregated table structures smoothly into exported CSV files for deep secondary analysis in Excel.</p>
                        </div>
                        {/* Card 5 */}
                        <div className={`p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow ${t.card}`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                                <Bell className="text-blue-500 h-6 w-6" />
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${t.text}`}>Real-Time Metric Aggregation</h3>
                            <p className={`leading-relaxed text-sm ${t.textMuted}`}>The platform mathematically reads your current inputs and derives realistic tracking counts, parsing logic, and dynamic expenditure summaries live.</p>
                        </div>
                        {/* Card 6 */}
                        <div className={`p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow ${t.card}`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                                <Lock className="text-blue-500 h-6 w-6" />
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${t.text}`}>Secure Administrative Guard</h3>
                            <p className={`leading-relaxed text-sm ${t.textMuted}`}>Administrative endpoints are strictly wrapped behind modern standard JWT tokens for frictionless, highly secure data authentication.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className={`py-24 transition-colors ${t.bg}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-2xl mb-16">
                        <p className="text-blue-500 font-bold text-xs tracking-widest uppercase mb-4">Our Team</p>
                        <h2 className={`text-4xl font-bold mb-6 tracking-tight ${t.text}`}>Meet the builders</h2>
                        <p className={`text-lg ${t.textMuted}`}>Engineers passionate about building high-performance supply chain tools that make procurement more productive and connected.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Team Member 1 */}
                        <div className={`p-10 rounded-2xl border shadow-sm text-center transform transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/30 ${t.card}`}>
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-md shadow-blue-500/30">
                                AJ
                            </div>
                            <h3 className={`text-xl font-bold mb-1 ${t.text}`}>Akash Jamalpur</h3>
                            <p className={`text-sm mb-6 ${t.textMuted}`}>Full Stack Developer</p>
                            <div className="flex justify-center space-x-3">
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition cursor-pointer ${darkMode ? 'border-gray-700 hover:bg-gray-800 text-blue-400' : 'border-gray-200 hover:bg-blue-50 text-blue-500'}`}>in</div>
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition cursor-pointer ${darkMode ? 'border-gray-700 hover:bg-gray-800 text-pink-400' : 'border-gray-200 hover:bg-pink-50 text-pink-500'}`}>ig</div>
                            </div>
                        </div>
                        {/* Team Member 2 */}
                        <div className={`p-10 rounded-2xl border shadow-sm text-center transform transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-500/30 ${t.card}`}>
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-md shadow-indigo-500/30">
                                VA
                            </div>
                            <h3 className={`text-xl font-bold mb-1 ${t.text}`}>Vikas Ambati</h3>
                            <p className={`text-sm mb-6 ${t.textMuted}`}>Backend Engineer</p>
                            <div className="flex justify-center space-x-3">
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition cursor-pointer ${darkMode ? 'border-gray-700 hover:bg-gray-800 text-blue-400' : 'border-gray-200 hover:bg-blue-50 text-blue-500'}`}>in</div>
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition cursor-pointer ${darkMode ? 'border-gray-700 hover:bg-gray-800 text-pink-400' : 'border-gray-200 hover:bg-pink-50 text-pink-500'}`}>ig</div>
                            </div>
                        </div>
                        {/* Team Member 3 */}
                        <div className={`p-10 rounded-2xl border shadow-sm text-center transform transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-500/30 ${t.card}`}>
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-md shadow-emerald-500/30">
                                SV
                            </div>
                            <h3 className={`text-xl font-bold mb-1 ${t.text}`}>S Harsha Vardhan</h3>
                            <p className={`text-sm mb-6 ${t.textMuted}`}>UI/UX Designer</p>
                            <div className="flex justify-center space-x-3">
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition cursor-pointer ${darkMode ? 'border-gray-700 hover:bg-gray-800 text-blue-400' : 'border-gray-200 hover:bg-blue-50 text-blue-500'}`}>in</div>
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition cursor-pointer ${darkMode ? 'border-gray-700 hover:bg-gray-800 text-pink-400' : 'border-gray-200 hover:bg-pink-50 text-pink-500'}`}>ig</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className={`py-24 border-t transition-colors ${t.bgSub} ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-2xl mb-12">
                        <p className="text-blue-500 font-bold text-xs tracking-widest uppercase mb-4">Get In Touch</p>
                        <h2 className={`text-4xl font-bold mb-4 tracking-tight ${t.text}`}>Contact us</h2>
                        <p className={`text-lg ${t.textMuted}`}>Have questions or want to collaborate? Reach out to us.</p>
                    </div>

                    <div className={`max-w-xl p-8 rounded-2xl border shadow-sm flex items-center space-x-6 hover:shadow-md transition ${t.card}`}>
                        <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
                            <Mail className="text-white h-6 w-6" />
                        </div>
                        <div>
                            <p className={`text-sm font-medium mb-1 ${t.textMuted}`}>Email</p>
                            <p className={`text-2xl font-bold tracking-tight ${t.text}`}>Tradeflow@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className={`border-t py-10 transition-colors ${t.bg} ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                            <Layers className="text-white h-3 w-3" />
                        </div>
                        <span className={`text-lg font-bold tracking-tight ${t.text}`}>TradeFlow</span>
                    </div>
                    <p className={`text-sm ${t.textMuted}`}>2026 © All rights reserved</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#login-portal" className={`text-sm font-medium transition-colors ${t.linkText}`}>Login</a>
                        <Link to="/register" className={`text-sm font-medium transition-colors ${t.linkText}`}>Sign Up</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
