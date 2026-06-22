import { supabase } from "../../../../lib/supabase";
import BoardClient from "./BoardClient";

type Props = {
  params: Promise<{
    roomcode: string;
  }>;
};

export default async function BoardPage({
  params,
}: Props) {
  const { roomcode } =
    await params;

  const { data: session } =
    await supabase
      .from("sessions")
      .select("*")
      .eq("room_code", roomcode)
      .single();

  if (!session) {
    return (
      <div>
        Session not found
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white text-black">
      <div className="w-full border-b bg-linear-to-r from-blue-600 to-purple-900 text-white px-8 py-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Planit Poker
        </h1>
        <p className="mt-2 text-blue-100">
          Real-time agile estimation for your team
        </p>
      </div>

      <div className="w-full px-8 py-6">
        <BoardClient
          session={session}
        />
      </div>
    </main>
  );
}