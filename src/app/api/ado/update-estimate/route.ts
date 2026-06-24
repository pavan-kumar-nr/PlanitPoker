import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { adoRequest } from "../../../../lib/ado";

export async function POST(
  request: Request
) {
  try {
    const {
      ticketId,
      estimate,
    } =
      await request.json();

    const {
      data: ticket,
    } = await supabase
      .from("tickets")
      .select(`
        ado_work_item_id,
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

    const response =
      await adoRequest(
        `https://dev.azure.com/${session.ado_organization}/${session.ado_project}/_apis/wit/workitems/${ticket.ado_work_item_id}?api-version=7.1`,
        session.ado_pat,
        {
          method:
            "PATCH",

          headers: {
            "Content-Type":
              "application/json-patch+json",
          },

          body:
            JSON.stringify([
              {
                op: "add",
                path:
                  "/fields/Microsoft.VSTS.Scheduling.StoryPoints",
                value:
                  Number(
                    estimate
                  ),
              },
            ]),
        }
      );

    if (
      !response.ok
    ) {
      return NextResponse.json(
        {
          error:
            "Failed to update ADO",
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