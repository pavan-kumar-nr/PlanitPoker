import { Ticket } from "../../types/database";

type Props = {
  tickets: Ticket[];
  activeTicketId?: string;
  isCreator: boolean;
  onSelect: (
    ticketId: string
  ) => void;
};

export default function SprintBacklogPanel({
  tickets,
  activeTicketId,
  isCreator,
  onSelect,
}: Props) {
  return (
<div className="rounded-3xl bg-slate-900 border  text-white  border-slate-800 p-4">

  <div className="flex items-center justify-between mb-4">

    <h2 className="font-bold text-white">
      Sprint Backlog
    </h2>

    <span className="text-xs bg-indigo-600 px-2 py-1 rounded">
      {tickets.length}
    </span>

  </div>

  <div className="space-y-2 max-h-162.5 overflow-y-auto">

    {tickets.map(ticket => (

      <div
        key={ticket.id}
        className={`rounded-xl bg-white text-black border p-2 transition-all ${
          activeTicketId === ticket.id
            ? "border-indigo-500 bg-indigo-500/10"
            : "border-slate-700 bg-slate-800"
        }`}
      >

        <div className="font-semibold text-balck">
          {ticket.ticket_key}
        </div>

        <div className="text-sm text-black mt-1">
          {ticket.title}
        </div>

        <div className="flex justify-between items-center mt-3">

          <span className="text-xs text-black">
            {
              ticket.final_estimate
                ? `SP: ${ticket.final_estimate}`
                : "Pending"
            }
          </span>

          {isCreator && (
            <button
onClick={() => {
  console.log("BUTTON CLICKED", ticket.id);
  onSelect(ticket.id);
}}
              className="rounded-lg bg-yellow-500 px-3 py-1 text-xs text-white hover:bg-indigo-700"
            >
              Select
            </button>
          )}

        </div>

      </div>

    ))}

  </div>

</div>
  );
}