"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
    const { loginWithGoogle, login } = useAuth();
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Email/Pass State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);
        try {
            await loginWithGoogle();
            router.push("/admin");
        } catch (err: any) {
            console.error(err);
            // Show the actual error to help debugging
            const errorMessage = err.code ? err.code.replace("auth/", "").replace(/-/g, " ") : err.message;
            setError(`Google Login Failed: ${errorMessage}`);
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            router.push("/admin");
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.code ? err.code.replace("auth/", "").replace(/-/g, " ") : err.message;
            setError(`Login Failed: ${errorMessage}`);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F4F2] p-4">
            <div className="w-full max-w-md bg-white p-8 md:p-12 shadow-xl border border-gray-100 text-center">
                <div className="mb-8">
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-[#002FA7] mb-2">Nava CMS</h1>
                    <p className="text-gray-500 text-sm font-mono">Restricted Access</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 text-sm font-medium border border-red-100 mb-6">
                        {error}
                    </div>
                )}

                {/* Google Login */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 py-3 font-bold uppercase tracking-wide hover:bg-gray-50 transition-colors disabled:opacity-50"
                    type="button"
                >
                    {loading ? (
                        <span>Connecting...</span>
                    ) : (
                        <>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign in with Google
                        </>
                    )}
                </button>

                <div className="flex items-center gap-4 my-6">
                    <div className="h-px bg-gray-200 flex-grow" />
                    <span className="text-xs font-bold text-gray-400 uppercase">Or continue with email</span>
                    <div className="h-px bg-gray-200 flex-grow" />
                </div>

                {/* Email Login Form */}
                <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 text-left">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#002FA7] transition-colors text-black"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#002FA7] transition-colors text-black"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#002FA7] text-white py-3 font-bold uppercase tracking-wide hover:bg-[#002FA7]/90 transition-colors disabled:opacity-50 mt-2"
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-6 text-xs text-gray-400 max-w-[200px] mx-auto leading-relaxed">
                    Only authorized accounts will be granted access.
                </p>

                <div className="mt-8 pt-6 border-t border-gray-100 w-full text-center opacity-50 hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-gray-400 font-mono">
                        Config: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}
                        <br />
                        {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
                    </p>
                </div>
            </div>
        </div>
    );
}
