import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  const {
    sessionId,
    name,
    role,
    clientId,
  } = body;

  const {
    data,
    error,
  } = await supabase
    .from("participants")
    .upsert(
      {
        session_id:
          sessionId,
        name,
        role,
        client_id:
          clientId,
      },
      {
        onConflict:
          "session_id,client_id",
      }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    data
  );
}

export async function GET(
  request: Request
) {
  const { searchParams } =
    new URL(request.url);

  const sessionId =
    searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      []
    );
  }

  const {
    data: session,
  } = await supabase
    .from("sessions")
    .select(
      "active_ticket_id"
    )
    .eq("id", sessionId)
    .single();

  const {
    data: participants,
    error,
  } = await supabase
    .from("participants")
    .select("*")
    .eq(
      "session_id",
      sessionId
    );

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      {
        status: 500,
      }
    );
  }

  if (
    !session?.active_ticket_id
  ) {
    return NextResponse.json(
      participants.map(
        (participant) => ({
          ...participant,
          hasVoted: false,
          voteValue: null,
        })
      )
    );
  }

  const {
    data: ticket,
  } = await supabase
    .from("tickets")
    .select(
      "votes_revealed"
    )
    .eq(
      "id",
      session.active_ticket_id
    )
    .single();

  const {
    data: votes,
  } = await supabase
    .from("votes")
    .select("*")
    .eq(
      "ticket_id",
      session.active_ticket_id
    );

  const enriched =
    participants.map(
      (
        participant
      ) => {
        const vote =
          votes?.find(
            (v) =>
              v.participant_id ===
              participant.id
          );

        return {
          ...participant,

          hasVoted:
            !!vote,

          voteValue:
            ticket?.votes_revealed
              ? vote?.vote_value ??
                null
              : null,

          currentVote:
            vote?.vote_value ??
            null,
        };
      }
    );

  return NextResponse.json(
    enriched
  );
}