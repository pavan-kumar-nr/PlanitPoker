"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [emailError, setEmailError] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [loginError, setLoginError] =
    useState("");

  async function login() {
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    let hasError = false;

    if (!email.trim()) {
      setEmailError(
        "Email is required"
      );
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError(
        "Password is required"
      );
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      setLoading(true);

      const { error } =
        await supabaseClient.auth.signInWithPassword(
          {
            email,
            password,
          }
        );

      if (error) {
        throw error;
      }

      router.push("/");
      router.refresh();

    } catch (error: unknown) {
      console.error(error);

      if (
        error &&
        typeof error === "object" &&
        "message" in error
      ) {
        setLoginError(
          String(error.message)
        );
      } else {
        setLoginError(
          "Unable to login"
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">

      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-blue-900 p-8">

        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Login
        </h1>

        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(
                e.target.value
              );

              if (emailError) {
                setEmailError("");
              }

              if (loginError) {
                setLoginError("");
              }
            }}
            placeholder="Enter Email Address"
            className={`w-full rounded-xl bg-white px-4 py-3 text-black border ${
              emailError
                ? "border-red-500"
                : "border-slate-700"
            }`}
          />

          {emailError && (
            <p className="mt-1 text-sm text-red-500">
              {emailError}
            </p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(
                e.target.value
              );

              if (
                passwordError
              ) {
                setPasswordError(
                  ""
                );
              }

              if (loginError) {
                setLoginError("");
              }
            }}
            placeholder="Enter Password"
            className={`w-full rounded-xl bg-white px-4 py-3 text-black border ${
              passwordError
                ? "border-red-500"
                : "border-slate-700"
            }`}
          />

          {passwordError && (
            <p className="mt-1 text-sm text-red-500">
              {passwordError}
            </p>
          )}
        </div>

        {loginError && (
          <div className="mb-4 rounded-lg border border-red-500 bg-red-500/10 px-3 py-2">
            <p className="text-sm text-red-300">
              {loginError}
            </p>
          </div>
        )}
        <div className="mt-10"></div>
        <button
          onClick={login}
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 py-3 font-semibold text-white transition-all"
        >
          {loading
            ? "Signing In..."
            : "Login"}
        </button>

        <div className="mt-4 text-white text-sm"> don&apos;t have an account? </div>
        <button
          onClick={() =>
            router.push("/signup")
          }
          className="w-full mt-4 rounded-xl bg-green-700 hover:bg-green-800 py-3 font-semibold text-white transition-all"
        >
          Create Account
        </button>

      </div>

    </main>
  );
}