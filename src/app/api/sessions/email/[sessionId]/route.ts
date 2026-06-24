import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";
import { resend } from "../../../../../lib/resend";

export async function POST(
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
    data: session,
    error,
  } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error || !session) {
    return NextResponse.json(
      {
        error:
          "Session not found",
      },
      {
        status: 404,
      }
    );
  }

  const {
    data: tickets,
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
    );

  let report = `
Session: ${session.name}

Room Code: ${session.room_code}

Completed Tickets:
`;

  tickets?.forEach(
    (ticket) => {
      report += `

${ticket.ticket_key}
${ticket.title}

Estimate:
${ticket.final_estimate}

Comment:
${ticket.final_comment ?? "-"}

`;
    }
  );

  await resend.emails.send({
    from:
      process.env
        .REPORT_FROM_EMAIL!,
    to:
      session.creator_name!,
    subject:
      `Planit Poker Report - ${session.name}`,
    text: report,
  });

  return NextResponse.json({
    success: true,
  });
}