import axios from "axios";

export async function getAutomationSettings(token: string) {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/automations/settings/`,
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );

        return {
            success: true,
            data: response.data.settings,
        };
    } catch (error) {
        console.error("Failed to fetch automation settings:", error);

        return {
            success: false,
            data: null,
        };
    }
}