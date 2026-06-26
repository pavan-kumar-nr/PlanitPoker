"use client";

type Props = {
  isOpen: boolean;

  title?: string;

  message?: string;

  confirmText?: string;

  cancelText?: string;

  onClose: () => void;

  onConfirm: () => void;
};

export default function DeleteTicketModal({
  isOpen,
  title = "Delete Ticket",
  message = "Are you sure you want to delete this ticket? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
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
          border
          border-slate-700
          bg-slate-800
          p-6
          shadow-2xl
        "
      >
        <h2 className="mb-3 text-2xl font-bold text-white">
          {title}
        </h2>

        <p className="mb-6 leading-7 text-slate-300">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
              rounded-xl
              border
              border-slate-600
              px-5
              py-2
              font-medium
              text-white
              transition
              hover:bg-slate-700
            "
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="
              rounded-xl
              bg-red-600
              px-5
              py-2
              font-medium
              text-white
              transition
              hover:bg-red-700
            "
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}