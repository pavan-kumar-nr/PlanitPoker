import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";
import * as XLSX from "xlsx";

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
    error: ticketError,
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

  if (ticketError) {
    return NextResponse.json(
      {
        error:
          ticketError.message,
      },
      {
        status: 500,
      }
    );
  }

  const ticketSheet =
    tickets.map(
      (ticket) => ({
        Ticket:
          ticket.ticket_key,
        Title:
          ticket.title,
        Estimate:
          ticket.final_estimate,
        Comment:
          ticket.final_comment,
      })
    );

type VoteExportRow = {
  Ticket: string;
  User: string | undefined;
  Vote: string;
  Comment: string | null;
};

const voteRows: VoteExportRow[] = [];

  for (const ticket of tickets) {
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

    votes?.forEach(
      (
  vote: {
    vote_value: string;
    comment: string | null;
    participants?: {
    name: string;
    }[];
  }
) => {
        voteRows.push({
          Ticket:
            ticket.ticket_key,
          User:
            vote
              .participants?.[0]
              ?.name,
          Vote:
            vote.vote_value,
          Comment:
            vote.comment,
        });
      }
    );
  }

  const workbook =
    XLSX.utils.book_new();

  const ticketWorksheet =
    XLSX.utils.json_to_sheet(
      ticketSheet
    );

  const voteWorksheet =
    XLSX.utils.json_to_sheet(
      voteRows
    );

  XLSX.utils.book_append_sheet(
    workbook,
    ticketWorksheet,
    "Ticket Summary"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    voteWorksheet,
    "Votes"
  );

  const buffer =
    XLSX.write(
      workbook,
      {
        type: "buffer",
        bookType:
          "xlsx",
      }
    );

  return new NextResponse(
    buffer,
    {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "Content-Disposition":
          'attachment; filename="SprintPlanningResults.xlsx"',
      },
    }
  );
}