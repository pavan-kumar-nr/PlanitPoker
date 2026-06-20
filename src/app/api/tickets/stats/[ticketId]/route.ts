import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      ticketId: string;
    }>;
  }
) {
  const { ticketId } =
    await context.params;

  const { data } =
    await supabase
      .from("votes")
      .select("vote_value")
      .eq("ticket_id", ticketId);

  const votes =
    (data || [])
      .map((x) =>
        Number(x.vote_value)
      )
      .filter((x) =>
        !Number.isNaN(x)
      );

  if (votes.length === 0) {
    return NextResponse.json({
      count: 0,
      average: 0,
      mostCommon: null,
    });
  }

  const average =
    votes.reduce(
      (a, b) => a + b,
      0
    ) / votes.length;

  const frequency:
    Record<
      string,
      number
    > = {};

  votes.forEach((v) => {
    frequency[v] =
      (frequency[v] || 0) + 1;
  });

  const mostCommon =
    Object.entries(
      frequency
    ).sort(
      (a, b) =>
        b[1] - a[1]
    )[0][0];

  return NextResponse.json({
    count: votes.length,
    average:
      average.toFixed(2),
    mostCommon,
  });
}