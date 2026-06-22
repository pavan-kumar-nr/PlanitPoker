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

    <main className="min-h-screen w-full bg-white text-black">
      <div className="w-full border-b bg-linear-to-r from-blue-600 to-purple-900 text-white px-8 py-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Planit Poker
        </h1>
        <p className="mt-2 text-blue-100">
          Real-time agile estimation for your team
        </p>
      </div>



<div className="flex items-center justify-center px-6 py-12">

  <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-10">

    {/* Create Session */}

    <div className="w-full rounded-3xl border border-slate-800 bg-blue-900 p-8">

      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Create Session
      </h2>

      <div className="mb-4">

        <input
          value={projectName}
          onChange={(e) =>
            setProjectName(
              e.target.value
            )
          }
          placeholder="Sprint Name"
          className="w-full rounded-xl bg-white px-4 py-3 text-black border border-slate-700"
        />

      </div>

      <div className="mb-4">

        <div className="w-full rounded-xl bg-white px-4 py-3 text-black border border-slate-700">
          Creator: {user.email}
        </div>

      </div>

      <div className="mb-6">

        <select
          value={votingType}
          onChange={(e) =>
            setVotingType(
              e.target.value
            )
          }
          className="w-full rounded-xl bg-white px-4 py-3 text-black border border-slate-700"
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

      </div>

      <button
        onClick={createSession}
        disabled={loading}
        className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 py-3 font-semibold text-white transition-all"
      >
        {loading
          ? "Creating..."
          : "Create Session"}
      </button>

    </div>

    {/* Join Room */}

    <div className="w-full rounded-3xl border border-slate-800 bg-blue-900 p-8">

      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Join Existing Room
      </h2>

      <div className="mb-6">

        <input
          value={roomCode}
          onChange={(e) =>
            setRoomCode(
              e.target.value
            )
          }
          placeholder="Room Code"
          className="w-full rounded-xl bg-white px-4 py-3 text-black border border-slate-700"
        />

      </div>

      <button
        onClick={joinRoom}
        className="w-full rounded-xl bg-green-700 hover:bg-green-800 py-3 font-semibold text-white transition-all"
      >
        Join Room
      </button>

    </div>

  </div>

</div>



    </main>
  );
}