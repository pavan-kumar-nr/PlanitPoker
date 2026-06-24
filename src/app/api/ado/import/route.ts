import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { adoRequest } from "../../../../lib/ado";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      sessionId,
      organization,
      project,
      pat,
      queryId,
    } = body;

    const queryResponse =
      await adoRequest(
        `https://dev.azure.com/${organization}/${project}/_apis/wit/wiql/${queryId}?api-version=7.1`,
        pat
      );

    const queryData =
      await queryResponse.json();

    const workItemIds =
      queryData.workItems?.map(
        (item: {
          id: number;
        }) => item.id
      ) ?? [];

    if (
      workItemIds.length === 0
    ) {
      return NextResponse.json({
        success: true,
        imported: 0,
      });
    }

    const workItemResponse =
      await adoRequest(
        `https://dev.azure.com/${organization}/${project}/_apis/wit/workitems?ids=${workItemIds.join(
          ","
        )}&$expand=all&api-version=7.1`,
        pat
      );

    const workItems =
      await workItemResponse.json();

type AdoWorkItem = {
  id: number;
  fields: Record<
    string,
    string
  >;
};

const tickets =
  (
    workItems.value as AdoWorkItem[]
  ).map((item) => ({
      session_id:
        sessionId,

      ado_work_item_id:
        item.id,

      ticket_key:
        `ADO-${item.id}`,

      title:
        item.fields[
          "System.Title"
        ] ?? "Untitled",

      description:
        item.fields[
          "System.Description"
        ] ?? "",

      status:
        "ACTIVE",

      completed:
        false,

      votes_revealed:
        false,
    })
  );

    const { error } =
      await supabase
        .from("tickets")
        .insert(tickets);

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
      .from("sessions")
      .update({
        ado_organization:
          organization,

        ado_project:
          project,

        ado_pat:
          pat,

        ado_query_id:
          queryId,
      })
      .eq(
        "id",
        sessionId
      );

    return NextResponse.json({
      success: true,
      imported:
        tickets.length,
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