import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({ publicRoutes: ['/api/:path*'], debug: false });

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
