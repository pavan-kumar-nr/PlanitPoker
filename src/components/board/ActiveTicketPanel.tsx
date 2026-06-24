"use client";

import VotingCards from "../VotingCards";
import type { Ticket } from "../../types/database";

type ActiveTicketWithVoting =
  Ticket & {
    voting_type?: string;
  };

type Props = {
   activeTicket:
    | ActiveTicketWithVoting
    | null;
  canVote: boolean;
  myVote: string | null;
  submitVote: (value: string) => void;
  showResults: boolean;
  finalEstimate: string;
  setFinalEstimate: (
    value: string
  ) => void;
  finalComment: string;
  setFinalComment: (
    value: string
  ) => void;
  completeTicket: () => void;
  isCreator: boolean;
};

export default function ActiveTicketPanel({
  activeTicket,
  canVote,
  myVote,
  submitVote,
  showResults,
  finalEstimate,
  setFinalEstimate,
  finalComment,
  setFinalComment,
  completeTicket,
  isCreator,
}: Props) {
  if (!activeTicket) {
    return (
      <div className="h-full rounded-3xl border border-slate-700 bg-slate-800 p-8">
        <div className="text-center text-slate-400">
          No Active Ticket
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 h-full">

      <h2 className="text-center text-3xl font-bold text-white mb-6">
        Active Ticket
      </h2>

      <div className="border-b border-slate-600 pb-5 mb-6">

        <div className="text-3xl font-bold text-white">
          {activeTicket.ticket_key}
        </div>

        <div className="text-xl mt-2 text-slate-300">
          {activeTicket.title}
        </div>

        {activeTicket.description && (
          <div className="mt-4 text-slate-400">
            {activeTicket.description}
          </div>
        )}

      </div>

      {canVote && !showResults && (
        <>
          <h3 className="text-lg font-semibold text-white mb-4">
            Voting
          </h3>

          <VotingCards
            votingType={
              activeTicket.voting_type ??
              "fibonacci"
            }
            selectedVote={myVote}
            disabled={
              activeTicket.votes_revealed
            }
            onVote={submitVote}
          />

          {myVote && (
            <div className="mt-5 rounded-xl border border-slate-600 bg-slate-700 p-4">
              <span className="text-slate-300">
                Your Vote:
              </span>

              <span className="ml-3 text-xl font-bold text-indigo-400">
                {myVote}
              </span>
            </div>
          )}
        </>
      )}

      {showResults &&
        isCreator && (
          <div className="mt-8 border-t border-slate-600 pt-6">

            <h3 className="text-xl font-bold text-white mb-4">
              Finalize Ticket
            </h3>

            <input
              value={finalEstimate}
              onChange={(e) =>
                setFinalEstimate(
                  e.target.value
                )
              }
              placeholder="Final Estimate"
              className="w-full rounded-xl bg-white text-black px-4 py-3 mb-4"
            />

            <textarea
              value={finalComment}
              onChange={(e) =>
                setFinalComment(
                  e.target.value
                )
              }
              placeholder="Final Comment"
              rows={4}
              className="w-full rounded-xl bg-white text-black px-4 py-3 mb-4"
            />

            <button
              onClick={
                completeTicket
              }
              className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-700"
            >
              Finalize Ticket
            </button>

          </div>
        )}

    </div>
  );
}