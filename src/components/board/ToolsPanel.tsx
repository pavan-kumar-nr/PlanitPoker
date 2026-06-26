"use client";

import { useState } from "react";

type Props = {
  adoOrganization: string;
  setAdoOrganization: (
    value: string
  ) => void;

  adoProject: string;
  setAdoProject: (
    value: string
  ) => void;

  adoPat: string;
  setAdoPat: (
    value: string
  ) => void;

  adoQueryId: string;
  setAdoQueryId: (
    value: string
  ) => void;

  importFromAdo: () => void;

  importExcel: () => void;

  selectedExcel: File | null;

  setSelectedExcel: (
    file: File | null
  ) => void;

  jiraDomain: string;

setJiraDomain: (
  value: string
) => void;

jiraEmail: string;
setJiraEmail: (
  value: string
) => void;

jiraToken: string;
setJiraToken: (
  value: string
) => void;

jiraBoardId: string;
setJiraBoardId: (
  value: string
) => void;

jiraSprintId: string;
setJiraSprintId: (
  value: string
) => void;

importFromJira: () => void;
};

export default function ToolsPanel({
  adoOrganization,
  setAdoOrganization,
  adoProject,
  setAdoProject,
  adoPat,
  setAdoPat,
  adoQueryId,
  setAdoQueryId,
  importFromAdo,
  importExcel,
  selectedExcel,
  setSelectedExcel,
  jiraDomain,
  setJiraDomain,
  jiraEmail,
  setJiraEmail,
  jiraToken,
  setJiraToken,
  jiraBoardId,
  setJiraBoardId,
  jiraSprintId,
  setJiraSprintId,
  importFromJira,

}: Props) {
    const [isExpanded, setIsExpanded] =
  useState(false);

    return (
    <div className="rounded-3xl border border-slate-700 bg-slate-800 mb-6 overflow-hidden">

        {/* Header */}

        <button
        onClick={() =>
            setIsExpanded(
            !isExpanded
            )
        }
        className="
            w-full
            flex
            items-center
            justify-between
            p-4
            text-left
            hover:bg-slate-700/40
            transition-all
        "
        >
        <div>

            <h2 className="text-2xl font-bold text-white">
            Tools & Integrations
            </h2>

            <p className="text-sm text-slate-400 mt-1">
             import tickets from ADO, JIRA and Excel
            </p>

        </div>

        <div
            className="
            text-2xl
            text-white
            transition-transform
            duration-300
            "
        >
            {isExpanded
            ? "▲"
            : "▼"}
        </div>

        </button>

        {/* Content */}

        {isExpanded && (

        <div className="px-6 pb-6 border-t border-slate-700">
            <div className="grid lg:grid-cols-3 gap-6 items-start mt-6">
                {/* ADO */}
                <div>

                    <h3 className="text-lg font-semibold text-white mb-4">
                    Azure DevOps Import
                    </h3>

                    <input
                    value={
                        adoOrganization
                    }
                    onChange={(e) =>
                        setAdoOrganization(
                        e.target.value
                        )
                    }
                    placeholder="Organization"
                    className="w-full rounded-xl bg-white text-black p-3 mb-3"
                    />

                    <input
                    value={adoProject}
                    onChange={(e) => setAdoProject(e.target.value)}
                    placeholder="Project"
                    autoComplete="off"
                    name="ado-project"
                    className="w-full rounded-xl bg-white text-black p-3 mb-3"
                    />

                    <input
                    value={adoPat}
                    onChange={(e) => setAdoPat(e.target.value)}
                    type="password"
                    placeholder="PAT Token"
                    autoComplete="new-password"
                    name="ado-pat"
                    className="w-full rounded-xl bg-white text-black p-3 mb-3"
                    />

                    <input
                    value={
                        adoQueryId
                    }
                    onChange={(e) =>
                        setAdoQueryId(
                        e.target.value
                        )
                    }
                    placeholder="Query Id"
                    className="w-full rounded-xl bg-white text-black p-3 mb-4"
                    />

                    <button
                    onClick={
                        importFromAdo
                    }
                    className="
                        w-full
                        rounded-xl
                        bg-indigo-600
                        py-3
                        text-white
                        font-semibold
                        hover:bg-indigo-700
                    "
                    >
                    Import Stories
                    </button>

                </div>

                {/* JIRA */}
                <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                    Jira Sprint Import
                </h3>
                <input
                    value={jiraDomain}
                    onChange={(e) =>
                    setJiraDomain(
                        e.target.value
                    )
                    }
                    placeholder="yourcompany.atlassian.net"
                    className="w-full rounded-xl bg-white text-black p-3 mb-3"
                />

                <input
                    value={jiraEmail}
                    onChange={(e) =>
                    setJiraEmail(
                        e.target.value
                    )
                    }
                    placeholder="Email"
                    className="w-full rounded-xl bg-white text-black p-3 mb-3"
                />

                <input
                    value={jiraToken}
                    onChange={(e) =>
                    setJiraToken(
                        e.target.value
                    )
                    }
                    placeholder="API Token"
                    type="password"
                    className="w-full rounded-xl bg-white text-black p-3 mb-3"
                />

                <input
                    value={jiraBoardId}
                    onChange={(e) =>
                    setJiraBoardId(
                        e.target.value
                    )
                    }
                    placeholder="Board Id"
                    className="w-full rounded-xl bg-white text-black p-3 mb-3"
                />

                <input
                    value={jiraSprintId}
                    onChange={(e) =>
                    setJiraSprintId(
                        e.target.value
                    )
                    }
                    placeholder="Sprint Id"
                    className="w-full rounded-xl bg-white text-black p-3 mb-4"
                />

                <button
                    onClick={
                    importFromJira
                    }
                    className="
                    w-full
                    rounded-xl
                    bg-orange-600
                    py-3
                    text-white
                    font-semibold
                    hover:bg-orange-700
                    "
                >
                    Import Jira Sprint
                </button>

                </div>

                {/* Excel */}
                <div>
                <h3 className="mb-4 text-lg font-semibold text-white">
                    Excel Import
                </h3>

                <a
                    href="/templates/tickets.xlsx"
                    download
                    className="
                    mb-5
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-emerald-600
                    px-4
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-emerald-700
                    "
                >
                    Download Template
                </a>

                <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) =>
                    setSelectedExcel(
                        e.target.files?.[0] ?? null
                    )
                    }
                    className="
                    block
                    w-full
                    rounded-xl
                    bg-white
                    p-3
                    text-black
                    "
                />

                <button
                    onClick={importExcel}
                    disabled={!selectedExcel}
                    className="
                    mt-4
                    w-full
                    rounded-xl
                    bg-blue-600
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:bg-slate-600
                    "
                >
                    Import Excel
                </button>

                {selectedExcel && (
                    <p className="mt-3 text-sm text-green-400">
                    Selected: {selectedExcel.name}
                    </p>
                )}
                </div>
            </div>
        </div>

        )}

    </div>
    );
}