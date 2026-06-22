"use client";
import { FiShare2 } from "react-icons/fi";
import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiTrash2,} from "react-icons/fi";
import CreateTicketForm from "../../../../components/ticket/CreateTicketForm";
import VotingCards from "../../../../components/VotingCards";
import { supabaseClient } from "../../../../lib/supabaseClient";

type Participant = {
  id: string;
  name: string;
  role: string;
  hasVoted?: boolean;
  voteValue?: string | null;
  currentVote?: string | null;
};

type Ticket = {
  id: string;
  ticket_key: string;
  title: string;
  description: string;
  votes_revealed?: boolean;
  completed?: boolean;
  final_estimate?: string | null;
};

type Session = {
  id: string;
  name: string;
  room_code: string;
  voting_type: string;
  creator_name: string | null;
  created_by: string | null;
};

type TicketStats = {
  count: number;
  average: string;
  mostCommon: string | null;
};

export default function BoardClient({
  session,
}: {
  session: Session;
}) {
  const [participants, setParticipants] =
    useState<Participant[]>([]);

  const [activeTicket, setActiveTicket] =
    useState<Ticket | null>(null);

  const [history, setHistory] =
    useState<Ticket[]>([]);

  const [stats, setStats] =
    useState<TicketStats | null>(null);

  const [myVote, setMyVote] =
    useState<string | null>(null);

  const [finalEstimate, setFinalEstimate] =
    useState("");
  const [  estimateError, setEstimateError,] = useState("");
  const [copied, setCopied] =
    useState(false);

  const [
    editingTicket,
    setEditingTicket,
  ] = useState<Ticket | null>(
    null
  );

  const [
    editEstimate,
    setEditEstimate,
  ] = useState("");

  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [showResults, setShowResults] = useState(activeTicket?.votes_revealed ?? false);
  const [userId, setUserId] = useState("");
  
  const completeTicket = async () => {
    if (!activeTicket) {
      return;
    }

    try {
      await fetch(
        "/api/tickets/finalize",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ticketId:
              activeTicket.id,
            finalEstimate:
              null,
          }),
        }
      );

      setMyVote(null);
      setFinalEstimate("");
      setShowResults(false);
      setStats(null);
      setActiveTicket(null);

      await loadParticipants();
      await loadHistory();
      await loadActiveTicket();

    } catch (error) {
      console.error(error);
    }
  };
  
  const participantId =
    globalThis?.localStorage?.getItem(
      "participant-id"
    ) ?? "";

  const participantRole =
    globalThis?.localStorage?.getItem(
      "participant-role"
    ) ?? "";

  const participantName =
    globalThis?.localStorage?.getItem(
      "participant-name"
    ) ?? "";

  const isCreator =
    userId === session.created_by;

  const canVote =
    participantRole === "VOTER";

  const loadParticipants =
    useCallback(async () => {
      const response = await fetch(
        `/api/participants?sessionId=${session.id}`
      );
      const data =
        await response.json();

      setParticipants(data || []);

      const me =
        data?.find(
          (
            participant: Participant
          ) =>
            participant.id ===
            participantId
        );

      if (
        me?.currentVote
      ) {
        setMyVote(
          me.currentVote
        );
      }
    }, [session.id, participantId]);

