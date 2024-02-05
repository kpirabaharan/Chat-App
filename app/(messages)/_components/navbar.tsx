import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className='fixed z-10 h-16 w-full border border-background bg-secondary'>
      <div className='flex h-full items-center justify-start px-2 md:px-4'>
        <Link href='/'>
          <p className='text-xl font-bold'>Chat App</p>
        </Link>
      </div>
      <div className='absolute right-4 top-4'>
        <UserButton afterSignOutUrl='/' />
      </div>
    </nav>
  );
};
