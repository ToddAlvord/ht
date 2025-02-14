import { isMedicationRecord } from "../handlers/modules/dynamodb";
import { saveMedicationRecord } from "./modules/dynamodb";

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import type { MedicationRecord } from "../handlers/modules/dynamodb";

export async function handler(
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
	const recordToSave: MedicationRecord = JSON.parse(event.body || "{}");

	if (!isMedicationRecord(recordToSave)) {
		return {
			statusCode: 400,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ error: "Invalid request body" }),
		};
	}

	await saveMedicationRecord(recordToSave);
	return {
		statusCode: 200,
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message: "success" }),
	};
}
