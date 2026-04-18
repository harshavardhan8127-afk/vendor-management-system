import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Moon, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await api.post('/auth/register', {
                username: formData.username,
                password: formData.password,
                role: formData.role || 'ROLE_USER'
            });
            toast.success("Account created successfully!");
            navigate('/login');
        } catch (err) {
            const errorMsg = err.response && err.response.data 
                ? err.response.data 
                : "Error creating account";
            toast.error(typeof errorMsg === 'string' ? errorMsg : "Error creating account");
        }
    };

    return (
        <div className="min-h-screen bg-white relative font-sans text-gray-900 flex flex-col justify-between">
            {/* Dotted Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] z-0 opacity-70"></div>
            
            {/* Navbar */}
            <nav className="relative z-10 w-full top-0 bg-transparent">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                            <Layers className="text-white h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">TradeFlow</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100">
                            <Moon className="h-4 w-4" />
                        </button>
                        <Link to="/" className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded font-medium text-sm transition-colors shadow-sm">
                            Home
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Container */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-grow py-12 px-4 sm:px-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md p-8 md:p-12">
                    
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Sign up</h1>
                        <p className="text-gray-500 text-sm">Create a new TradeFlow account</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                            <input 
                                type="text"
                                placeholder="Choose a username"
                                className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white text-gray-900"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                            <input 
                                type="email"
                                placeholder="name@gmail.com"
                                className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white text-gray-900"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white text-gray-900 pr-10"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                    minLength={8}
                                />
                                <div className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Confirm Password</label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white text-gray-900 pr-10"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    required
                                    minLength={8}
                                />
                                <div className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                            <select 
                                className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white text-gray-900 appearance-none bg-no-repeat"
                                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em 1em' }}
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="" disabled>Select a role</option>
                                <option value="ROLE_ADMIN">Admin</option>
                                <option value="ROLE_USER">User</option>
                            </select>
                        </div>

                        <div className="pt-2">
                            <button type="submit" className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-medium py-2.5 rounded shadow-sm transition-colors cursor-pointer">
                                Create Account
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Log in</Link>
                    </p>
                </div>
            </div>

            <div></div>
        </div>
    );
}
