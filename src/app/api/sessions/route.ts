import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET(request: Request) {
  const { searchParams } =
    new URL(request.url);

  const createdBy =
    searchParams.get("createdBy");

  let query = supabase
    .from("sessions")
    .select(`
      *,
      participants(count)
    `)
    .order("created_at", {
      ascending: false,
    });

  if (createdBy) {
    query = query.eq(
      "created_by",
      createdBy
    );
  }

  const {
    data,
    error,
  } = await query;

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    data
  );
}

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  const {
    name,
    creatorName,
    votingType,
    createdBy,
  } = body;

  const roomCode =
    crypto.randomUUID()
      .substring(0, 8)
      .toUpperCase();

  const {
    data: session,
    error,
  } = await supabase
    .from("sessions")
    .insert({
      room_code: roomCode,
      name,
      creator_name:
        creatorName,
      voting_type:
        votingType,
      created_by:
        createdBy,
    })
    .select()
    .single();

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

  await supabase
    .from("participants")
    .insert({
      session_id:
        session.id,
      name:
        creatorName,
      role:
        "CREATOR",
      client_id:
        `creator-${createdBy}`,
    });

  return NextResponse.json(
    session
  );
}