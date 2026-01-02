import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Twitter } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== passwordConfirmation) {
        setError('Passwords do not match.');
        return;
        }

        try {
        await auth.signup(email, password, passwordConfirmation);
        setError('');
        navigate('/'); // redireciona para a home após login
        } catch (err: any) {
        setError(err.message || 'Falha ao criar usuário');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-md space-y-8 p-6">
            <div className="flex justify-center">
            <Twitter className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-center text-3xl font-bold text-white">Create your account</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600"
            >
                Sign up
            </button>
            </form>
            <p className="text-center text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
                Sign in
            </a>
            </p>
        </div>
        </div>
    );
}
