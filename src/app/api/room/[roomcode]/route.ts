import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function GET(
  request: Request,
  context: { params: Promise<{ roomcode: string }> }
) {
  const { roomcode } = await context.params;

  console.log("ROOM CODE API:", roomcode);

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("room_code", roomcode)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Room not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}