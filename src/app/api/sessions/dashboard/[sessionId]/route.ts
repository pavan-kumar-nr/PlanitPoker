import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      sessionId: string;
    }>;
  }
) {
  const { sessionId } =
    await context.params;

  const {
    data: tickets,
    error: ticketError,
  } = await supabase
    .from("tickets")
    .select("*")
    .eq(
      "session_id",
      sessionId
    )
    .eq(
      "completed",
      true
    );

  if (ticketError) {
    return NextResponse.json(
      {
        error:
          ticketError.message,
      },
      {
        status: 500,
      }
    );
  }

  const {
    data: participants,
  } = await supabase
    .from("participants")
    .select("*")
    .eq(
      "session_id",
      sessionId
    );

  const estimates =
    tickets
      .map((t) =>
        Number(
          t.final_estimate
        )
      )
      .filter(
        (v) =>
          !isNaN(v)
      );

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

  const estimateCounts:
    Record<
      string,
      number
    > = {};

  estimates.forEach(
    (value) => {
      estimateCounts[
        value
      ] =
        (
          estimateCounts[
            value
          ] || 0
        ) + 1;
    }
  );

  let mostCommon =
    "-";

  let maxCount = 0;

  Object.entries(
    estimateCounts
  ).forEach(
    ([value, count]) => {
      if (
        count >
        maxCount
      ) {
        maxCount =
          count;

        mostCommon =
          value;
      }
    }
  );

  const {
    data: votes,
  } = await supabase
    .from("votes")
    .select(`
      participant_id,
      participants (
        name
      )
    `);

  const voterCount:
    Record<
      string,
      number
    > = {};

type VoteRecord = {
  participants?: {
    name: string;
  }[];
};

votes?.forEach(
  (vote: VoteRecord) => {
const name =
  vote
    .participants?.[0]
    ?.name;

      if (!name)
        return;

      voterCount[
        name
      ] =
        (
          voterCount[
            name
          ] || 0
        ) + 1;
    }
  );

  let mostActive =
    "-";

  let mostVotes = 0;

  Object.entries(
    voterCount
  ).forEach(
    ([name, count]) => {
      if (
        count >
        mostVotes
      ) {
        mostVotes =
          count;

        mostActive =
          name;
      }
    }
  );

  return NextResponse.json({
    completedTickets:
      tickets.length,

    participants:
      participants?.filter(
        (p) =>
          p.role !==
          "CREATOR"
      ).length || 0,

    averageEstimate:
      average,

    highestEstimate:
      highest,

    lowestEstimate:
      lowest,

    mostCommonEstimate:
      mostCommon,

    mostActiveVoter:
      mostActive,
  });
}