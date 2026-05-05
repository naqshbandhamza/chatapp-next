'use client';

import Image from "next/image";
import HomeNavbar from "@/components/layout/homeNavbar";
import { Inter, Montserrat, Roboto } from 'next/font/google';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';


const inter = Montserrat({
  weight: '400',
  subsets: ['latin'],
});

export default function SignUp() {

  const router = useRouter();

  const fnameRef = useRef<HTMLInputElement>(null);
  const lnameRef = useRef<HTMLInputElement>(null);

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    setLoading(true);
    const firstname = fnameRef.current?.value;
    const lastname = lnameRef.current?.value;
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if(firstname?.trim()==="" || lastname?.trim()===""){
      setLoading(false)
      setError("name fields cannot be empty")
      return;
    }

    if(confirmPassword!==password)
    {
      setLoading(false)
      setError("passwords dont match")
      return;
    }


    

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname, lastname, username, email, password }),
      });

      const res_json = await res.json();

      if (res_json.success)
        router.push('/sign-in');

      
      setError(res_json.message)
      setLoading(false)
    } catch (err: any) {
      setLoading(false)

    } finally {
    }
  };

  return (
    <div
      className={`relative min-h-screen bg-[#f1f9fc] h-auto w-full bg-[#FFFFFF] overflow-hidden ${inter.className}`}
    >
      <HomeNavbar />
      <h1 className="text-white text-center mt-[20px] mb-[60px] font-bold text-3xl">
        Sign Up to Chime
      </h1>
      <div className="w-[420px] h-auto shadow-md mx-auto mt-[20px] mb-[120px] text-gray-900 rounded-3xl overflow-hidden bg-[#ffffff] px-6 py-4">
        <input ref={fnameRef} className="input-field mt-[40px]" type="text" name="name" placeholder="First Name" />
        <input ref={lnameRef} className="input-field" type="text" name="name" placeholder="Last Name" />
        <input ref={usernameRef} className="input-field" type="text" name="username" placeholder="Username" />
        <input ref={emailRef} className="input-field" type="email" name="email" placeholder="email@email.com" />
        <input ref={passwordRef} className="input-field" type="password" name="password" placeholder="Password" />
        <input ref={confirmPasswordRef} className="input-field" type="password" name="confirm-password" placeholder="Confirm Password" />
        <button onClick={handleSubmit} className="submit-btn bg-[#3B41C5] border-none mt-4"> {loading ? 'Signing Up...' : 'Sign Up'}</button>
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}

