import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

import Logo from '../assets/logo-white.png'

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            await login(email, password);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-full max-w-md space-y-8 p-6">
                <div className="flex justify-center">
                    <img src={Logo} alt="Logo Do Raven" className="h-40 w-40 text-white" />
                </div>
                <h2 className="text-center text-3xl font-bold text-white">
                    Entrar no Twitter
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                        required
                    />

                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                        required
                    />

                    <Button type="submit" fullWidth disabled={isLoading}>
                        {isLoading ? 'Acessando...' : 'Entrar'}
                    </Button>
                </form>

                <p className="text-center text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
