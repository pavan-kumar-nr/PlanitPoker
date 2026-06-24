import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function POST(
  request: Request
) {
  try {

    const {
      ticketId,
      sessionId,
    } = await request.json();

    if (
      !ticketId ||
      !sessionId
    ) {
      return NextResponse.json(
        {
          error:
            "ticketId and sessionId required",
        },
        {
          status: 400,
        }
      );
    }

    const { error } =
      await supabase
        .from("sessions")
        .update({
          active_ticket_id:
            ticketId,
        })
        .eq(
          "id",
          sessionId
        );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to set active ticket",
      },
      {
        status: 500,
      }
    );

  }
}