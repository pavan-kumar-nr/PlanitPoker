import { supabase } from "../../../../../lib/supabase";
import PDFDocument from "pdfkit";

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

  const doc =
    new PDFDocument();

  const chunks: Buffer[] =
    [];

doc.on(
  "data",
  (chunk: Buffer) =>
    chunks.push(chunk)
);

  const endPromise =
    new Promise<Buffer>(
      (resolve) => {
        doc.on(
          "end",
          () =>
            resolve(
              Buffer.concat(
                chunks
              )
            )
        );
      }
    );

type VoteRecord = {
  vote_value: string;
  comment: string | null;
  participants?: {
    name: string;
  }[];
};

  doc.fontSize(24);
  doc.text(
    "Planit Poker Session Report"
  );

  doc.moveDown();

  for (const ticket of tickets || []) {
    doc.fontSize(16);

    doc.text(
      `${ticket.ticket_key} - ${ticket.title}`
    );

    doc.fontSize(12);

    doc.text(
      `Final Estimate: ${ticket.final_estimate ?? "-"}`
    );

    doc.text(
      `Final Comment: ${ticket.final_comment ?? "-"}`
    );

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

    doc.moveDown();

    votes?.forEach(
      (vote: VoteRecord) => {
        doc.text(
          `${vote.participants?.[0].name ?? ""} | Vote: ${vote.vote_value}`
        );

        if (
          vote.comment
        ) {
          doc.text(
            `Comment: ${vote.comment}`
          );
        }

        doc.moveDown(
          0.5
        );
      }
    );

    doc.moveDown();
    doc.moveDown();
  }

  doc.end();

  const buffer =
    await endPromise;

return new Response(
  new Uint8Array(
    buffer
  ),
  {
    headers: {
      "Content-Type":
        "application/pdf",

      "Content-Disposition":
        'attachment; filename="SessionReport.pdf"',
    },
  }
);
}