"use client";
import { useState, useEffect, } from "react";

import SessionHeader from "../../../../components/board/SessionHeader";
import ActiveTicketPanel from "../../../../components/board/ActiveTicketPanel";
import ParticipantsPanel from "../../../../components/board/ParticipantsPanel";
import TicketHistoryPanel from "../../../../components/board/TicketHistoryPanel";
import ToolsPanel from "../../../../components/board/ToolsPanel";
import DeleteTicketModal from "../../../../components/board/DeleteTicketModal";
import EditEstimateModal from "../../../../components/board/EditEstimateModal";
import SprintBacklogPanel from "../../../../components/board/SprintBacklogPanel";

import { Session } from "../../../../types/database";
import { Ticket } from "../../../../types/database";


type Participant = {
  id: string;
  name: string;
  role: string;
  hasVoted?: boolean;
  voteValue?: string | null;
  currentVote?: string | null;
  comment?: string | null;
};

export default function BoardClient({
  session: initialSession,
}: {
  session: Session;
}) {

const session =
  initialSession;

  const [
    activeTicket,
    setActiveTicket,
  ] = useState<Ticket | null>(
    null
  );
const [tickets, setTickets] =
  useState<Ticket[]>([]);

const [jiraDomain, setJiraDomain] =
  useState("");

const [jiraEmail, setJiraEmail] =
  useState("");

const [jiraToken, setJiraToken] =
  useState("");

const [jiraBoardId, setJiraBoardId] =
  useState("");

const [jiraSprintId, setJiraSprintId] =
  useState("");
console.log(
  "BOARD SESSION ID",
  session.id
);
async function importFromJira() {
  try {

    const response =
      await fetch(
        "/api/jira/import-sprint",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            domain:
              jiraDomain,

            email:
              jiraEmail,

            token:
              jiraToken,

            boardId:
              jiraBoardId,

            sprintId:
              jiraSprintId,

            sessionId:
              session.id,
          }),
        }
      );

    const result =
      await response.json();

    if (
      result.error
    ) {
      alert(
        result.error
      );
      return;
    }

    alert(
      `${result.imported} Jira stories imported`
    );

await loadBacklog();
await loadHistory();
await loadActiveTicket();

  } catch (error) {
    console.error(
      error
    );
  }
}

  const [history, setHistory] =
    useState<Ticket[]>([]);

  const [
    participants,
    setParticipants,
  ] = useState<
    Participant[]
  >([]);

  const [myVote, setMyVote] =
    useState<string | null>(
      null
    );

  const [
    finalEstimate,
    setFinalEstimate,
  ] = useState("");

  const [
    finalComment,
    setFinalComment,
  ] = useState("");

  const [
    copied,
    setCopied,
  ] = useState(false);

  const [
    ,
    setLoading,
  ] = useState(false);

  const [
    sessionCompleted,
    setSessionCompleted,
  ] = useState(false);

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

  const [
    ticketToDelete,
    setTicketToDelete,
  ] = useState<
    string | null
  >(null);

  const [
    adoOrganization,
    setAdoOrganization,
  ] = useState("");

  const [
    adoProject,
    setAdoProject,
  ] = useState("");

  const [adoPat, setAdoPat] =
    useState("");

  const [
    adoQueryId,
    setAdoQueryId,
  ] = useState("");

  const participantId =
    typeof window !==
      "undefined"
      ? localStorage.getItem(
          "participant-id"
        )
      : null;

  const participantRole =
    typeof window !==
      "undefined"
      ? localStorage.getItem(
          "participant-role"
        )
      : null;

  const isCreator =
    participantRole ===
    "CREATOR";

  const canVote =
    participantRole ===
    "VOTER";

  const showResults =
    activeTicket?.votes_revealed ??
    false;

  /*
--------------------------------
DATA LOADERS
--------------------------------
*/

