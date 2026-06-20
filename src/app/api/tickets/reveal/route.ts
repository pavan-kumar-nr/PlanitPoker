import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function POST(
  request: Request
) {
  const body = await request.json();

  const { ticketId } = body;

  const { error } =
    await supabase
      .from("tickets")
      .update({
        votes_revealed: true,
      })
      .eq("id", ticketId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}