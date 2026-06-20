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
  } = await supabase
    .from("tickets")
    .select(
      "session_id"
    )
    .eq("id", ticketId)
    .single();

  const { error } =
    await supabase
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

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }

  if (
    ticket?.session_id
  ) {
    await supabase
      .from("sessions")
      .update({
        active_ticket_id:
          null,
      })
      .eq(
        "id",
        ticket.session_id
      );
  }

  return NextResponse.json({
    success: true,
  });
}