import ExcelJS from "exceljs";
import { supabase } from "../../../../lib/supabase";

export async function GET(
  request: Request
) {
  const { searchParams } =
    new URL(request.url);

  const sessionId =
    searchParams.get("sessionId");

  if (!sessionId) {
    return Response.json(
      {
        error:
          "Session Id missing",
      },
      {
        status: 400,
      }
    );
  }

  const { data: tickets } =
    await supabase
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

  const workbook =
    new ExcelJS.Workbook();

  const worksheet =
    workbook.addWorksheet(
      "Sprint Results"
    );

  worksheet.columns = [
    {
      header:
        "Ticket Key",
      key:
        "ticket_key",
      width: 20,
    },
    {
      header:
        "Title",
      key: "title",
      width: 40,
    },
    {
      header:
        "Estimate",
      key:
        "estimate",
      width: 15,
    },
    {
      header:
        "Comment",
      key: "comment",
      width: 60,
    },
  ];

  tickets?.forEach(
    (ticket) => {
      worksheet.addRow({
        ticket_key:
          ticket.ticket_key,
        title:
          ticket.title,
        estimate:
          ticket.final_estimate,
        comment:
          ticket.final_comment,
      });
    }
  );

  const buffer =
    await workbook.xlsx.writeBuffer();

  return new Response(
    buffer,
    {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "Content-Disposition":
          'attachment; filename="SprintReport.xlsx"',
      },
    }
  );
}