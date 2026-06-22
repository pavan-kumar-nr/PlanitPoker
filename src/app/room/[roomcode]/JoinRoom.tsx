"use client";

import { useState } from "react";
import { getClientId } from "../../../lib/clientId";

export default function JoinRoom({
  roomCode,
}: {
  roomCode: string;
}) {
  const [name, setName] =
    useState("");

  const [nameError, setNameError] =
    useState("");

const [joiningRole, setJoiningRole] =
  useState<
    "VOTER" |
    "SPECTATOR" |
    null
  >(null);

  async function joinRoom(
    role:
      | "VOTER"
      | "SPECTATOR"
  ) {
    setNameError("");

    if (!name.trim()) {
      setNameError(
        "Enter your name to join the session"
      );
      return;
    }

    try {
      setJoiningRole(role);

      const roomResponse =
        await fetch(
          `/api/room/${roomCode}`
        );

      const room =
        await roomResponse.json();

      const clientId =
        getClientId();

      const participantResponse =
        await fetch(
          "/api/participants",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              sessionId: room.id,
              name,
              role,
              clientId,
            }),
          }
        );

      const participant =
        await participantResponse.json();

      localStorage.setItem(
        "participant-id",
        participant.id
      );

      localStorage.setItem(
        "participant-role",
        role
      );

      localStorage.setItem(
        "participant-name",
        name
      );

      localStorage.setItem(
        "session-id",
        room.id
      );

      window.location.href =
        `/room/${roomCode}/board`;
    } catch (error) {
      console.error(error);

      setNameError(
        "Unable to join session"
      );
    } finally {
      setJoiningRole(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">

      <div className="w-full border-b bg-linear-to-r from-blue-600 to-orange-900 px-8 py-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Planit Poker
        </h1>

        <p className="mt-2 text-blue-100">
          Real-time agile estimation for your team
        </p>
      </div>

      <div className="flex-1 flex bg-white items-center justify-center px-6 py-10">

        <div className="w-full max-w-2xl">

          <div className="rounded-3xl border border-slate-700 bg-blue-900 p-10 shadow-2xl">

            <h2 className="mb-8 text-center text-3xl font-bold">
              Join Session
            </h2>

            <div className="mb-6">

              <label className="mb-2 block text-lg text-slate-300">
                Room Code
              </label>

              <div className="rounded-xl border border-slate-700 bg-white px-4 py-4 text-xl font-semibold text-black">
                {roomCode}
              </div>

            </div>

            <div className="mb-8">

              <label className="mb-2 block text-lg text-slate-300">
                Your Name
              </label>

              <input
                value={name}
                onChange={(e) => {
                  setName(
                    e.target.value.toUpperCase()
                  );

                  if (nameError) {
                    setNameError("");
                  }
                }}
                placeholder="Enter your name"
                className={`
                  w-full
                  rounded-xl
                  border
                  px-4
                  py-4
                  text-lg
                  text-black
                  placeholder:text-black
                  bg-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                  ${
                    nameError
                      ? "border-red-500 bg-slate-950"
                      : "border-slate-700 bg-slate-950"
                  }
                `}
              />

              {nameError && (
                <p className="mt-2 text-sm text-red-400">
                  {nameError}
                </p>
              )}

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <div className="group relative">

                <button
                  disabled={
                    joiningRole !== null
                  }
                  onClick={() =>
                    joinRoom(
                      "VOTER"
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    bg-indigo-600
                    py-4
                    text-lg
                    font-semibold
                    text-white
                    transition-all
                    hover:scale-[1.02]
                    hover:bg-indigo-700
                    disabled:opacity-50
                  "
                >
                  {joiningRole === "VOTER"
                    ? "Joining..."
                    : "Join as Voter"}
                </button>

                <div
                  className="
                    invisible
                    absolute
                    left-1/2
                    top-full
                    z-10
                    mt-2
                    -translate-x-1/2
                    whitespace-nowrap
                    rounded-lg
                    border
                    border-slate-700
                    bg-slate-800
                    px-3
                    py-2
                    text-sm
                    text-slate-200
                    opacity-0
                    shadow-lg
                    transition-all
                    duration-200
                    group-hover:visible
                    group-hover:opacity-100
                  "
                >
                  Participate in voting and estimation
                </div>

              </div>

              <div className="group relative">

                <button
                  disabled={
                    joiningRole !== null
                  }
                  onClick={() =>
                    joinRoom(
                      "SPECTATOR"
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    bg-orange-400
                    py-4
                    text-lg
                    font-semibold
                    text-white
                    transition-all
                    hover:scale-[1.02]
                    hover:bg-orange-500
                    disabled:opacity-50
                  "
                >
                  {joiningRole === "SPECTATOR"
                    ? "Joining..."
                    : "Join as Spectator"}
                </button>

                <div
                  className="
                    invisible
                    absolute
                    left-1/2
                    top-full
                    z-10
                    mt-2
                    -translate-x-1/2
                    whitespace-nowrap
                    rounded-lg
                    border
                    border-slate-700
                    bg-slate-800
                    px-3
                    py-2
                    text-sm
                    text-slate-200
                    opacity-0
                    shadow-lg
                    transition-all
                    duration-200
                    group-hover:visible
                    group-hover:opacity-100
                  "
                >
                  View session without voting
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}