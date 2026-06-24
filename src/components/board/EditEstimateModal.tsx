"use client";

import { Ticket } from "../../types/database";

type Props = {
  ticket: Ticket | null;
  estimate: string;
  setEstimate: (
    value: string
  ) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function EditEstimateModal({
  ticket,
  estimate,
  setEstimate,
  onClose,
  onSave,
}: Props) {
  if (!ticket) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/70
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          bg-white
          p-6
          shadow-2xl
        "
      >
        <h2 className="text-2xl font-bold text-black mb-4">
          Update Estimate
        </h2>

        <div className="mb-2 text-slate-600">
          {ticket.ticket_key}
        </div>

        <div className="mb-4 font-semibold text-black">
          {ticket.title}
        </div>

        <input
          value={estimate}
          onChange={(e) =>
            setEstimate(
              e.target.value
            )
          }
          placeholder="Enter estimate"
          className="
            w-full
            rounded-xl
            border
            border-slate-300
            p-3
            mb-5
          "
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="
              rounded-xl
              bg-slate-200
              px-4
              py-2
            "
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="
              rounded-xl
              bg-indigo-600
              px-4
              py-2
              text-white
              hover:bg-indigo-700
            "
          >
            Save
          </button>

        </div>
      </div>
    </div>
  );
}