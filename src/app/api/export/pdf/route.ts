import PDFDocument from "pdfkit";
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

  const {
    data: session,
  } = await supabase
    .from("sessions")
    .select("*")
    .eq(
      "id",
      sessionId
    )
    .single();

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
    )
    .order(
      "created_at",
      {
        ascending: true,
      }
    );

  const doc =
    new PDFDocument({
      margin: 40,
      size: "A4",
    });

  const chunks: Buffer[] = [];

  doc.on(
    "data",
    (chunk) => {
      chunks.push(chunk);
    }
  );

  const pdfPromise =
    new Promise<Buffer>(
      (resolve) => {
        doc.on(
          "end",
          () => {
            resolve(
              Buffer.concat(
                chunks
              )
            );
          }
        );
      }
    );

  /*
  Header
  */

  doc
    .fontSize(24)
    .text(
      "Planit Poker Report",
      {
        align:
          "center",
      }
    );

  doc.moveDown();

  doc
    .fontSize(14)
    .text(
      `Session: ${session?.name ?? ""}`
    );

  doc.text(
    `Room Code: ${session?.room_code ?? ""}`
  );

  doc.text(
    `Generated: ${new Date().toLocaleString()}`
  );

  doc.moveDown(2);

  /*
  Tickets
  */

  tickets?.forEach(
    (
      ticket,
      index
    ) => {

      doc
        .fontSize(16)
        .text(
          `${index + 1}. ${ticket.ticket_key}`
        );

      doc
        .fontSize(12)
        .text(
          `Title: ${ticket.title}`
        );

      doc.text(
        `Estimate: ${
          ticket.final_estimate ??
          "-"
        }`
      );

      doc.text(
        `Comment: ${
          ticket.final_comment ??
          "-"
        }`
      );

      doc.moveDown();

      doc
        .moveTo(
          40,
          doc.y
        )
        .lineTo(
          550,
          doc.y
        )
        .stroke();

      doc.moveDown();
    }
  );

  doc.end();

const pdfBuffer =
  await pdfPromise;

return new Response(
  new Uint8Array(pdfBuffer),
  {
    headers: {
      "Content-Type":
        "application/pdf",

      "Content-Disposition":
        'attachment; filename="SprintReport.pdf"',
    },
  }
);
}