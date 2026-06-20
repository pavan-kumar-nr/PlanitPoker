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

  async function joinRoom(
    role:
      | "VOTER"
      | "SPECTATOR"
  ) {
    if (!name.trim()) {
      alert(
        "Please enter your name"
      );
      return;
    }

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
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-2xl">

        <div className="text-center mb-10">

          <h1 className="text-5xl font-bold text-white">
            Planit Poker
          </h1>

          <p className="mt-3 text-slate-300 text-lg">
            Agile Planning Poker
            for modern teams
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-10 shadow-2xl">

          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Join Session
          </h2>

          <div className="mb-6">

            <label className="block text-slate-300 mb-2 text-lg">
              Room Code
            </label>

            <div className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-4 text-xl font-semibold text-white">
              {roomCode}
            </div>

          </div>

          <div className="mb-8">

            <label className="block text-slate-300 mb-2 text-lg">
              Your Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Enter your name"
              className="
                w-full
                bg-slate-950
                border
                border-slate-700
                rounded-xl
                px-4
                py-4
                text-lg
                text-white
                placeholder:text-slate-500
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            />

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <div className="relative group">

              <button
                onClick={() =>
                  joinRoom(
                    "VOTER"
                  )
                }
                className="
                  w-full
                  bg-indigo-600
                  hover:bg-indigo-700
                  hover:scale-[1.02]
                  transition-all
                  rounded-xl
                  py-4
                  text-lg
                  font-semibold
                  text-white
                "
              >
                Join as Voter
              </button>

              <div
              className="
                absolute
                left-1/2
                -translate-x-1/2
                top-full
                mt-2
                hidden
                group-hover:block
                whitespace-nowrap
                bg-slate-800
                border
                border-slate-700
                text-slate-200
                text-sm
                px-3
                py-2
                rounded-lg
                shadow-lg
                z-10
              "
              >
                Participate in voting
                and estimation
              </div>

            </div>

            <div className="relative group">

              <button
                onClick={() =>
                  joinRoom(
                    "SPECTATOR"
                  )
                }
                className="
                  w-full
                  bg-slate-700
                  hover:bg-slate-600
                  hover:scale-[1.02]
                  transition-all
                  rounded-xl
                  py-4
                  text-lg
                  font-semibold
                  text-white
                "
              >
                Join as Spectator
              </button>

              <div
              className="
                absolute
                left-1/2
                -translate-x-1/2
                top-full
                mt-2
                hidden
                group-hover:block
                whitespace-nowrap
                bg-slate-800
                border
                border-slate-700
                text-slate-200
                text-sm
                px-3
                py-2
                rounded-lg
                shadow-lg
                z-10
              "
              >
                View session without
                voting
              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}