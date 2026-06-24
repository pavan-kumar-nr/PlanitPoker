"use client";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteTicketModal({
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  if (!isOpen) {
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
        <h2 className="text-2xl font-bold text-black mb-3">
          Delete Ticket
        </h2>

        <p className="text-slate-600 mb-6">
          Are you sure you want to delete this ticket?
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="
              rounded-xl
              bg-slate-200
              px-4
              py-2
              font-medium
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              rounded-xl
              bg-red-600
              px-4
              py-2
              font-medium
              text-white
              hover:bg-red-700
            "
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  );
}