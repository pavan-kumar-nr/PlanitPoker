export function getClientId() {
  let clientId = localStorage.getItem(
    "planit-poker-client-id"
  );

  if (!clientId) {
    clientId = crypto.randomUUID();

    localStorage.setItem(
      "planit-poker-client-id",
      clientId
    );
  }

  return clientId;
}