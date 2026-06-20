"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [votingType, setVotingType] =
    useState("fibonacci");

  async function createSession() {
    if (!projectName.trim()) {
      alert("Please enter project name");
      return;
    }

    if (!creatorName.trim()) {
      alert("Please enter creator name");
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
            name: projectName,
            creatorName,
            votingType,
          }),
        }
      );

      const session =
        await response.json();

      localStorage.setItem(
        "participant-name",
        creatorName
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

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold mb-4">
            Planit Poker
          </h1>

          <p className="text-slate-400">
            Agile Planning Poker for
            modern teams
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

            <h2 className="text-2xl font-semibold mb-6">
              Create ProjectSession
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

            <input
              value={creatorName}
              onChange={(e) =>
                setCreatorName(
                  e.target.value
                )
              }
              placeholder="Your Name"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 mb-4"
            />

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
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all px-4 py-3 font-semibold"
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
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-all px-4 py-3 font-semibold"
            >
              Join Room
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}