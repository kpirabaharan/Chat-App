import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (userId) {
    redirect('/');
  }

  return (
    <div className='flex min-h-full w-full flex-col items-center justify-center py-12'>
      {children}
    </div>
  );
};

export default AuthLayout;