async function loadParticipants() {
  try {
    const sessionId = session.id;

    if (!sessionId) {
      return;
    }

    const response =
      await fetch(
        `/api/participants?sessionId=${sessionId}`
      );

    const data =
      await response.json();

    setParticipants(data);
  } catch (error) {
    console.error(error);
  }
}

async function loadHistory() {
  try {
    const sessionId = session.id;

    if (!sessionId) {
      return;
    }

    const response =
      await fetch(
        `/api/tickets/history?sessionId=${sessionId}`
      );

    const data =
      await response.json();

    setHistory(data);

  } catch (error) {
    console.error(error);
  }
}
async function selectTicket(
  ticketId: string
) {
  try {

    const response =
      await fetch(
        "/api/tickets/set-active",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ticketId,
            sessionId:
              session.id,
          }),
        }
      );

    const result =
      await response.json();

    console.log(
      "ACTIVE TICKET",
      result
    );

setTimeout(async () => {
  await loadActiveTicket();
}, 500);

  } catch (error) {
    console.error(error);
  }
}

async function loadBacklog() {
  try {
    const sessionId = session.id;

    if (!sessionId) {
      return;
    }

    const response =
      await fetch(
        `/api/tickets/backlog?sessionId=${sessionId}`
      );

    const data =
      await response.json();
console.log(
  "BACKLOG RESPONSE",
  data
);
    setTickets(data);

  } catch (error) {
    console.error(error);
  }
}

const loadActiveTicket =
    async () => {
  try {
    const sessionId = session.id;

    if (!sessionId) {
      return;
    }

    const response =
      await fetch(
        `/api/tickets/active?sessionId=${sessionId}`
      );

    const data =
      await response.json();
console.log(
  "LOAD ACTIVE RESPONSE",
  data
);
    setActiveTicket(data);

    if (!data) {
      setMyVote(null);
      return;
    }

    const vote =
      participants.find(
        (participant) =>
          participant.id ===
          participantId
      );

    if (
      vote?.currentVote
    ) {
      setMyVote(
        vote.currentVote
      );
    }

  } catch (error) {
    console.error(error);
  }
};

/*
--------------------------------
INITIAL LOAD
--------------------------------
*/

useEffect(() => {
  const loadAll =
    async () => {
    await Promise.all([
      loadParticipants(),
      loadHistory(),
      loadBacklog(),
      loadActiveTicket(),
    ]);
    };

  void loadAll();

  const interval =
    setInterval(() => {
      void loadAll();
    }, 3000);

  return () =>
    clearInterval(interval);

}, [participantId]);

/*
--------------------------------
VOTING
--------------------------------
*/

async function submitVote(
  value: string
) {
  if (
    !activeTicket ||
    !participantId
  ) {
    return;
  }

  try {
    setMyVote(value);

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
          voteValue:
            value,
        }),
      }
    );

    await loadParticipants();
  } catch (error) {
    console.error(error);
  }
}

/*
--------------------------------
INVITE LINK
--------------------------------
*/

async function copyInvite() {
  if (!session) {
    return;
  }

  await navigator.clipboard.writeText(
    `${window.location.origin}/room/${session.room_code}`
  );

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
}

/*
--------------------------------
ADO IMPORT
--------------------------------
*/

