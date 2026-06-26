import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function GET(
  request: Request
) {
  const { searchParams } =
    new URL(request.url);

  const sessionId =
    searchParams.get(
      "sessionId"
    );

  console.log(
    "SESSION ID",
    sessionId
  );

  if (!sessionId) {
    return NextResponse.json(
      null
    );
  }

  const {
    data: session,
    error: sessionError,
  } = await supabase
    .from("sessions")
    .select(
      "active_ticket_id"
    )
    .eq(
      "id",
      sessionId
    )
    .single();

  console.log(
    "SESSION RESULT",
    session
  );

  console.log(
    "SESSION ERROR",
    sessionError
  );

  if (
    sessionError ||
    !session?.active_ticket_id
  ) {
    return NextResponse.json(
      null
    );
  }

  const {
    data: ticket,
    error: ticketError,
  } = await supabase
    .from("tickets")
    .select("*")
    .eq(
      "id",
      session.active_ticket_id
    )
    .single();

  console.log(
    "TICKET ERROR: ",
    ticketError
  );

  return NextResponse.json(
    ticket ?? null
  );
}