// src/components/board/SessionHeader.tsx

"use client";

import { FiShare2 } from "react-icons/fi";

type Props = {
  session: {
    name: string;
    room_code: string;
    voting_type: string;
  } | null;

  copied: boolean;

  onCopyInvite: () => void;

  onExport: () => void;

  onPdf: () => void;

  onSummary: () => void;

onCompleteSession: () => void;

  sessionCompleted: boolean;

  isCreator: boolean;
};

export default function SessionHeader({
  session,
  copied,
  onCopyInvite,
  onExport,
  onPdf,
  onSummary,
  onCompleteSession,
  sessionCompleted,
  isCreator,
}: Props) {
  return (
    <div className="mb-6 rounded-3xl border border-slate-700 bg-slate-800 p-6">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Left */}
        <div>
          <h1 className="inline-block border-b-2 border-indigo-500 pb-2 text-4xl font-bold text-white">
            {session?.name}
          </h1>

          <div className="mt-4 text-slate-300">
            Room Code:
            <span className="ml-2 font-semibold text-white">
              {session?.room_code}
            </span>
          </div>

          <div className="mt-1 text-slate-300">
            Voting Type:
            <span className="ml-2 font-semibold text-white">
              {session?.voting_type}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex flex-col items-start gap-2">
            <button
              onClick={onCopyInvite}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700"
            >
              <FiShare2 />
              Invite Link
            </button>

            {copied && (
              <div className="rounded-lg border border-green-700 bg-green-900/30 px-3 py-2 text-sm text-green-300">
                ✓ link copied
              </div>
            )}
          </div>

          {isCreator && (
            <>
              <button
                onClick={onExport}
                className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
              >
                Export Excel
              </button>

              <button
                onClick={onPdf}
                className="rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white transition hover:bg-violet-700"
              >
                PDF Report
              </button>

              <button
                onClick={onSummary}
                className="rounded-xl bg-cyan-600 px-4 py-2 font-semibold text-white transition hover:bg-cyan-700"
              >
                Summary
              </button>
            </>
          )}

          {isCreator && !sessionCompleted && (
            <button
              onClick={onCompleteSession}
              className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
            >
              Complete Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
  
}