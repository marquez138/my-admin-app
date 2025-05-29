import { Suspense } from 'react';
import LoginForm from '../../../components/auth/LoginForm'; // Adjust path if necessary

// A simple loading fallback component
function LoadingFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <p>Loading login form...</p>
      {/* You can put a spinner or a more sophisticated skeleton UI here */}
    </div>
  );
}

export default function LoginPageContainer() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginForm />
    </Suspense>
  );
}