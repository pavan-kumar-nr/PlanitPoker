import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import * as XLSX from "xlsx";

export async function POST(
  request: Request
) {
  try {
    const formData =
      await request.formData();

    const file =
      formData.get(
        "file"
      ) as File;

    const sessionId =
      formData.get(
        "sessionId"
      ) as string;

    const bytes =
      await file.arrayBuffer();

    const workbook =
      XLSX.read(bytes);

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

type ExcelTicketRow = {
  "Ticket Key"?: string;
  Title?: string;
  Description?: string;
};

const rows =
  XLSX.utils.sheet_to_json<ExcelTicketRow>(
    sheet
  );

    const tickets =
      rows.map(
        (
  row: {
    "Ticket Key"?: string;
    Title?: string;
    Description?: string;
  }
) => ({
          session_id:
            sessionId,
          ticket_key:
            row["Ticket Key"],
          title:
            row["Title"],
          description:
            row["Description"],
          status:
            "ACTIVE",
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