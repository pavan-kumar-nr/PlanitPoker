import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { id } =
    await context.params;

  await supabase
    .from("sessions")
    .update({
      last_accessed_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  return NextResponse.json({
    success: true,
  });
}