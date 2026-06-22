import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  const {
    ticketId,
    finalEstimate,
  } = body;

  const {
    data: ticket,
    error: ticketError,
  } = await supabase
    .from("tickets")
    .select(
      "session_id"
    )
    .eq(
      "id",
      ticketId
    )
    .single();

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
    error: updateTicketError,
  } = await supabase
    .from("tickets")
    .update({
      completed: true,
      status: "COMPLETED",
      final_estimate:
        finalEstimate,
    })
    .eq(
      "id",
      ticketId
    );

  if (
    updateTicketError
  ) {
    return NextResponse.json(
      {
        error:
          updateTicketError.message,
      },
      {
        status: 500,
      }
    );
  }

  const {
    error: updateSessionError,
  } = await supabase
    .from("sessions")
    .update({
      active_ticket_id: null,
    })
    .eq(
      "id",
      ticket.session_id
    );

  if (
    updateSessionError
  ) {
    return NextResponse.json(
      {
        error:
          updateSessionError.message,
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