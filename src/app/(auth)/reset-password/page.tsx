// Reset Password page
// Route: /reset-password
// Users land here after clicking the reset link in their email

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  // The browser client exchanges the ?code= from the email link for a session
  // on init; getSession() waits for that to finish
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // Sign out any other devices so an old session can't outlive the reset
      await supabase.auth.signOut({ scope: "others" });
      router.push("/portal");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Reset Password Form Container */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-[family-name:var(--font-mulish)] text-4xl font-bold text-black mb-3">
              Set new password
            </h1>
            <p className="font-[family-name:var(--font-lato)] text-gray-600 tracking-wide">
              Enter your new password below
            </p>
          </div>

          {hasSession === null ? (
            <p className="text-center font-[family-name:var(--font-lato)] text-gray-600 text-sm tracking-wide">
              checking reset link...
            </p>
          ) : !hasSession ? (
            /* Invalid or expired link */
            <div className="text-center">
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 font-[family-name:var(--font-lato)] text-sm">
                This reset link is invalid or has expired. Please request a new one from the same browser.
              </div>
              <Link
                href="/forgot-password"
                className="inline-block py-3 px-6 rounded-lg font-[family-name:var(--font-lato)] font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all tracking-wide"
              >
                request a new link
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

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block font-[family-name:var(--font-lato)] text-sm font-medium text-gray-700 mb-2 tracking-wide"
                  >
                    new password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="enter new password"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white font-[family-name:var(--font-lato)] text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                  />
                  <p className="mt-2 font-[family-name:var(--font-lato)] text-sm text-gray-500 tracking-wide">
                    *must be at least 8 characters
                  </p>
                </div>

                {/* Confirm Password field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block font-[family-name:var(--font-lato)] text-sm font-medium text-gray-700 mb-2 tracking-wide"
                  >
                    confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="confirm new password"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white font-[family-name:var(--font-lato)] text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-lg font-[family-name:var(--font-lato)] font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
                >
                  {isLoading ? "resetting..." : "reset password"}
                </button>
              </form>

              {/* Back to login link */}
              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="font-[family-name:var(--font-lato)] text-sm text-gray-600 hover:text-black hover:underline tracking-wide"
                >
                  back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
