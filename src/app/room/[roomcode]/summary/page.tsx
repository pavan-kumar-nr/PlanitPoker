import { supabase } from "../../../../lib/supabase";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    roomcode: string;
  }>;
};

export default async function SummaryPage({
  params,
}: Props) {
  const { roomcode } =
    await params;

  const {
    data: session,
    error: sessionError,
  } = await supabase
    .from("sessions")
    .select("*")
    .eq(
      "room_code",
      roomcode
    )
    .single();

  if (
    sessionError ||
    !session
  ) {
    notFound();
  }

  const {
    data: tickets,
  } = await supabase
    .from("tickets")
    .select("*")
    .eq(
      "session_id",
      session.id
    )
    .eq(
      "completed",
      true
    )
    .order(
      "created_at",
      {
        ascending: true,
      }
    );

  const completedCount =
    tickets?.length ?? 0;

  const estimates =
    tickets
      ?.map((t) =>
        Number(
          t.final_estimate
        )
      )
      .filter(
        (n) =>
          !isNaN(n)
      ) ?? [];

  const average =
    estimates.length
      ? (
          estimates.reduce(
            (a, b) =>
              a + b,
            0
          ) /
          estimates.length
        ).toFixed(1)
      : "0";

  const highest =
    estimates.length
      ? Math.max(
          ...estimates
        )
      : 0;

  const lowest =
    estimates.length
      ? Math.min(
          ...estimates
        )
      : 0;

  return (
    <main className="min-h-screen bg-white">

      {/* Header */}

      <div className="w-full bg-linear-to-r from-blue-600 to-purple-900 text-white px-8 py-6">

        <h1 className="text-4xl font-bold">
          Session Summary
        </h1>

        <p className="mt-2 text-blue-100">
          Planning Poker Results
        </p>

      </div>

      <div className="max-w-7xl mx-auto p-8">

        {/* Session Info */}

        <div className="rounded-3xl bg-slate-800 p-6 text-white mb-6">

          <h2 className="text-3xl font-bold">
            {session.name}
          </h2>

          <div className="mt-4 grid md:grid-cols-3 gap-4">

            <div>
              <div className="text-slate-400">
                Room Code
              </div>

              <div className="font-semibold">
                {
                  session.room_code
                }
              </div>
            </div>

            <div>
              <div className="text-slate-400">
                Voting Type
              </div>

              <div className="font-semibold">
                {
                  session.voting_type
                }
              </div>
            </div>

            <div>
              <div className="text-slate-400">
                Creator
              </div>

              <div className="font-semibold">
                {
                  session.creator_name
                }
              </div>
            </div>

          </div>

        </div>

        {/* Analytics */}

        <div className="grid md:grid-cols-4 gap-4 mb-6">

          <div className="rounded-2xl bg-slate-800 p-5 text-white">

            <div className="text-slate-400 text-sm">
              Completed Tickets
            </div>

            <div className="text-3xl font-bold mt-2">
              {completedCount}
            </div>

          </div>

          <div className="rounded-2xl bg-slate-800 p-5 text-white">

            <div className="text-slate-400 text-sm">
              Average Estimate
            </div>

            <div className="text-3xl font-bold mt-2">
              {average}
            </div>

          </div>

          <div className="rounded-2xl bg-slate-800 p-5 text-white">

            <div className="text-slate-400 text-sm">
              Highest Estimate
            </div>

            <div className="text-3xl font-bold mt-2">
              {highest}
            </div>

          </div>

          <div className="rounded-2xl bg-slate-800 p-5 text-white">

            <div className="text-slate-400 text-sm">
              Lowest Estimate
            </div>

            <div className="text-3xl font-bold mt-2">
              {lowest}
            </div>

          </div>

        </div>

        {/* Ticket Results */}

        <div className="rounded-3xl bg-slate-800 p-6">

          <h2 className="text-2xl font-bold text-white mb-6">
            Completed Tickets
          </h2>

          {tickets &&
          tickets.length >
            0 ? (

            <div className="space-y-4">

              {tickets.map(
                (
                  ticket
                ) => (
                  <div
                    key={
                      ticket.id
                    }
                    className="rounded-2xl bg-slate-700 p-5"
                  >

                    <div className="flex justify-between items-start">

                      <div>

                        <div className="text-lg font-bold text-white">
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

                      <div className="rounded-full bg-indigo-600 px-4 py-2 text-white font-bold">
                        {
                          ticket.final_estimate
                        }
                      </div>

                    </div>

                    {ticket.final_comment && (

                      <div className="mt-4 rounded-xl bg-slate-800 p-4">

                        <div className="text-xs text-slate-400 mb-1">
                          Final Comment
                        </div>

                        <div className="text-white">
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

          ) : (

            <div className="text-slate-400">
              No completed tickets found
            </div>

          )}

        </div>

      </div>

    </main>
  );
}