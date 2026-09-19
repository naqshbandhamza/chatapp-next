import axios from "axios";

export async function getAutomationCampaigns(token: string) {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/automations/campaigns/`,
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );

        return {
            success: true,
            data: response.data.campaigns,
        };
    } catch (error) {
        console.error("Failed to fetch automation campaigns:", error);

        return {
            success: false,
            data: [],
        };
    }
}