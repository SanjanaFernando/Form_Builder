import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider afterSignInUrl="/form-builder">
      <html lang="en">
        <body>
          <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h1>App Header</h1>
            <nav>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <div className="flex items-center space-x-4">
                  
                  <a href="/dashboard" className="hover:underline">
                    Dashboard
                  </a>
                  <a href="/form-builder" className="hover:underline">
                    Form Builder
                  </a>
                  <UserButton />
                </div>
              </SignedIn>
            </nav>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
