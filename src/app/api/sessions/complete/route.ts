import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  const {
    sessionId,
  } = body;

  const { error } =
    await supabase
      .from("sessions")
      .update({
        completed: true,
        is_active: false,
      })
      .eq(
        "id",
        sessionId
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

  return NextResponse.json({
    success: true,
  });
}