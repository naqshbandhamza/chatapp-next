import axios from 'axios';

export async function getAutomationAlerts(token: string) {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/automations/alerts/`,
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error(
            'Failed to fetch automation alerts:',
            error
        );

        return {
            success: false,
            data: [],
        };
    }
}