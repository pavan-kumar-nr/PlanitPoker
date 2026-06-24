"use client";

type VoteItem = {
  vote_value: string;
  comment: string | null;
  participants: {
    name: string;
  };
};

type TicketSummary = {
  id: string;
  ticket_key: string;
  title: string;
  final_estimate: string | null;
  final_comment: string | null;
  votes: VoteItem[];
};

export default function SessionSummary({
  tickets,
}: {
  tickets: TicketSummary[];
}) {
  return (
    <div className="space-y-6">

      {tickets.map(
        (ticket) => (
          <div
            key={ticket.id}
            className="
              rounded-2xl
              border
              border-slate-700
              bg-slate-800
              p-5
            "
          >
            <div className="flex justify-between">

              <div>

                <div className="text-xl font-bold text-white">
                  {
                    ticket.ticket_key
                  }
                </div>

                <div className="text-slate-300">
                  {
                    ticket.title
                  }
                </div>

              </div>

              <div className="text-right">

                <div className="text-slate-400 text-sm">
                  Final Estimate
                </div>

                <div className="text-2xl font-bold text-green-400">
                  {
                    ticket.final_estimate
                  }
                </div>

              </div>

            </div>

            {ticket.final_comment && (
              <div className="mt-4 rounded-xl bg-slate-900 p-3">

                <div className="text-sm text-slate-400">
                  Final Comment
                </div>

                <div className="text-white">
                  {
                    ticket.final_comment
                  }
                </div>

              </div>
            )}

            <div className="mt-5">

              <div className="font-semibold text-white mb-3">
                Votes & Comments
              </div>

              <div className="space-y-2">

                {ticket.votes.map(
                  (
                    vote,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="
                        rounded-xl
                        bg-slate-900
                        p-3
                      "
                    >
                      <div className="flex justify-between">

                        <div className="font-semibold text-white">
                          {
                            vote
                              .participants
                              ?.name
                          }
                        </div>

                        <div className="text-indigo-400 font-bold">
                          {
                            vote.vote_value
                          }
                        </div>

                      </div>

                      {vote.comment && (
                        <div className="text-slate-300 mt-2">
                          {
                            vote.comment
                          }
                        </div>
                      )}

                    </div>
                  )
                )}

              </div>

            </div>

          </div>
        )
      )}

    </div>
  );
}