"use client";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "bg-red-600 hover:bg-red-700",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">

        <h2 className="text-2xl font-bold text-white">
          {title}
        </h2>

        <p className="mt-4 text-slate-300 leading-7">
          {message}
        </p>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-600 px-5 py-2 text-white hover:bg-slate-700"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-5 py-2 font-semibold text-white ${confirmColor} disabled:opacity-50`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>

        </div>
      </div>
    </div>
  );
}