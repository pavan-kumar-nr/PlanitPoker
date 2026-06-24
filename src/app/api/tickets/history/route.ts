import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function GET(
  request: Request
) {
  const { searchParams } =
    new URL(request.url);

  const sessionId =
    searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json([]);
  }

  const {
    data,
    error,
  } = await supabase
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
    data ?? []
  );
}