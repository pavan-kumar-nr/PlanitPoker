import JoinRoom from "./JoinRoom";

type PageProps = {
  params: Promise<{
    roomcode: string;
  }>;
};

export default async function RoomPage({
  params,
}: PageProps) {
  const resolvedParams = await params;

  return (
    <JoinRoom
      roomCode={resolvedParams.roomcode}
    />
  );
}