async function importFromAdo() {
  if (!session) {
    return;
  }

  try {
    setLoading(true);

    const response =
      await fetch(
        "/api/ado/import",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            sessionId:
              session.id,
            organization:
              adoOrganization,
            project:
              adoProject,
            pat: adoPat,
            queryId:
              adoQueryId,
          }),
        }
      );

    const result =
      await response.json();

    if (
      result.success
    ) {
      await loadHistory();
      await loadParticipants();
      await loadActiveTicket();
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

/*
--------------------------------
EXCEL IMPORT
--------------------------------
*/

async function handleExcelImport(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file =
    event.target.files?.[0];

  if (
    !file ||
    !session
  ) {
    return;
  }

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  formData.append(
    "sessionId",
    session.id
  );

  try {
    await fetch(
      "/api/import-excel",
      {
        method: "POST",
        body: formData,
      }
    );

    await loadHistory();
await loadParticipants();
  } catch (error) {
    console.error(error);
  }
}

/*
--------------------------------
DELETE TICKET
--------------------------------
*/

function handleDelete(
  ticketId: string
) {
  setTicketToDelete(
    ticketId
  );
}

async function confirmDelete() {
  if (!ticketToDelete) {
    return;
  }

  try {
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

    setTicketToDelete(
      null
    );

    await loadHistory();
  } catch (error) {
    console.error(error);
  }
}

/*
--------------------------------
EDIT ESTIMATE
--------------------------------
*/

function openEstimateEditor(
  ticket: Ticket
) {
  setEditingTicket(
    ticket
  );

  setEditEstimate(
    ticket.final_estimate ??
      ""
  );
}

async function saveEstimate() {
  if (
    !editingTicket
  ) {
    return;
  }

  try {
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
          estimate:
            editEstimate,
        }),
      }
    );

    setEditingTicket(
      null
    );

    await loadHistory();
  } catch (error) {
    console.error(error);
  }
}
/*
--------------------------------
REVEAL VOTES
--------------------------------
*/

async function revealVotes() {
  if (!activeTicket) {
    return;
  }

  try {
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

  } catch (error) {
    console.error(error);
  }
}

/*
--------------------------------
FINALIZE TICKET
--------------------------------
*/

async function completeTicket() {
  if (!activeTicket) {
    return;
  }

  if (!finalEstimate.trim()) {
    alert(
      "Please enter final estimate"
    );
    return;
  }

  try {

    /*
    Save ticket locally
    */

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

          finalComment,
        }),
      }
    );

    /*
    Update ADO Story Points
    */

    try {

      await fetch(
        "/api/ado/update-estimate",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ticketId:
              activeTicket.id,

            estimate:
              finalEstimate,
          }),
        }
      );

    } catch (error) {
      console.error(
        "ADO Estimate Update Failed",
        error
      );
    }

    /*
    Push ADO Comment
    */

    try {

      await fetch(
        "/api/ado/add-comment",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ticketId:
              activeTicket.id,

            estimate:
              finalEstimate,

            comment:
              finalComment,
          }),
        }
      );

    } catch (error) {
      console.error(
        "ADO Comment Failed",
        error
      );
    }

    setFinalEstimate("");
    setFinalComment("");
    setMyVote(null);
    setActiveTicket(null);

    await loadBacklog();
    await loadHistory();
    await loadActiveTicket();
    await loadParticipants();

  } catch (error) {
    console.error(error);
  }
}

/*
--------------------------------
COMPLETE SESSION
--------------------------------
*/

async function completeSession() {
  if (!session) {
    return;
  }

  const confirmed =
    window.confirm(
      "Complete this session?"
    );

  if (!confirmed) {
    return;
  }

  try {

    await fetch(
      "/api/sessions/complete",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          sessionId:
            session.id,
        }),
      }
    );

    setSessionCompleted(
      true
    );

  } catch (error) {
    console.error(error);
  }
}

/*
--------------------------------
EXPORT EXCEL
--------------------------------
*/

async function exportResults() {
  if (!session) {
    return;
  }

  window.open(
    `/api/export/excel?sessionId=${session.id}`,
    "_blank"
  );
}

/*
--------------------------------
DOWNLOAD PDF
--------------------------------
*/

async function downloadPdf() {
  if (!session) {
    return;
  }

  try {

    window.open(
      `/api/export/pdf?sessionId=${session.id}`,
      "_blank"
    );

  } catch (error) {
    console.error(error);
  }
}

/*
--------------------------------
ROOM SUMMARY
--------------------------------
*/

function openSummary() {
  if (!session) {
    return;
  }

  window.open(
    `/room/${session.room_code}/summary`,
    "_blank"
  );
}

