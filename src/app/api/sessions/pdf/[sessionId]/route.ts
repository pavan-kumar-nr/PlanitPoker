import { supabase } from "../../../../../lib/supabase";
import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

export const runtime = "nodejs";

type VoteRecord = {
  vote_value: string;
  comment: string | null;
  participants?: {
    name: string;
  }[];
};

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
    error,
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

  if (error) {
    return Response.json(
      {
        error:
          error.message,
      },
      {
        status: 500,
      }
    );
  }

  const pdf =
    await PDFDocument.create();

  let page =
    pdf.addPage([595, 842]);

  const regular =
    await pdf.embedFont(
      StandardFonts.Helvetica
    );

  const bold =
    await pdf.embedFont(
      StandardFonts.HelveticaBold
    );

  const pageWidth =
    page.getWidth();

  const pageHeight =
    page.getHeight();

  let y =
    pageHeight - 50;

  function ensureSpace(
    lines = 3
  ) {
    if (
      y <
      60 + lines * 18
    ) {
      page =
        pdf.addPage([
          595,
          842,
        ]);

      y =
        page.getHeight() -
        50;
    }
  }

  function write(
    text: string,
    size = 12,
    isBold = false
  ) {
    ensureSpace();

    page.drawText(text, {
      x: 50,
      y,
      size,
      font: isBold
        ? bold
        : regular,
      color: rgb(
        0,
        0,
        0
      ),
    });

    y -= size + 8;
  }

  function divider() {
    ensureSpace();

    page.drawLine({
      start: {
        x: 50,
        y,
      },
      end: {
        x:
          pageWidth - 50,
        y,
      },
      thickness: 1,
      color: rgb(
        0.8,
        0.8,
        0.8
      ),
    });

    y -= 20;
  }

  write(
    "Planit Poker Session Report",
    22,
    true
  );

  write(
    `Generated: ${new Date().toLocaleString()}`
  );

  y -= 15;

  if (
    !tickets ||
    tickets.length === 0
  ) {
    write(
      "No completed tickets found."
    );
  }

  for (const ticket of tickets ??
    []) {
    ensureSpace(8);

    write(
      `${ticket.ticket_key ?? "-"} - ${ticket.title}`,
      16,
      true
    );

    write(
      `Final Estimate: ${
        ticket.final_estimate ??
        "-"
      }`
    );

    write(
      `Final Comment: ${
        ticket.final_comment ??
        "-"
      }`
    );

    write(
      "Votes:",
      13,
      true
    );

    const {
      data: votes,
    } =
      await supabase
        .from("votes")
        .select(
          `
          vote_value,
          comment,
          participants (
            name
          )
        `
        )
        .eq(
          "ticket_id",
          ticket.id
        );

    if (
      votes &&
      votes.length > 0
    ) {
      votes.forEach(
        (
          vote: VoteRecord
        ) => {
          ensureSpace(3);

          write(
            `• ${
              vote
                .participants?.[0]
                ?.name ??
              "Unknown"
            }  —  Vote: ${
              vote.vote_value
            }`
          );

          if (
            vote.comment
          ) {
            write(
              `   Comment: ${vote.comment}`,
              11
            );
          }
        }
      );
    } else {
      write(
        "No votes recorded."
      );
    }

    divider();
  }

  const pdfBytes =
    await pdf.save();

  return new Response(
    Buffer.from(
      pdfBytes
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