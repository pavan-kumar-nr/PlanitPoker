"use client";
import { Copy, } from "lucide-react";

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
  
  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {
        router.replace("/signup");
      }
    }

    checkSession();
  }, [router]);

  const [user, setUser] =
    useState<User | null>(null);

  const [sessions, setSessions] =
    useState<Session[]>([]);

  const [loading, setLoading] =
    useState(true);
    
    const [projectName, setProjectName] =
  useState("");

const [roomCode, setRoomCode] =
  useState("");

const [votingType, setVotingType] =
  useState("fibonacci");

const [creating, setCreating] =
  useState(false);

  const [
  showHistory,
  setShowHistory,
] = useState(false);

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

useEffect(() => {
  async function checkSession() {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    console.log("ROOMS SESSION", session);

    if (!session) {
      router.replace("/signup");
    }
  }

  checkSession();
}, [router]);

async function createSession() {

  if (!projectName.trim()) {
    alert(
      "Please enter session name"
    );
    return;
  }

  if (!user) {
    return;
  }

  try {

    setCreating(true);

    const response =
      await fetch(
        "/api/sessions",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name:
              projectName,

            creatorName:
              user.email,

            votingType,

            createdBy:
              user.id,
          }),
        }
      );

    const session =
      await response.json();

    localStorage.setItem(
      "participant-name",
      user.email ?? ""
    );

    localStorage.setItem(
      "participant-role",
      "CREATOR"
    );

    router.push(
      `/room/${session.room_code}/board`
    );

  } catch (error) {

    console.error(error);

  } finally {

    setCreating(false);

  }
}

function joinRoom() {

  if (!roomCode.trim()) {

    alert(
      "Please enter room code"
    );

    return;
  }

  router.push(
    `/room/${roomCode.toUpperCase()}`
  );
}

  async function logout() {
    await supabaseClient.auth.signOut();

    router.replace("/login");
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

          <div>
            <h1 className="text-4xl font-bold tracking-tight">
                Planit Poker
            </h1>

            <p className="text-blue-100 text-md mt-1">
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
          {/* CREATE / JOIN */}

            <div className="grid lg:grid-cols-2 gap-8 mb-10">

              {/* Create Session */}

              <div className="rounded-3xl border border-slate-800 bg-blue-900 p-8">

                <h2 className="text-3xl font-bold text-white mb-6">
                  Create Session
                </h2>

                <input
                  value={projectName}
                  onChange={(e) =>
                    setProjectName(
                      e.target.value
                    )
                  }
                  placeholder="Sprint Name"
                  className="w-full rounded-xl bg-white px-4 py-3 text-black mb-4"
                />

                <div className="w-full rounded-xl bg-white px-4 py-3 text-black mb-4">
                  {user?.email}
                </div>

                <select
                  value={votingType}
                  onChange={(e) =>
                    setVotingType(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl bg-white px-4 py-3 text-black mb-6"
                >

                  <option value="fibonacci">
                    Fibonacci
                  </option>

                  <option value="even">
                    Even Numbers
                  </option>

                  <option value="odd">
                    Odd Numbers
                  </option>

                </select>

                <button
                  onClick={
                    createSession
                  }
                  disabled={creating}
                  className="
                    w-full
                    rounded-xl
                    bg-indigo-600
                    hover:bg-indigo-700
                    py-3
                    text-white
                    font-semibold
                  "
                >

                  {creating
                    ? "Creating..."
                    : "Create Session"}

                </button>

              </div>

              {/* Join Session */}

              <div className="rounded-3xl border border-slate-800 bg-blue-900 p-8">

                <h2 className="text-3xl font-bold text-white mb-6">
                  Join Existing Room
                </h2>

                <input
                  value={roomCode}
                  onChange={(e) =>
                    setRoomCode(
                      e.target.value
                    )
                  }
                  placeholder="Room Code"
                  className="w-full rounded-xl bg-white px-4 py-3 text-black mb-6"
                />

                <button
                  onClick={
                    joinRoom
                  }
                  className="
                    w-full
                    rounded-xl
                    bg-emerald-600
                    hover:bg-emerald-700
                    py-3
                    text-white
                    font-semibold
                  "
                >

                  Join Room

                </button>

              </div>
            </div>

      <div className="my-10 border-t border-black" />

        {/* SESSION HISTORY */}

          <div className="rounded-3xl border border-slate-300 overflow-hidden">

            {/* Header */}

            <button
              onClick={() =>
                setShowHistory(
                  !showHistory
                )
              }
              className="
                w-full
                flex
                items-center
                justify-between
                px-6
                py-5
                bg-slate-100
                hover:bg-slate-200
                transition-all
              "
            >

              <div>

                <h2 className="text-2xl font-bold text-left">
                  Session History
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  View all previously created planning sessions
                </p>

              </div>

              <div className="text-2xl font-bold">

                {showHistory
                  ? "📖hide"
                  : "📕show"}

              </div>

            </button>

            {/* Content */}

            {showHistory && (

              <div className="p-6 bg-white">

                {sessions.length === 0 ? (

                  <div className="text-center py-10">

                    <h3 className="text-2xl font-bold mb-2">
                      No Sessions Yet
                    </h3>

                    <p className="text-slate-500">
                      Create your first planning session above.
                    </p>

                  </div>

                ) : (

                  <div className="space-y-4">

                    {/* Table Header */}

                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_220px] px-4 py-2 text-lg font-bold">

                      <div>Session</div>

                      <div>Room</div>

                      <div>Participants</div>

                      <div>Status</div>

                      <div>Completed</div>

                      <div className="text-right">
                        Actions
                      </div>

                    </div>

                    {sessions.map(
                      (session) => (

                        <div
                          key={
                            session.id
                          }
                          className="
                            grid
                            grid-cols-[2fr_1fr_1fr_1fr_1fr_220px]
                            items-center
                            rounded-2xl
                            border
                            border-slate-800
                            bg-blue-900
                            p-4
                            hover:border-indigo-500
                            transition-all
                          "
                        >

                          <div className="font-bold text-white truncate pr-4">
                            {
                              session.name
                            }
                          </div>

                          <div className="text-white font-semibold">
                            {
                              session.room_code
                            }
                          </div>

                          <div className="text-white font-semibold">
                            {
                              (session.participants?.[0]?.count ?? 0) - 1
                            }
                          </div>

                          <div className="text-white font-semibold">
                            {session.active_ticket_id
                              ? "🟢 Active"
                              : "⚪ Inactive"}
                          </div>

                          <div className="text-white font-semibold">
                            {
                              session.completed_tickets ?? 0
                            }
                          </div>

                          <div className="flex justify-end gap-3">

                            <button
                              onClick={() =>
                                router.push(
                                  `/room/${session.room_code}/board`
                                )
                              }
                              className="
                                rounded-xl
                                bg-indigo-600
                                hover:bg-indigo-700
                                px-5
                                py-2
                                text-white
                                font-semibold
                              "
                            >
                              Open Room
                            </button>

                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  `${window.location.origin}/room/${session.room_code}`
                                )
                              }
                              className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-emerald-600
                                hover:bg-emerald-700
                              "
                            >
                              <Copy size={18} />
                            </button>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            )}

          </div>

        </div>

    </main>
    );
}