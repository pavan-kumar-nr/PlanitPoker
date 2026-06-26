import { Ticket } from "../../types/database";

type Props = {
  tickets: Ticket[];

  activeTicketId?: string;

  onSelect: (
    ticketId: string
  ) => void;

  onDelete: (
    ticketId: string
  ) => void;

  isCreator: boolean;
};

export default function SprintBacklogPanel({
  tickets,
  activeTicketId,
  onSelect,
  onDelete,
  isCreator,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 text-white">
      {/* Header */}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-white">
          Sprint Backlog
        </h2>

        <span className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold">
          {tickets.length}
        </span>
      </div>

      {/* Ticket List */}

      <div className="max-h-162.5 space-y-3 overflow-y-auto">
        {tickets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
            No tickets available.
          </div>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`rounded-xl border p-4 transition-all ${
                activeTicketId === ticket.id
                  ? "border-indigo-500 bg-indigo-100"
                  : "border-slate-300 bg-white"
              }`}
            >
              {/* Ticket Details */}

              <div className="font-bold text-black">
                {ticket.ticket_key}
              </div>

              <div className="mt-1 text-sm text-slate-700">
                {ticket.title}
              </div>

              {/* Footer */}

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  {ticket.final_estimate
                    ? `SP: ${ticket.final_estimate}`
                    : "Pending"}
                </span>

                {isCreator && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onSelect(ticket.id)
                      }
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Select
                    </button>

                    <button
                      onClick={() =>
                        onDelete(ticket.id)
                      }
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}