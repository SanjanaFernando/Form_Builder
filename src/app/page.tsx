// Add the "use client" directive to enable client-side functionality
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for client-side navigation

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard"); // Redirect to dashboard
  }, [router]);

  return null; // Empty content since it's a redirect
}
