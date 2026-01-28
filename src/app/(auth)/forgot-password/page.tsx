// Forgot Password page
// Route: /forgot-password

"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Forgot Password Form Container */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-[family-name:var(--font-mulish)] text-4xl font-bold text-black mb-3">
              Reset your password
            </h1>
            <p className="font-[family-name:var(--font-lato)] text-gray-600 tracking-wide">
              remember your password?{" "}
              <Link
                href="/login"
                className="font-bold text-black hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>

          {/* Success Message */}
          {success ? (
            <div className="text-center">
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 font-[family-name:var(--font-lato)] text-sm">
                Check your email for a password reset link. If you don&apos;t see it, check your spam folder.
              </div>
              <Link
                href="/login"
                className="inline-block py-3 px-6 rounded-lg font-[family-name:var(--font-lato)] font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all tracking-wide"
              >
                back to login
              </Link>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 font-[family-name:var(--font-lato)] text-sm">
                  {error}
                </div>
              )}

              {/* Instructions */}
              <p className="font-[family-name:var(--font-lato)] text-gray-600 text-sm mb-6 tracking-wide">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>

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

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-lg font-[family-name:var(--font-lato)] font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
                >
                  {isLoading ? "sending..." : "send reset link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
