export type Session = {
  id: string;
  room_code: string;
  name: string;
  creator_name: string | null;
  voting_type: string;
  voting_options: string[] | null;
  is_active: boolean;
};

export type Ticket = {
  id: string;
  session_id: string;
  ticket_key: string;
  title: string;
  description: string;
  status: string;
  votes_revealed: boolean;
  completed: boolean;
};

export type Participant = {
  id: string;
  session_id: string;
  name: string;
  role: "VOTER" | "SPECTATOR" | "CREATOR";
  client_id: string;
};

export type Vote = {
  id: string;
  ticket_id: string;
  participant_id: string;
  vote_value: string;
};