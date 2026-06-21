"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../../lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function signup() {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      setLoading(true);

      const { error } =
        await supabaseClient.auth.signUp(
          {
            email,
            password,
          }
        );

      if (error) {
        throw error;
      }

      alert(
        "Account created successfully"
      );

      router.push("/login");

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
          Create Account
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
          onClick={signup}
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 font-semibold text-white"
        >
          {loading
            ? "Creating..."
            : "Create Account"}
        </button>

      </div>

    </main>
  );
}