/*
--------------------------------
LOADING
--------------------------------
*/

if (!session) {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      Loading Session...
    </main>
  );
}

const currentSession = session;
return (
  
  <main className="min-h-screen bg-white text-black">

    <div className="mx-auto max-w-7xl px-6 py-6">

      {/* Header */}

      <SessionHeader
        session={session}
        copied={copied}
        onCopyInvite={copyInvite}
        onExport={exportResults}
        onPdf={downloadPdf}
        onSummary={openSummary}
        onCompleteSession={completeSession}
        sessionCompleted={sessionCompleted}
        isCreator={isCreator}
      />

      {/* Tools */}

      {isCreator && (
        <ToolsPanel
          adoOrganization={
            adoOrganization
          }
          setAdoOrganization={
            setAdoOrganization
          }
          adoProject={
            adoProject
          }
          setAdoProject={
            setAdoProject
          }
          adoPat={adoPat}
          setAdoPat={
            setAdoPat
          }
          adoQueryId={
            adoQueryId
          }
          setAdoQueryId={
            setAdoQueryId
          }
          importFromAdo={
            importFromAdo
          }
          importExcel={
            handleExcelImport
          }
          jiraDomain={jiraDomain}
          setJiraDomain={
            setJiraDomain
          }

          jiraEmail={jiraEmail}
          setJiraEmail={
            setJiraEmail
          }

          jiraToken={jiraToken}
          setJiraToken={
            setJiraToken
          }

          jiraBoardId={
            jiraBoardId
          }
          setJiraBoardId={
            setJiraBoardId
          }

          jiraSprintId={
            jiraSprintId
          }
          setJiraSprintId={
            setJiraSprintId
          }

          importFromJira={
            importFromJira
          }
        />
      )}

      {/* Main Board */}

      <div className="grid gap-6 lg:grid-cols-[320px_1fr_320px]">

        {/* BACKLOG */}

        <div>

          <SprintBacklogPanel
            tickets={tickets.filter(
              (t) => !t.final_estimate
            )}
            activeTicketId={activeTicket?.id}
            isCreator={isCreator}
            onSelect={selectTicket}
          />

        </div>

        {/* ACTIVE TICKET */}

        <div>

          <ActiveTicketPanel
            activeTicket={
              activeTicket
                ? {
                    ...activeTicket,
                    voting_type:
                      currentSession.voting_type,
                  }
                : null
            }
            canVote={canVote}
            myVote={myVote}
            submitVote={submitVote}
            showResults={showResults}
            finalEstimate={finalEstimate}
            setFinalEstimate={setFinalEstimate}
            finalComment={finalComment}
            setFinalComment={setFinalComment}
            completeTicket={completeTicket}
            isCreator={isCreator}
          />

        </div>

        {/* PARTICIPANTS */}

        <div>

          <ParticipantsPanel
            participants={participants}
            creatorName={
              currentSession.creator_name ?? ""
            }
            showResults={showResults}
            isCreator={isCreator}
            activeTicketExists={!!activeTicket}
            onRevealVotes={revealVotes}
          />

        </div>

      </div>

      {/* History */}

      <div className="mt-6">

        <TicketHistoryPanel
          history={history}
          deleteTicket={
            handleDelete
          }
          editEstimate={
            openEstimateEditor
          }
        />

      </div>

      {/* Delete Modal */}

      <DeleteTicketModal
        isOpen={Boolean(
          ticketToDelete
        )}
        onClose={() =>
          setTicketToDelete(
            null
          )
        }
        onConfirm={
          confirmDelete
        }
      />

      {/* Edit Modal */}

      <EditEstimateModal
        ticket={
          editingTicket
        }
        estimate={
          editEstimate
        }
        setEstimate={
          setEditEstimate
        }
        onClose={() =>
          setEditingTicket(
            null
          )
        }
        onSave={
          saveEstimate
        }
      />
      </div>
  </main>
  
);
}