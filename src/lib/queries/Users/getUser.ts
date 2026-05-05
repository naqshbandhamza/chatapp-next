import axios from 'axios';

export async function getUser(userId: string, token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/users/${userId}/`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error fetching user:", error);

    return {
      success: false,
      error: error?.response?.data || "Something went wrong",
      status: error?.response?.status || 500,
    };
  }
}
