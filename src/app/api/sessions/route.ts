import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  const {
    name,
    creatorName,
    votingType,
  } = body;

  const roomCode = crypto.randomUUID()
    .substring(0, 8)
    .toUpperCase();

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      room_code: roomCode,
      name,
      creator_name: creatorName,
      voting_type: votingType,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}