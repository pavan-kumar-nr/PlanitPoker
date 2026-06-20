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

  const { data: session } =
    await supabase
      .from("sessions")
      .select("active_ticket_id")
      .eq("id", sessionId)
      .single();

  if (!session?.active_ticket_id) {
    return NextResponse.json(null);
  }

  const { data: ticket } =
    await supabase
      .from("tickets")
      .select("*")
      .eq(
        "id",
        session.active_ticket_id
      )
      .single();

  return NextResponse.json(ticket);
}