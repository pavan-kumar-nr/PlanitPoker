import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { adoRequest } from "../../../../lib/ado";

export async function POST(
  request: Request
) {
  try {
    const {
      ticketId,
      comment,
      estimate,
    } =
      await request.json();

    const {
      data: ticket,
      error,
    } = await supabase
      .from("tickets")
      .select(`
        ado_work_item_id,
        ticket_key,
        title,
        sessions (
          ado_organization,
          ado_project,
          ado_pat
        )
      `)
      .eq(
        "id",
        ticketId
      )
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

    if (
      !ticket?.ado_work_item_id
    ) {
      return NextResponse.json({
        success: true,
      });
    }

    const session =
      Array.isArray(
        ticket.sessions
      )
        ? ticket.sessions[0]
        : ticket.sessions;

    const discussion =
`
Planning Poker Finalized

Ticket:
${ticket.ticket_key}

Title:
${ticket.title}

Final Estimate:
${estimate}

Final Comment:
${comment}
`;

    const response =
      await adoRequest(
        `https://dev.azure.com/${session.ado_organization}/${session.ado_project}/_apis/wit/workitems/${ticket.ado_work_item_id}/comments?api-version=7.1-preview.3`,
        session.ado_pat,
        {
          method:
            "POST",

          body:
            JSON.stringify({
              text:
                discussion,
            }),
        }
      );

    if (
      !response.ok
    ) {
      const errorText =
        await response.text();

      return NextResponse.json(
        {
          error:
            errorText,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    return NextResponse.json(
      {
        error:
          String(error),
      },
      {
        status: 500,
      }
    );
  }
}