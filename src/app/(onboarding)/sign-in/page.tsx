'use client';

import Image from "next/image";
import HomeNavbar from "@/components/layout/homeNavbar";
import { Montserrat } from 'next/font/google';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const inter = Montserrat({
  weight: '400',
  subsets: ['latin'],
});

export default function SignIn() {
  console.log("login rendered");

  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    const username = usernameRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Login failed');
      }

      const cuser = await res.json();

      router.push('/profile');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative h-screen w-full bg-[#f1f9fc] overflow-hidden ${inter.className}`}
    >
      <HomeNavbar />
      <h1 className="text-white text-center mt-[20px] mb-[60px] font-bold text-3xl">
        Sign In to Chime
      </h1>
      <div className="w-[420px] h-auto shadow-md mx-auto mt-[20px] text-gray-900 rounded-3xl overflow-hidden bg-[#ffffff]">
        <input
          className="input-field mt-[40px]"
          type="text"
          name="username"
          placeholder="Username"
          ref={usernameRef}
        />
        <input
          className="input-field"
          type="password"
          name="password"
          placeholder="Password"
          ref={passwordRef}
        />
        <button
          className={`submit-btn bg-[#3B41C5] border-none`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
