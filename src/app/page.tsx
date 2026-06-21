"use client";
import { User } from "@supabase/supabase-js";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../lib/supabaseClient";

export default function Home() {
  const router = useRouter();

  const [projectName, setProjectName] =
    useState("");

  const [roomCode, setRoomCode] =
    useState("");

  const [loading, setLoading] =
    useState(false);

const [user, setUser] = useState<User | null>(null);

  const [votingType, setVotingType] =
    useState("fibonacci");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } =
        await supabaseClient.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
    }

    loadUser();
  }, [router]);

  async function createSession() {
    if (!projectName.trim()) {
      alert("Please enter project name");
      return;
    }

    if (!user) {
      alert("Please login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/sessions",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: projectName.toUpperCase(),
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

      alert(
        "Failed to create session"
      );
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await supabaseClient.auth.signOut();

    router.push("/login");
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

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-5xl font-bold mb-2">
              Planit Poker
            </h1>

            <p className="text-slate-400">
              {user.email}
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={() =>
                router.push("/rooms")
              }
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-3 font-semibold"
            >
              My Rooms
            </button>

            <button
              onClick={logout}
              className="rounded-xl bg-red-600 hover:bg-red-700 px-5 py-3 font-semibold"
            >
              Logout
            </button>

          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

            <h2 className="text-2xl font-semibold mb-6">
              Create Session
            </h2>

            <input
              value={projectName}
              onChange={(e) =>
                setProjectName(
                  e.target.value
                )
              }
              placeholder="Project Name"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 mb-4"
            />

            <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 mb-4 text-slate-300">
              Creator:
              {" "}
              {user.email}
            </div>

            <select
              value={votingType}
              onChange={(e) =>
                setVotingType(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 mb-6"
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
              onClick={createSession}
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-3 font-semibold"
            >
              {loading
                ? "Creating..."
                : "Create Session"}
            </button>

          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

            <h2 className="text-2xl font-semibold mb-6">
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
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 mb-6"
            />

            <button
              onClick={joinRoom}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-3 font-semibold"
            >
              Join Room
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}