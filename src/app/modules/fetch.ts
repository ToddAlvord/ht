import type { MedicationRecord } from "../../handlers/modules/dynamodb";

const apiUrl = import.meta.env.VITE_API_URL;
const apiAuthToken = "123ABC";

type postBody = Record<string, unknown>;

async function post(url: string, body: postBody) {
	return doFetch(url, "POST", body);
}

async function get(url: string) {
	return doFetch(url, "GET");
}

async function doFetch(url: string, method: "GET" | "POST", body?: postBody) {
	// Prepare fetch options
	const fetchOptions: RequestInit = {
		method,
		headers: {
			Authorization: apiAuthToken,
		},
	};
	if (body) {
		fetchOptions.body = JSON.stringify(body);
	}

	// Send request
	try {
		const response = await fetch(url, fetchOptions);

		// Check if the response status is OK
		if (!response.ok) {
			return [new Error(`HTTP error! Status: ${response.status}`)];
		}

		// Convert the response to JSON
		const data = await response.json();

		// Return the parsed JSON data
		return [null, data];
	} catch (error) {
		// Handle any errors that occur during the fetch
		console.error("Error fetching data:", error);
		return [error];
	}
}

export async function addMedication(record: MedicationRecord) {
	return post(`${apiUrl}/addMedication`, record as unknown as postBody);
}

export async function getPatientMedications(patientId: string) {
	return get(`${apiUrl}/patientMedications?patientId=${patientId}`);
}