const loadActiveTicket =
  useCallback(async () => {
    const response = await fetch(
      `/api/tickets/active/${session.id}`
    );

    const data =
      await response.json();

    if (!data) {
      setActiveTicket(null);
      setShowResults(false);
      setMyVote(null);
      setStats(null);
      setFinalEstimate("");
      return;
    }
      if (
        data &&
        activeTicket &&
        data.id !== activeTicket.id
      ) {
        setMyVote(null);
        setShowResults(false);
        setFinalEstimate("");
      }
    setActiveTicket(data);
    setShowResults(
      data.votes_revealed
    );
    const statsResponse =
      await fetch(
        `/api/tickets/stats/${data.id}`
      );

    const statsData =
      await statsResponse.json();

    setStats(statsData);
  }, [session.id, activeTicket]);

  const loadHistory =
    useCallback(async () => {
      const response =
        await fetch(
          `/api/tickets/history/${session.id}`
        );

      const data =
        await response.json();

      setHistory(data || []);
    }, [session.id]);

  const loadStats =
    useCallback(async () => {
      if (!activeTicket) return;

      const response =
        await fetch(
          `/api/tickets/stats/${activeTicket.id}`
        );

      const data =
        await response.json();

      setStats(data);
    }, [activeTicket]);

  const submitVote =
    useCallback(
      async (
        voteValue: string
      ) => {
        if (
          !activeTicket ||
          !participantId
        ) {
          return;
        }

        await fetch(
          "/api/votes",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              ticketId:
                activeTicket.id,
              participantId,
              voteValue,
            }),
          }
        );

        setMyVote(voteValue);

        await loadParticipants();
        await loadStats();
      },
      [
        activeTicket,
        participantId,
        loadParticipants,
        loadStats,
      ]
    );

  const [ticketToDelete, setTicketToDelete] =
    useState<string | null>(null);

  const handleDelete = (
    ticketId: string
  ) => {
    setTicketToDelete(ticketId);
  };

  const confirmDelete =
  async () => {
    if (!ticketToDelete)
      return;

    await fetch(
      "/api/tickets/delete",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          ticketId:
            ticketToDelete,
        }),
      }
    );

    setTicketToDelete(null);

    await loadHistory();

    if (activeTicket?.id === ticketToDelete) {
      await loadActiveTicket();
      await loadParticipants();
    }
  };

  const finalizeTicket =
    useCallback(async () => {
      if (
        !activeTicket ||
        !isCreator
      ) {
        return;
      }

      if (!finalEstimate) {
        setEstimateError(
          "Select a final estimate"
        );
        return;
      }

      setEstimateError("");

      await fetch(
        "/api/tickets/finalize",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ticketId:
              activeTicket.id,
            finalEstimate,
          }),
        }
      );

      setMyVote(null);
      setFinalEstimate("");
      setShowResults(false);
      setStats(null);
      setActiveTicket(null);

      await Promise.all([
        loadActiveTicket(),
        loadParticipants(),
        loadHistory(),
      ]);
    }, [
      activeTicket,
      finalEstimate,
      isCreator,
      loadActiveTicket,
      loadHistory,
      loadParticipants,
    ]);

  useEffect(() => {
    async function loadData() {
      await fetch(
        `/api/sessions/${session.id}/access`,
        {
          method: "POST",
        }
      );
      await loadParticipants();
      await loadActiveTicket();
      await loadHistory();
    }

    loadData();
  }, [
    loadParticipants,
    loadActiveTicket,
    loadHistory,
    session.id,
  ]);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } =
        await supabaseClient.auth.getUser();

      setUserId(user?.id ?? "");
    }

    loadUser();
  }, []);

  useEffect(() => {
    const interval =
      setInterval(() => {
        loadParticipants();
        loadActiveTicket();
        loadHistory();
      }, 3000);

    return () =>
      clearInterval(interval);
  }, [
    loadParticipants,
    loadActiveTicket,
    loadHistory,
  ]);

  const votingOptions =
    session.voting_type ===
    "fibonacci"
      ? [
          "1",
          "2",
          "3",
          "5",
          "8",
          "13",
        ]
      : session.voting_type ===
        "even"
      ? [
          "2",
          "4",
          "6",
          "8",
          "10",
          "12",
          "14",
          "16",
        ]
      : session.voting_type ===
        "odd"
      ? [
          "1",
          "3",
          "5",
          "7",
          "9",
          "11",
          "13",
          "15",
        ]
      : [
          "XS",
          "S",
          "M",
          "L",
          "XL",
        ];

const handleEdit =
  (
    ticket: Ticket
  ) => {
    setEditingTicket(
      ticket
    );

    setEditEstimate(
      ticket.final_estimate ??
        ""
    );
  };

const saveEstimate =
  async () => {
    if (
      !editingTicket
    ) {
      return;
    }

    await fetch(
      "/api/tickets/update-estimate",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          ticketId:
            editingTicket.id,
          finalEstimate:
            editEstimate,
        }),
      }
    );

    setEditingTicket(
      null
    );

    await loadHistory();
  };


