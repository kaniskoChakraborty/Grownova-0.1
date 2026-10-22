import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';

  useEffect(() => {
    document.title = 'Sign In & Sign Up — GrowNova Operating System';
  }, []);

  return <AuthShell initialMode={initialMode} />;
};

export default AuthPage;
