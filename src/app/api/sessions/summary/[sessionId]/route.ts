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

  const {
    data: tickets,
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
        ascending: true,
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

  const result =
    await Promise.all(
      (tickets || []).map(
        async (ticket) => {
          const {
            data: votes,
          } = await supabase
            .from("votes")
            .select(`
              vote_value,
              comment,
              participants (
                name
              )
            `)
            .eq(
              "ticket_id",
              ticket.id
            );

          return {
            ...ticket,
            votes:
              votes || [],
          };
        }
      )
    );

  return NextResponse.json(
    result
  );
}