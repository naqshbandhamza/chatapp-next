import axios from "axios";

interface AutomationSettingsPayload {
    enabled: boolean;
    current_days: number;
    baseline_days: number;
    campaign_ids: number[];
}

export async function updateAutomationSettings(
    token: string,
    payload: AutomationSettingsPayload
) {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/automations/settings/`,
            {
                automation_type: "creative_fatigue",
                ...payload,
            },
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
        console.error("Failed to update automation settings:", error);

        return {
            success: false,
            data: null,
        };
    }
}