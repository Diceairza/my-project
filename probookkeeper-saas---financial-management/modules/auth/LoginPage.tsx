
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { APP_NAME, AUTH_TOKEN_KEY } from '../../constants'; 
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { LogInIcon, ZapIcon } from '../../components/icons/LucideIcons';
import { authService } from '../../services/authService';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  // users prop removed as authService handles user data internally (simulated)
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await authService.login({ username, password });
      onLoginSuccess(user);
      navigate('/dashboard'); // Navigate after successful login and state update in App
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light p-4">
      <Card title="" className="max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
            <ZapIcon className="w-16 h-16 text-primary mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-800">{APP_NAME}</h2>
            <p className="text-gray-500">Please sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="e.g., admin"
            autoComplete="username"
            disabled={isLoading}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoading}
          />
          {error && <p className="text-xs text-red-600 text-center -mt-2">{error}</p>}
          <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={isLoading} disabled={isLoading} leftIcon={<LogInIcon className="w-5 h-5"/>}>
            Sign In
          </Button>
        </form>
         <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
                Mock credentials: <br/>
                <span className="font-mono">admin / password123</span> <br/>
                <span className="font-mono">bookkeeper / password123</span> <br/>
                <span className="font-mono">payrollmgr / password123</span>
            </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
