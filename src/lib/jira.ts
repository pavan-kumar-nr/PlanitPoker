export async function jiraRequest(
  url: string,
  email: string,
  token: string
) {
  return fetch(url, {
    headers: {
      Authorization:
        `Basic ${Buffer.from(
          `${email}:${token}`
        ).toString("base64")}`,
      Accept:
        "application/json",
    },
  });
}