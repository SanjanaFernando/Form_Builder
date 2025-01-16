"use client"; // Add this directive at the top

import { SignIn, SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'; // Use next/navigation
import { useEffect } from 'react';

const Page: React.FC = () => {
  const router = useRouter();
  const { user } = useClerk();

  // Redirect authenticated users to a dashboard or home page
  useEffect(() => {
    if (user) {
      router.push('/dashboard'); // Replace '/dashboard' with your desired route
    }
  }, [user, router]);

  return (
    <div style={styles.container}>
      {/* Show the SignIn component when the user is not signed in */}
      <SignedOut>
        <h1 style={styles.header}>Welcome Back!</h1>
        <p style={styles.description}>
          Please sign in to access your account and manage your forms.
        </p>
        <div style={styles.signInWrapper}>
          <SignIn
            redirectUrl="/dashboard" // Automatically redirect upon successful sign-in
            appearance={{
              elements: {
                card: styles.card, // Customize the sign-in form card
              },
            }}
          />
        </div>
      </SignedOut>

      {/* Show a message for signed-in users */}
      <SignedIn>
        <p style={styles.message}>You are already signed in!</p>
        <button
          onClick={() => router.push('/dashboard')}
          style={styles.button}
        >
          Go to Dashboard
        </button>
      </SignedIn>
    </div>
  );
};

export default Page;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f9f9f9',
    padding: '20px',
  },
  header: {
    fontSize: '2rem',
    marginBottom: '10px',
    color: '#555'
  },
  description: {
    fontSize: '1rem',
    marginBottom: '20px',
    color: '#555',
  },
  signInWrapper: {
    maxWidth: '400px',
    width: '100%',
  },
  card: {
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
  },
  message: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
