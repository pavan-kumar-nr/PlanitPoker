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

  async function login() {
    if (!email || !password) {
      alert("Enter email and password");
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

    }catch (error: unknown) {
       console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Login
        </h1>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="Email"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 mb-4 text-white"
        />

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          placeholder="Password"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 mb-6 text-white"
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 py-3 font-semibold text-white"
        >
          {loading
            ? "Signing In..."
            : "Login"}
        </button>

        <button
          onClick={() =>
            router.push("/signup")
          }
          className="w-full mt-4 rounded-xl bg-slate-700 hover:bg-slate-600 py-3 font-semibold text-white"
        >
          Create Account
        </button>

      </div>

    </main>
  );
}