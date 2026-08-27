const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getMetaStatus() {
  const response = await fetch(
    `${API_URL}/api/meta/status/`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to get Meta status");
  }

  return response.json();
}

export async function getMetaAdAccounts() {
  const response = await fetch(
    `${API_URL}/api/meta/ad-accounts/`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to get Meta ad accounts");
  }

  return response.json();
}