return (
  <div className="w-full max-w-[1800px] mx-auto text-black px-4 py-1">

      <div className="rounded-xl border-black bg-slate-800 p-4 mb-4">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <h1 className="inline-block border-b-2 border-white pb-2 text-4xl font-bold tracking-tight text-white">
              {session.name}
            </h1>

            <div className="text-xl mt-3 text-slate-300">
              Room Code:{" "}
              <span className="font-semibold text-white">
                {session.room_code}
              </span>
            </div>

            <div className="text-slate-300 text-xl mt-1">
              Voting Type:{" "}
              {session.voting_type}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/room/${session.room_code}`
                );
                setCopied(true);

                window.clearTimeout(
                  (window as typeof window & {
                    copyTimer?: number;
                  }).copyTimer
                );

                (window as typeof window & {
                  copyTimer?: number;
                }).copyTimer =
                  window.setTimeout(() => {
                    setCopied(false);
                  }, 1000);
              }}
              className="flex items-center gap-2 rounded-xl bg-gray-200 hover:bg-gray-400 px-5 py-2 text-black font-semibold transition-all"
            >
              <FiShare2 size={18} />

              invite Link
            </button>
            {copied && (
              <div className="absolute right-0 mt-2 rounded-lg bg-green-600 px-3 py-2 text-sm text-white shadow-lg">
                ✓ Copied
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="grid lg:grid-cols-[3fr_1fr] gap-4 items-stretch">

        <div className="space-y-4">

          <div className="rounded-2xl border border-black bg-slate-800  p-3 h-full flex flex-col">
            <div className="relative mb-4">
              <h2 className="text-3xl font-semibold text-white text-center">
                Active Ticket
              </h2>

             {participantName && isCreator && !activeTicket && (
                <button
                  onClick={() =>
                    setShowCreateTicket(
                      !showCreateTicket
                    )
                  }
                  className="
                    absolute
                    right-0
                    top-1/2
                    -translate-y-1/2
                    rounded-lg
                    bg-emerald-600
                    hover:bg-emerald-700
                    px-4
                    py-2
                    text-sm
                    font-semibold
                  "
                >
                  + Create Ticket
                </button>
                
              )}

              {showCreateTicket && (
                <div
                  className="
                    fixed
                    inset-0
                    z-50
                    bg-black/70
                    backdrop-blur-sm
                    flex
                    items-center
                    justify-center
                    p-4
                  "
                >
                  <div
                    className="
                      w-full
                      max-w-2xl
                      rounded-3xl
                      border
                      border-slate-700
                      bg-white
                      p-6
                      shadow-2xl
                    "
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-black">
                        Create Ticket
                      </h2>
                      <button
                        onClick={() =>
                          setShowCreateTicket(false)
                        }
                        className="
                          rounded-lg
                          bg-red-500
                          hover:bg-yellow-400
                          text-white
                          px-4
                          py-2
                        "
                      >
                        ✕
                      </button>

                    </div>

                    <CreateTicketForm
                      sessionId={session.id}
                      onCreated={() => {
                        setShowCreateTicket(false);
                        loadActiveTicket();
                      }}
                    />
                  </div>
                </div>
              )}

            </div>
            {!activeTicket ? (
              <div className="flex flex-col items-center justify-center h-full">

                <div className="text-slate-300 text-lg mb-6">
                  there is no active ticket.{" "}
                  {isCreator
                    ? "Create one to get started!"
                    : "Waiting for session creator to create a ticket."}  
                </div>

                {showCreateTicket && (
                  <div className="w-full max-w-2xl">
                    <CreateTicketForm
                      sessionId={session.id}
                      onCreated={() => {
                        setShowCreateTicket(false);
                        loadActiveTicket();
                      }}
                    />
                  </div>
                )}

              </div>
            ) : (
              <>
                <div className="my-4 border-t border-slate-500/90"></div>
                                  
                  <div className="flex justify-between gap-4">

                    <div>
                      <div className="text-2xl text-white font-semibold">
                        {activeTicket.ticket_key}
                      </div>

                      <div className="text-xl font-bold mt-1 text-white">
                        {activeTicket.title}
                      </div>

                    </div>

                    {isCreator && !showResults && (
                      <div className="flex items-center">
                        <button
                          onClick={completeTicket}
                          className="
                            rounded-xl
                            bg-gray-300
                            hover:bg-gray-400
                            px-6
                            py-3
                            text-sm
                            font-semibold
                            whitespace-nowrap
                          "
                        >
                          withdraw ticket
                        </button>
                      </div>
                    )}

                  </div>

                {activeTicket && (
                  <div className="mt-8 border-t border-slate-500/90 pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">
                      Voting
                    </h3>
                    {canVote && (
                      <>
                        <VotingCards
                          votingType={session.voting_type}
                          selectedVote={myVote}
                          disabled={activeTicket.votes_revealed}
                          onVote={submitVote}
                        />

                        {myVote && (
                          <div className="mt-5 rounded-xl bg-gray-500 border border-gray-300 p-4">
                            Your Vote:
                            <span className="ml-2 font-bold">
                              {myVote}
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {!canVote && participantRole === "SPECTATOR" && (
                      <div className="text-slate-300">
                        👀Spectators cannot vote.
                      </div>
                    )}

                    {!canVote && isCreator && (
                      <div className="text-slate-300">
                      <p>👀Voting started. You cannot vote as the session creator.</p>
                      <p>👀wait for all participants to vote.</p>
                      <p>➡️reveal votes when ready.</p>
                      <br />
                      <p>➡️then finalize the vote to create new tickets.❗</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-black bg-slate-800  p-6 h-full">

            <div className="text-center mb-4">
              <div className="text-xl font-bold text-white">
                {session.creator_name}
              </div>
              <div className="text-sm font-semibold text-yellow-400 mt-1">
                Session Creator
              </div>
            </div>
            <div className="my-2 border-t border-slate-500/50"></div>
              <h2 className="text-lg font-semibold text-blue-300 mb-2">
                Participants:
              </h2>
              <div className="space-y-2 max-h-65 overflow-y-auto">

                {participants.filter(
                    (participant) =>
                      participant.role !==
                      "CREATOR"
                  ).map((participant) => (
                    <div
                      key={
                        participant.id
                      }
                      className="flex items-center justify-between rounded-xl bg-slate-600 p-3"
                    >
                      <div>
                        <div className="font-medium text-white">
                          {
                            participant.name
                          }
                        </div>
                        <div className="text-xs text-slate-400">
                          {
                            participant.role
                          }
                        </div>
                      </div>

                      <div>

                        {participant.role ===
                        "SPECTATOR" ? (
                          <span className="text-slate-400">
                            👀
                          </span>
                        ) : showResults ? (
                          <span className="font-bold text-indigo-400">
                            {participant.voteValue ??
                              "-"}
                          </span>
                        ) : participant.hasVoted ? (
                          <span className="text-emerald-400">
                            ✓ Voted
                          </span>
                        ) : (
                          <span className="text-yellow-400">
                            ⏳ Waiting
                          </span>
                        )}

                      </div>
                    </div>
                  )
                )}
              </div>
              
                {isCreator &&
                  activeTicket &&(
                  <button
                    onClick={async () => {
                      await fetch(
                        "/api/tickets/reveal",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type":
                              "application/json",
                          },
                          body: JSON.stringify({
                            ticketId:
                              activeTicket.id,
                          }),
                        }
                      );

                      await loadActiveTicket();
                      await loadParticipants();
                    }}
                    disabled={showResults}
                    className="w-full mt-5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-slate-600 px-4 py-3 font-semibold"
                  >
                    {showResults
                      ? "Votes Revealed"
                      : "Reveal Votes"}
                  </button>
                )}
                {activeTicket &&
                  stats &&
                  showResults && (
                    <div className="rounded-2xl border border-black bg-gray-700 p-4 mt-4">

                      <h2 className="inline-block border-b-2 border-indigo-400 pb- font-bold text-xl text-white mb-4">
                        Results 🫣
                      </h2>

                      <div className="grid md:grid-cols-2 gap-4 mb-6">

                        <div className="rounded-xl bg-white p-4">
                          <div className="text-black text-sm">
                            Votes
                          </div>

                          <div className="text-2xl font-bold">
                            {stats.count}
                          </div>
                        </div>

                        <div className="rounded-xl bg-white p-4">
                          <div className="text-black text-sm">
                            Average
                          </div>

                          <div className="text-2xl font-bold">
                            {stats.average}
                          </div>
                        </div>

                      </div>

                      {isCreator && (
                        <div className="mt-5">

                          <h3 className="text-white font-semibold mb-1">
                            Finalise
                          </h3>

                          <select
                            value={finalEstimate}
                            onChange={(e) =>
                              setFinalEstimate(
                                e.target.value
                              )
                            }
                            className="w-full rounded-xl border border-purple-700 bg-white px-3 py-2 mb-4"
                          >
                            <option value="">
                              Select Final Estimate
                            </option>

                            {votingOptions.map((option) => (
                              <option
                                key={option}
                                value={option}
                              >
                                {option}
                              </option>
                            ))}
                          </select>
                              {
                                estimateError && (
                                  <p className="mt-2 text-red-400 text-sm">
                                    {estimateError}
                                  </p>
                                )
                              }
                          <button
                            onClick={finalizeTicket}
                            className="w-full rounded-xl text-white bg-green-600 hover:bg-green-700 px-5 py-3 font-semibold"
                          >
                            Finalize Ticket
                          </button>

                        </div>
                      )}
                    </div>
                )}

            </div>
          </div>
      </div>

      <div className="rounded-3xl border border-black bg-slate-800  p-4 mt-3">

        <h2 className="text-lg font-semibold mb-3 text-white">
          Ticket History
        </h2>

        {history.length ===
        0 ? (
          <div className="text-gray-300">
            No completed tickets
          </div>
        ) : (
          <div className="space-y-2 max-h-65 overflow-y-auto">

            {history.map(
              (
                ticket
              ) => (
                <div
                  key={
                    ticket.id
                  }
                  className="flex items-center justify-between rounded-xl bg-gray-400 p-2"
                >
                  <div>
                    <div className="font-bold text-black">
                      {
                        ticket.ticket_key
                      }
                    </div>

                    <div className="text-sm text-slate-600">
                      {
                        ticket.title
                      }
                    </div>
                  </div>

                    <div className="flex items-center gap-3">

                      <div className="rounded-lg bg-indigo-600 px-4 py-1 font-semibold text-white">
                        {ticket.final_estimate ?? "-"}
                      </div>
                      {isCreator && (
                        <div>
                          <button
                            onClick={() =>
                              handleEdit(ticket)
                            }
                            className="text-black px-4"
                          >
                            <FiEdit2 size={18} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(ticket.id)
                            }
                            className="text-black px-4"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>


                </div>
              )
            )}

          </div>
        )}

      </div>
      {ticketToDelete && (
        <div
          className="
            fixed inset-0
            bg-black/60
            flex items-center justify-center
            z-50
          "
        >
          <div
            className="
              bg-white
              rounded-3xl
              p-6
              w-[90%]
              max-w-md
            "
          >
            <h2
              className="
                text-xl
                font-bold
                mb-3
              "
            >
              Delete Ticket
            </h2>

            <p
              className="
                text-slate-600
                mb-6
              "
            >
              Are you sure you want to
              delete this ticket?
            </p>

            <div
              className="
                flex
                justify-end
                gap-3
              "
            >
              <button
                onClick={() =>
                  setTicketToDelete(
                    null
                  )
                }
                className="
                  px-4 py-2
                  rounded-xl
                  bg-slate-200
                "
              >
                Cancel
              </button>

              <button
                onClick={
                  confirmDelete
                }
                className="
                  px-4 py-2
                  rounded-xl
                  bg-red-600
                  text-white
                "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {
        editingTicket && (
          <div
            className="
              fixed
              inset-0
              z-50
              bg-black/70
              backdrop-blur-sm
              flex
              items-center
              justify-center
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
              <h2 className="text-2xl font-bold mb-4">
                Update Estimate
              </h2>

              <input
                value={
                  editEstimate
                }
                onChange={(e) =>
                  setEditEstimate(
                    e.target.value
                  )
                }
                placeholder="enter estimate"
                className="
                  w-full
                  border
                  rounded-xl
                  p-3
                  mb-4
                "
              />

              <div className="flex justify-end gap-3">

                <button
                  onClick={() =>
                    setEditingTicket(
                      null
                    )
                  }
                  className="
                    rounded-xl
                    bg-gray-300
                    px-4
                    py-2
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={
                    saveEstimate
                  }
                  className="
                    rounded-xl
                    bg-indigo-600
                    px-4
                    py-2
                    text-white
                  "
                >
                  Save
                </button>

              </div>

            </div>
          </div>
        )
      }
      
    </div>
  );
}
