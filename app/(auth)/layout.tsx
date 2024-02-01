
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex min-h-full w-full flex-col items-center justify-center py-12'>
      {children}
    </div>
  );
};

export default AuthLayout;
