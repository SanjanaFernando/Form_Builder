"use client"; // Mark the component as a client component

import { SignUp, SignedIn, SignedOut } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'; // For client-side navigation
import { useEffect } from 'react';

const Page: React.FC = () => {
  const router = useRouter();

  // Redirect signed-in users to a specific page (e.g., dashboard)
  useEffect(() => {
    // Check if the user is already signed in and redirect accordingly
    // You might need to use a user context or similar to get user information
  }, [router]);

  return (
    <div style={styles.container}>
      {/* Show the SignUp component when the user is not signed in */}
      <SignedOut>
        <h1 style={styles.header}>Join Us!</h1>
        <p style={styles.description}>
          Create your account to start building dynamic forms and managing your projects.
        </p>
        <div style={styles.signUpWrapper}>
          <SignUp
            redirectUrl="/dashboard" // Redirect to the dashboard after sign-up
            appearance={{
              elements: {
                card: styles.card, // Customize the sign-up form card
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
    backgroundColor: '#f4f4f4',
    padding: '20px',
  },
  header: {
    fontSize: '2rem',
    marginBottom: '10px',
    color: '#333',
  },
  description: {
    fontSize: '1rem',
    marginBottom: '20px',
    color: '#666',
  },
  signUpWrapper: {
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
