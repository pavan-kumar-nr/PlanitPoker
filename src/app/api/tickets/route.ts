import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    sessionId,
    ticketKey,
    title,
    description,
  } = body;

  const { data, error } = await supabase
    .from("tickets")
    .insert({
      session_id: sessionId,
      ticket_key: ticketKey,
      title,
      description,
      status: "ACTIVE",
      completed: false,
      votes_revealed: false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  await supabase
    .from("sessions")
    .update({
      active_ticket_id: data.id,
    })
    .eq("id", sessionId);

  return NextResponse.json(data);
}