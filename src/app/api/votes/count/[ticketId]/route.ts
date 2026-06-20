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

  const { count } =
    await supabase
      .from("votes")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("ticket_id", ticketId);

  return NextResponse.json({
    count: count ?? 0,
  });
}