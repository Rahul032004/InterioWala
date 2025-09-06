import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm
            onSwitchToSignup={() => setIsLogin(false)}
            onSuccess={onAuthSuccess}
          />
        ) : (
          <SignupForm
            onSwitchToLogin={() => setIsLogin(true)}
            onSuccess={onAuthSuccess}
          />
        )}
      </div>
    </div>
  );
}