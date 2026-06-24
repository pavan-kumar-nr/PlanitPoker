"use client";

type Props = {
  completedTickets: number;
  participantCount: number;
  averageEstimate: number;
  highestEstimate: number;
  lowestEstimate: number;
  mostCommonEstimate: string;
};

export default function AnalyticsPanel({
  completedTickets,
  participantCount,
  averageEstimate,
  highestEstimate,
  lowestEstimate,
  mostCommonEstimate,
}: Props) {
  const cards = [
    {
      label: "Completed Tickets",
      value: completedTickets,
    },
    {
      label: "Participants",
      value: participantCount,
    },
    {
      label: "Average Estimate",
      value: averageEstimate,
    },
    {
      label: "Highest Estimate",
      value: highestEstimate,
    },
    {
      label: "Lowest Estimate",
      value: lowestEstimate,
    },
    {
      label: "Most Common",
      value:
        mostCommonEstimate || "-",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 mb-6">

      <h2 className="text-xl font-bold text-white mb-6">
        Session Analytics
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        {cards.map((card) => (
          <div
            key={card.label}
            className="
              rounded-2xl
              border
              border-slate-600
              bg-slate-900
              p-5
            "
          >
            <div className="text-xs text-slate-400">
              {card.label}
            </div>

            <div className="mt-2 text-3xl font-bold text-white">
              {card.value}
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}