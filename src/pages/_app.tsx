import '@/app/globals.css';
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <SignedIn>
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h1>App Header</h1>
          <nav className="flex space-x-4">
            <a href="/" className="hover:underline">
              Home
            </a>
            <a href="/dashboard" className="hover:underline">
              Dashboard
            </a>
            <a href="/form-builder" className="hover:underline">
              Form Builder
            </a>
            <UserButton />
          </nav>
        </header>
        <main>
          <Component {...pageProps} />
        </main>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}

export default MyApp;
