export async function adoRequest(
  url: string,
  pat: string,
  options?: RequestInit
) {
  return fetch(url, {
    ...options,
    headers: {
      Authorization:
        `Basic ${Buffer.from(
          `:${pat}`
        ).toString("base64")}`,
      "Content-Type":
        "application/json",
      ...(options?.headers ?? {}),
    },
  });
}