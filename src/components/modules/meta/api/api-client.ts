export async function apiGet<T>(
    token: string,
    path: string,
    errorMessage: string,
    params?: Record<string, string>,
): Promise<T> {
    const query = params
        ? `?${new URLSearchParams(params).toString()}`
        : "";

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}${query}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error(errorMessage);
    }

    return response.json();
}


export async function apiPost<T>(
    token: string,
    url: string,
    errorMessage: string,
    body?: Record<string, unknown>,
): Promise<T> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new Error(errorMessage);
    }

    return response.json();
}