"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../../lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  useEffect(() => {
    async function checkUser() {

      const {
        data: { session },
      } =
        await supabaseClient.auth.getSession();

      if (session) {
        router.replace("/rooms");
      }
    }

    checkUser();
  }, [router]);
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

  const [signupError, setSignupError] =
    useState("");

  const [signupSuccess, setSignupSuccess] =
    useState("");

  async function signup() {
    setSignupSuccess("");
    setEmailError("");
    setPasswordError("");
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

      const {
        data,
        error,
      } = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (error) {

        if (
          error.message.includes(
            "already registered"
          )
        ) {

          setSignupError(
            "Account already exists. Please login."
          );

          return;
        }

        throw error;
      }

      setSignupSuccess(
        "Account created successfully."
      );

      setTimeout(() => {
        router.replace("/rooms");
      }, 1000);

    } catch (error: unknown) {
      console.error(error);

      if (
        error &&
        typeof error === "object" &&
        "message" in error
      ) {
        setSignupError(
          String(error.message)
        );
      } else {
        setSignupError(
          "Unable to create account, try later"
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
          Create Account
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

              if (signupError) {
                setSignupError("");
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

              if (signupError) {
                setSignupError("");
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

        {signupError && (
          <div className="mb-4 rounded-lg border border-red-500 bg-red-500/10 px-3 py-2">
            <p className="text-sm text-red-300">
              {signupError}
            </p>
          </div>
        )}
        
        {signupSuccess && (
            <div className="mb-4 rounded-lg border border-green-500 bg-green-500/10 px-3 py-2">
                <p className="text-sm text-green-300">
                {signupSuccess}
                </p>
            </div>
        )}

        <button
          onClick={signup}
          disabled={loading}
          className="w-full rounded-xl bg-green-600 hover:bg-green-800 py-3 font-semibold text-white"
        >
          {loading
            ? "Creating..."
            : "Create Account"}
        </button>

        <div className="mt-4 text-white text-sm"> already have an account? </div>
        <button
          onClick={() =>
            router.push("/login")
          }
          className="w-full mt-4 rounded-xl bg-green-600 hover:bg-green-800 py-3 font-semibold text-white transition-all"
        >
          login
        </button>

      </div>

    </main>
  );
}