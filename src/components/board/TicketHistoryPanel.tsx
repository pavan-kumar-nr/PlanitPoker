"use client";

import { FiEdit2 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { Ticket } from "../../types/database";

type Props = {
  history: Ticket[];

  deleteTicket: (
    ticketId: string
  ) => void;

  editEstimate: (
    ticket: Ticket
  ) => void;
};

export default function TicketHistoryPanel({
  history,
  deleteTicket,
  editEstimate,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6">

      <h2 className="text-xl font-bold text-white mb-6">
        Ticket History
      </h2>

      {history.length === 0 ? (
        <div className="text-slate-400">
          No completed tickets
        </div>
      ) : (
        <div className="space-y-4 max-h-125 overflow-y-auto">

          {history.map(
            (ticket) => (
              <div
                key={ticket.id}
                className="
                  rounded-2xl
                  border
                  border-slate-600
                  bg-slate-900
                  p-4
                "
              >
                <div className="flex justify-between items-start">

                  <div>

                    <div className="text-lg font-bold text-white">
                      {
                        ticket.ticket_key
                      }
                    </div>

                    <div className="text-slate-300">
                      {ticket.title}
                    </div>

                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        editEstimate(
                          ticket
                        )
                      }
                      className="
                        rounded-lg
                        bg-indigo-600
                        p-2
                        text-white
                        hover:bg-indigo-700
                      "
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      onClick={() =>
                        deleteTicket(
                          ticket.id
                        )
                      }
                      className="
                        rounded-lg
                        bg-red-600
                        p-2
                        text-white
                        hover:bg-red-700
                      "
                    >
                      <FiTrash2 />
                    </button>

                  </div>

                </div>

                <div className="mt-4">

                  <span className="text-slate-400">
                    Estimate:
                  </span>

                  <span className="ml-2 font-bold text-emerald-400">
                    {ticket.final_estimate ??
                      "-"}
                  </span>

                </div>

                {ticket.final_comment && (
                  <div className="mt-3 rounded-xl bg-slate-800 p-3">

                    <div className="text-xs text-slate-400 mb-1">
                      Final Comment
                    </div>

                    <div className="text-slate-300">
                      {
                        ticket.final_comment
                      }
                    </div>

                  </div>
                )}

              </div>
            )
          )}

        </div>
      )}
    </div>
  );
}