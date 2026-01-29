// Login page
// Route: /login

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (!data.session) {
        setError("Failed to create session. Please try again.");
        return;
      }

      router.push("/portal");
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Login Form Container */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-[family-name:var(--font-mulish)] text-4xl font-bold text-black mb-3">
              Login to your account
            </h1>
            <p className="font-[family-name:var(--font-lato)] text-gray-600 tracking-wide">
              don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-black hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 font-[family-name:var(--font-lato)] text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block font-[family-name:var(--font-lato)] text-sm font-medium text-gray-700 mb-2 tracking-wide"
              >
                email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@ucla.edu"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white font-[family-name:var(--font-lato)] text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
              />
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block font-[family-name:var(--font-lato)] text-sm font-medium text-gray-700 tracking-wide"
                >
                  password
                </label>
                <Link
                  href="/forgot-password"
                  className="font-[family-name:var(--font-lato)] text-sm text-gray-600 hover:text-black hover:underline tracking-wide"
                >
                  forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter your password"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white font-[family-name:var(--font-lato)] text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
              />
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500 cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block font-[family-name:var(--font-lato)] text-sm text-gray-600 cursor-pointer tracking-wide"
              >
                remember me
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg font-[family-name:var(--font-lato)] font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
            >
              {isLoading ? "logging in..." : "login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
