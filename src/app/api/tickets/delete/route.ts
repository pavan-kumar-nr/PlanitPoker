import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  const { ticketId } =
    body;

  const {
    error: votesError,
  } = await supabase
    .from("votes")
    .delete()
    .eq(
      "ticket_id",
      ticketId
    );

  if (votesError) {
    return NextResponse.json(
      {
        error:
          votesError.message,
      },
      {
        status: 500,
      }
    );
  }

  const {
    error: ticketError,
  } = await supabase
    .from("tickets")
    .delete()
    .eq(
      "id",
      ticketId
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

  return NextResponse.json({
    success: true,
  });
}