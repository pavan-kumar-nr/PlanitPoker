// src/components/board/ParticipantsPanel.tsx

"use client";

type Participant = {
  id: string;
  name: string;
  role: string;
  hasVoted?: boolean;
  voteValue?: string | null;
  comment?: string | null;
};

type Props = {
  participants: Participant[];

  creatorName: string | null;

  showResults: boolean;

  isCreator: boolean;

  activeTicketExists: boolean;

  onRevealVotes: () => void;
};

export default function ParticipantsPanel({
  participants,
  creatorName,
  showResults,
  isCreator,
  activeTicketExists,
  onRevealVotes,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 h-full">

      {/* Creator */}
      <div className="text-center mb-6">

        <div className="text-xl font-bold text-white">
          {creatorName}
        </div>

        <div className="text-yellow-400 text-sm font-semibold mt-1">
          Session Creator
        </div>

      </div>

      <div className="border-t border-slate-600 mb-4"></div>

      <h2 className="text-lg font-bold text-blue-300 mb-4">
        Participants
      </h2>

      <div className="space-y-3">

        {participants
          .filter(
            (participant) =>
              participant.role !== "CREATOR"
          )
          .map((participant) => (
            <div
              key={participant.id}
              className="rounded-xl bg-slate-700 p-4"
            >

              <div className="flex justify-between items-center">

                <div>

                  <div className="font-semibold text-white">
                    {participant.name}
                  </div>

                  <div className="text-xs text-slate-400">
                    {participant.role}
                  </div>

                </div>

                <div>

                  {participant.role ===
                  "SPECTATOR" ? (
                    <span className="text-slate-400">
                      👀
                    </span>
                  ) : showResults ? (
                    <span className="font-bold text-indigo-400">
                      {participant.voteValue ?? "-"}
                    </span>
                  ) : participant.hasVoted ? (
                    <span className="text-emerald-400">
                      ✓ Voted
                    </span>
                  ) : (
                    <span className="text-amber-400">
                      ⏳ Waiting
                    </span>
                  )}

                </div>

              </div>

              {showResults &&
                participant.comment && (
                  <div className="mt-2 text-xs text-slate-300">
                    {participant.comment}
                  </div>
                )}

            </div>
          ))}
      </div>

      {isCreator &&
        activeTicketExists &&
        !showResults && (
          <button
            onClick={onRevealVotes}
            className="mt-5 w-full rounded-xl bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700"
          >
            Reveal Votes
          </button>
        )}
    </div>
  );
}