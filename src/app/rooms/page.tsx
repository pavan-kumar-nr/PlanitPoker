"use client";
import { Copy, Home } from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { supabaseClient } from "../../lib/supabaseClient";

type Session = {
  id: string;
  name: string;
  room_code: string;
  voting_type: string;
  creator_name: string;
  created_at: string;
  participant_count?: number;
  completed_tickets?: number;
  active_ticket_id?: string | null;
  last_accessed_at?: string | null;
  participants?: {
    count: number;
  }[];
};

export default function RoomsPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [sessions, setSessions] =
    useState<Session[]>([]);

  const [loading, setLoading] =
    useState(true);

useEffect(() => {
  async function loadData() {
    try {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const response = await fetch(
        `/api/sessions?createdBy=${user.id}`
      );

      const data = await response.json();

      setSessions(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  loadData();
}, [router]);

  async function logout() {
    await supabaseClient.auth.signOut();

    router.push("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Loading...
      </main>
    );
  }

    return (
    <main className="min-h-screen bg-White text-Black">

        <div className="w-full border-b bg-linear-to-r from-blue-600 to-purple-900 text-white px-8 py-6 grid grid-cols-[1fr_auto_1fr] items-center gap-6 mb-10">

        {/* Left */}
        <div className="flex items-center gap-4">
            <button
            onClick={() => router.push("/")}
            className="flex h-15 w-15 items-center justify-center rounded-xl bg-blue-700 border border-blue-800 hover:border-indigo-400 transition-all"
            title="Home"
            >
            <Home size={26} />
            </button>

            <div>
            <h1 className="text-4xl font-bold tracking-tight">
                Planit Poker
            </h1>

            <p className="text-blue-100 text-sm mt-1">
                Real-time agile estimation for your team
            </p>
            </div>
        </div>

        {/* Center */}
        <div className="text-center">
            <h2 className="text-3xl font-bold">
            My Rooms
            </h2>

            <p className="text-blue-100 mt-1">
            {user?.email}
            </p>
        </div>

        {/* Right */}
        <div className="flex items-center justify-end gap-3">
            <button
            onClick={logout}
            className="rounded-xl bg-red-600 hover:bg-red-700 px-5 py-3 font-semibold transition-all"
            >
            Logout
            </button>
        </div>

        </div>
        <div className="max-w-7xl mx-auto px-6 py-10">

        {sessions.length === 0 ? (

        <div className="text-center">
            <h2 className="text-3xl font-bold mb-3">
                No Rooms Found
            </h2>
            <p className="text-slate-400 mb-6">
                You have not created any rooms yet.
            </p>
            <button
                onClick={() => router.push("/")}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3 font-semibold"
            >
                Create First Room
            </button>
        </div>

        ) : (

            <div className="space-y-4">

            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_220px] px-4 py-2 text-lg text-Black font-bold">
                <div>Session</div>
                <div>Room</div>
                <div>Participants</div>
                <div>Status</div>
                <div>Completed</div>
                <div className="text-right">Actions</div>
            </div>

            {sessions.map((session) => (
                <div
                key={session.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_220px] items-center rounded-2xl border border-slate-800 bg-blue-900 p-4 hover:border-indigo-500 transition-all"
                >
                <div className="font-bold text-white truncate pr-4">
                    {session.name}
                </div>

                <div>
                    <div className="text-white font-semibold">
                    {session.room_code}
                    </div>
                </div>

                <div>
                    <div className="text-white font-semibold">
                    {(session.participants?.[0]?.count ?? 0) - 1}
                    </div>
                </div>

                <div>
                    <div className="text-white font-semibold">
                    {session.active_ticket_id
                        ? "🟢 Active"
                        : "⚪ Inactive"}
                    </div>
                </div>

                <div>
                    <div className="text-white font-semibold">
                    {session.completed_tickets ?? 0}
                    </div>
                </div>

                <div className="flex justify-end items-center gap-3">
                    <button
                    onClick={() =>
                        router.push(
                        `/room/${session.room_code}/board`
                        )
                    }
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 font-semibold whitespace-nowrap"
                    >
                    Open Room
                    </button>

                    <button
                    onClick={() => {
                        navigator.clipboard.writeText(
                        `${window.location.origin}/room/${session.room_code}`
                        );
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700"
                    title="Copy Invite"
                    >
                    <Copy size={18} />
                    </button>
                </div>
                </div>
            ))}

            </div>

        )}

        </div>

    </main>
    );
}