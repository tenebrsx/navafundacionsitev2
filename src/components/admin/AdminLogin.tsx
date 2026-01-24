"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/admin");
        } catch (err) {
            setError("Failed to login. Please check your credentials.");
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <div className="w-full max-w-md p-8 border border-zinc-800 bg-zinc-900/50">
                <h1 className="text-2xl font-bold mb-6 text-nava-green uppercase">Admin Access</h1>

                <button
                    onClick={async () => {
                        try {
                            await signInWithPopup(auth, googleProvider);
                            router.push("/admin");
                        } catch (err: any) {
                            console.error(err);
                            // Display the actual error message
                            setError(err.message || "Failed to login with Google.");
                        }
                    }}
                    className="w-full bg-white text-black font-bold p-3 mb-6 hover:bg-zinc-200 transition-colors uppercase flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z" /></svg>
                    Sign in with Google
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-zinc-800 flex-1" />
                    <span className="text-zinc-500 text-xs uppercase">Or with email</span>
                    <div className="h-px bg-zinc-800 flex-1" />
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 bg-black border border-zinc-700 focus:border-nava-green outline-none text-white"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 bg-black border border-zinc-700 focus:border-nava-green outline-none text-white"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="bg-nava-green text-black font-bold p-3 hover:bg-white transition-colors uppercase"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
