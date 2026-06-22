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
      // setDescription("");

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
    <div className="rounded-3xl border border-slate-800 bg-blue-900 p-6">

      <input
        value={ticketKey}
        onChange={(e) =>
          setTicketKey(
            e.target.value.toUpperCase()
          )
        }
        placeholder="CRM-101"
        className="w-full rounded-xl border border-slate-700 bg-white px-4 py-3 mb-3"
      />

      <input
        value={title}
        onChange={(e) =>
          setTitle(
            e.target.value.toUpperCase()
          )
        }
        placeholder="Ticket Title"
        className="w-full rounded-xl border border-slate-700 bg-white px-4 py-3 mb-3"
      />

      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full rounded-xl bg-green-600 hover:bg-green-700 transition-all px-4 py-3 font-semibold"
      >
        {loading
          ? "Creating..."
          : "Create Ticket"}
      </button>
    </div>
  );
}