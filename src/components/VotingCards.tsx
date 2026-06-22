"use client";

const votingSets: Record<
  string,
  string[]
> = {
  fibonacci: [
    "1",
    "2",
    "3",
    "5",
    "8",
    "13",
  ],

  even: [
    "2",
    "4",
    "6",
    "8",
    "10",
    "12",
    "14",
    "16",
  ],

  odd: [
    "1",
    "3",
    "5",
    "7",
    "9",
    "11",
    "13",
    "15",
  ],

};

export default function VotingCards({
  votingType,
  selectedVote,
  disabled,
  onVote,
}: {
  votingType: string;

  selectedVote:
    | string
    | null;

  disabled?: boolean;

  onVote: (
    value: string
  ) => void;
}) {
  const cards =
    votingSets[
      votingType
    ] ||
    votingSets.fibonacci;

  return (
    <div className="grid grid-cols-5 md:grid-cols-5 lg:grid-cols-6 gap-6">

      {cards.map(
        (value) => (
          <button
            key={value}
            disabled={
              disabled
            }
            onClick={() =>
              onVote(value)
            }
            className={`
              h-50
              w-full
              rounded-2xl
              border
              font-bold
              text-4xl
              text-white
              bg-slate-900
              transition-all
              duration-200
              hover:-translate-y-1
              hover:shadow-xl

              ${
                selectedVote === value
                  ? "bg-indigo-600 border-indigo-400 text-white shadow-lg scale-105"
                  : "bg-slate-900 border-slate-700 text-white hover:border-indigo-400 hover:bg-slate-800"
              }

              ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            `}
          >
            {value}
          </button>
        )
      )}

    </div>
  );
}