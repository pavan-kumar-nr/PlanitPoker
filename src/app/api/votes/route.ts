import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    ticketId,
    participantId,
    voteValue,
  } = body;

  const { data, error } =
    await supabase
      .from("votes")
      .upsert(
        {
          ticket_id: ticketId,
          participant_id: participantId,
          vote_value: voteValue,
        },
        {
          onConflict:
            "ticket_id,participant_id",
        }
      )
      .select()
      .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}