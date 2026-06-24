import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  const {
    domain,
    email,
    token,
    sprintId,
    sessionId,
  } = body;

  const auth =
    Buffer.from(
      `${email}:${token}`
    ).toString("base64");

  const response =
    await fetch(
      `https://${domain}/rest/agile/1.0/sprint/${sprintId}/issue`,
      {
        headers: {
          Authorization:
            `Basic ${auth}`,
          Accept:
            "application/json",
        },
      }
    );

  if (!response.ok) {
    return NextResponse.json(
      {
        error:
          "Failed to fetch Jira sprint",
      },
      {
        status: 500,
      }
    );
  }

  const jiraData =
    await response.json();

type JiraIssue = {
  id: string;
  key: string;
  fields: {
    summary: string;
    description?: {
      content?: {
        content?: {
          text?: string;
        }[];
      }[];
    };
  };
};

const tickets =
  (jiraData.issues as JiraIssue[]).map(
    (issue) => ({
        session_id:
          sessionId,

        ticket_key:
          issue.key,

        title:
          issue.fields.summary,

        description:
          issue.fields.description
            ?.content?.[0]
            ?.content?.[0]
            ?.text ??
          "",

        status:
          "PENDING",
      })
    );

  const {
    error,
  } = await supabase
    .from("tickets")
    .insert(
      tickets
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

  return NextResponse.json({
    success: true,
    imported:
      tickets.length,
  });
}