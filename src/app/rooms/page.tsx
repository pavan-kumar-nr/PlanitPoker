"use client";
import { Copy } from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { supabaseClient } from "../../lib/supabaseClient";
import { BiArrowBack } from "react-icons/bi";

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
    <main className="min-h-screen bg-slate-950 text-white">

        <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="grid grid-cols-[60px_1fr_260px] items-center gap-4 mb-10">

            {/* Home */}
            <button
            onClick={() => router.push("/")}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 transition-all"
            title="Home"
            >
            <BiArrowBack size={22} />
            </button>

            {/* Center */}
            <div className="text-center">
            <h1 className="text-5xl font-bold">
                My Rooms
            </h1>

            <div className="text-slate-400 mt-2">
                {user?.email}
            </div>
            </div>

            {/* Right */}
            <div className="flex items-center justify-end gap-3">
            <button
                onClick={() => router.push("/")}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-3 font-semibold"
            >
                Create Session
            </button>

            <button
                onClick={logout}
                className="rounded-xl bg-red-600 hover:bg-red-700 px-5 py-3 font-semibold"
            >
                Logout
            </button>
            </div>

        </div>

        {sessions.length === 0 ? (

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">

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
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_220px] px-4 py-2 text-sm text-slate-400 font-medium">
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
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_220px] items-center rounded-2xl border border-slate-800 bg-slate-900 p-4 hover:border-indigo-500 transition-all"
                >
                <div className="font-bold text-white truncate pr-4">
                    {session.name}
                </div>

                <div>
                    <div className="text-xs text-slate-400">
                    Room
                    </div>
                    <div className="font-semibold">
                    {session.room_code}
                    </div>
                </div>

                <div>
                    <div className="text-xs text-slate-400">
                    Participants
                    </div>
                    <div className="font-semibold">
                    {session.participants?.[0]?.count ?? 0}
                    </div>
                </div>

                <div>
                    <div className="text-xs text-slate-400">
                    Status
                    </div>
                    <div className="font-semibold">
                    {session.active_ticket_id
                        ? "🟢 Active"
                        : "⚪ Idle"}
                    </div>
                </div>

                <div>
                    <div className="text-xs text-slate-400">
                    Completed
                    </div>
                    <div className="font-semibold">
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