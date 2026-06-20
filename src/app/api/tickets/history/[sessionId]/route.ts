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

  const { data, error } =
    await supabase
      .from("tickets")
      .select("*")
      .eq(
        "session_id",
        sessionId
      )
      .eq(
        "completed",
        true
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}