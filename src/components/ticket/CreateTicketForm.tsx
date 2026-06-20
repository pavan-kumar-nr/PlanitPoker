"use client";

import { useState } from "react";

export default function CreateTicketForm({
  sessionId,
  onCreated,
}: {
  sessionId: string;
  onCreated: () => void;
}) {
  const [ticketKey, setTicketKey] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleCreate() {
    if (!title.trim()) {
      alert("Title required");
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/tickets",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              sessionId,
              ticketKey,
              title,
              description,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed"
        );
      }

      setTicketKey("");
      setTitle("");
      setDescription("");

      onCreated();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to create ticket"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="text-xl font-semibold mb-6">
        Create Ticket
      </h2>

      <input
        value={ticketKey}
        onChange={(e) =>
          setTicketKey(
            e.target.value.toUpperCase()
          )
        }
        placeholder="CRM-101"
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 mb-3"
      />

      <input
        value={title}
        onChange={(e) =>
          setTitle(
            e.target.value.toUpperCase()
          )
        }
        placeholder="Ticket Title"
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 mb-3"
      />

      <textarea
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
        placeholder="Description"
        rows={4}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 mb-4"
      />

      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-all px-4 py-3 font-semibold"
      >
        {loading
          ? "Creating..."
          : "Create Ticket"}
      </button>
    </div>
  );
}