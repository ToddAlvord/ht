import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getMedicationsForPatient } from "./modules/dynamodb";

export async function handler(
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
	const { patientId } = event.queryStringParameters || {};
	if (typeof patientId !== "string" || patientId.length === 0) {
		return {
			statusCode: 400,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ error: "Invalid or missing parameters" }),
		};
	}
	const records = await getMedicationsForPatient(patientId);
	return {
		statusCode: 200,
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ medications: records }),
	};
}
