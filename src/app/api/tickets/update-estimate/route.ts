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

  const { error } =
    await supabase
      .from("tickets")
      .update({
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