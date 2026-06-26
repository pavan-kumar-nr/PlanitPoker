import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { supabase } from "../../../lib/supabase";

export const runtime = "nodejs";

type ExcelTicket = {
  Tickets?: string;
  Title?: string;
  Description?: string;
  Status?: string;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const sessionId = formData.get("sessionId") as string | null;

    if (!file) {
      return NextResponse.json(
        {
          error: "Excel file is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        {
          error: "Session Id is required.",
        },
        {
          status: 400,
        }
      );
    }

    const buffer = await file.arrayBuffer();

    const workbook = XLSX.read(buffer, {
      type: "array",
    });

    const worksheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const rows =
      XLSX.utils.sheet_to_json<ExcelTicket>(
        worksheet,
        {
          defval: "",
        }
      );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          error: "Excel file contains no data.",
        },
        {
          status: 400,
        }
      );
    }

    const { data: existingTickets, error: existingError } =
        await supabase
            .from("tickets")
            .select("ticket_key")
            .eq("session_id", sessionId);

        if (existingError) {
        return NextResponse.json(
            {
            error: existingError.message,
            },
            {
            status: 500,
            }
        );
    }

    const existingKeys = new Set(
    (existingTickets ?? [])
        .map((t) => t.ticket_key?.trim().toLowerCase())
        .filter(Boolean)
    );

    const seenKeys = new Set<string>();

    const tickets = rows
    .filter((row) => row.Title?.trim() !== "")
    .filter((row) => {
        const key =
        row.Tickets?.trim().toLowerCase();

        if (!key) {
        return false;
        }

        // Already exists in this session
        if (existingKeys.has(key)) {
        return false;
        }

        // Duplicate inside uploaded Excel
        if (seenKeys.has(key)) {
        return false;
        }

        seenKeys.add(key);

        return true;
    })
    .map((row) => ({
        session_id: sessionId,
        ticket_key:
        row.Tickets?.trim() ?? null,
        title:
        row.Title?.trim() ?? "",
        description:
        row.Description?.trim() ??
        null,
        status:
        row.Status?.trim() ?? "New",
        completed: false,
        votes_revealed: false,
        final_estimate: null,
        final_comment: null,
        ado_work_item_id: null,
    }));
    const skipped =
  rows.length - tickets.length;

    if (tickets.length === 0) {
      return NextResponse.json(
        {
          error:
            "No valid rows found.",
        },
        {
          status: 400,
        }
      );
    }

    const { error } =
      await supabase
        .from("tickets")
        .insert(tickets);

    if (error) {
      console.error(error);

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
    imported: tickets.length,
    skipped,
    message: `Imported ${tickets.length} ticket(s). Skipped ${skipped} duplicate ticket(s).`,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to import Excel.",
      },
      {
        status: 500,
      }
    );
  }
}