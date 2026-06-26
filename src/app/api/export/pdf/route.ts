import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { supabase } from "../../../../lib/supabase";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return Response.json(
      {
        error: "Session Id missing",
      },
      {
        status: 400,
      }
    );
  }

  const { data: session, error: sessionError } =
    await supabase
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

  if (sessionError) {
    return Response.json(
      {
        error: sessionError.message,
      },
      {
        status: 500,
      }
    );
  }

  const { data: tickets, error: ticketError } =
    await supabase
      .from("tickets")
      .select("*")
      .eq("session_id", sessionId)
      .eq("completed", true)
      .order("created_at", {
        ascending: true,
      });

  if (ticketError) {
    return Response.json(
      {
        error: ticketError.message,
      },
      {
        status: 500,
      }
    );
  }

  const pdf = await PDFDocument.create();

  let page = pdf.addPage([595, 842]);

  const font =
    await pdf.embedFont(StandardFonts.Helvetica);

  const bold =
    await pdf.embedFont(
      StandardFonts.HelveticaBold
    );

  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  let y = pageHeight - 50;

  const left = 50;

  const drawText = (
    text: string,
    size = 12,
    isBold = false
  ) => {
    if (y < 60) {
      page = pdf.addPage([595, 842]);
      y = pageHeight - 50;
    }

    page.drawText(text, {
      x: left,
      y,
      size,
      font: isBold ? bold : font,
      color: rgb(0, 0, 0),
    });

    y -= size + 8;
  };

  const drawLine = () => {
    page.drawLine({
      start: {
        x: left,
        y,
      },
      end: {
        x: pageWidth - 50,
        y,
      },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });

    y -= 15;
  };

  page.drawText("Planit Poker Report", {
    x: 150,
    y,
    size: 24,
    font: bold,
    color: rgb(0.15, 0.15, 0.65),
  });

  y -= 40;

  drawText(
    `Session: ${session?.name ?? ""}`,
    14,
    true
  );

  drawText(
    `Room Code: ${
      session?.room_code ?? ""
    }`
  );

  drawText(
    `Generated: ${new Date().toLocaleString()}`
  );

  y -= 10;

  if (!tickets || tickets.length === 0) {
    drawText(
      "No completed tickets found.",
      13
    );
  } else {
    tickets.forEach(
      (ticket, index) => {
        drawText(
          `${index + 1}. ${
            ticket.ticket_key
          }`,
          15,
          true
        );

        drawText(
          `Title: ${
            ticket.title ?? "-"
          }`
        );

        drawText(
          `Estimate: ${
            ticket.final_estimate ??
            "-"
          }`
        );

        drawText(
          `Comment: ${
            ticket.final_comment ??
            "-"
          }`
        );

        drawLine();
      }
    );
  }

  const pdfBytes = await pdf.save();

  return new Response(pdfBytes.buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="SprintReport.pdf"',
    },
  });
}