import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = Resource.PatientMedicationsTable.name;

export interface MedicationRecord {
	patientId: string;
	medicationId: string;
	medicationName: string;
	dosage: string;
	frequency: string;
}

export function isMedicationRecord(obj: unknown): obj is MedicationRecord {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"patientId" in obj &&
		"medicationId" in obj &&
		"medicationName" in obj &&
		"dosage" in obj &&
		"frequency" in obj &&
		typeof obj.patientId === "string" &&
		typeof obj.medicationId === "string" &&
		typeof obj.medicationName === "string" &&
		typeof obj.dosage === "string" &&
		typeof obj.frequency === "string"
	);
}

type tupleReturnType = [null, string] | [Error];

// Save a record to DynamoDB
export async function saveMedicationRecord(
	record: MedicationRecord,
): Promise<tupleReturnType> {
	try {
		const command = new PutCommand({
			TableName: TABLE_NAME,
			Item: record,
		});

		await docClient.send(command);

		console.log(
			`Saved record for patientId=${record.patientId}, medicationId=${record.medicationId}`,
		);
		return [null, "done"];
	} catch (error) {
		console.error("Error saving medication record:", error);
		const err = error instanceof Error ? error : new Error(String(error));
		return [err];
	}
}

// Get a record from DynamoDB
export async function getMedicationRecord(
	patientId: string,
	medicationId: string,
): Promise<MedicationRecord | null> {
	try {
		const command = new GetCommand({
			TableName: TABLE_NAME,
			Key: { patientId, medicationId },
		});

		const response = await docClient.send(command);
		return (response.Item as MedicationRecord) || null;
	} catch (error) {
		console.error("Error fetching medication record:", error);
		throw error;
	}
}

export async function getMedicationsForPatient(patientId: string) {
	const command = new QueryCommand({
		TableName: TABLE_NAME,
		KeyConditionExpression: "patientId = :patientId",
		ExpressionAttributeValues: { ":patientId": patientId },
	});

	const { Items } = await docClient.send(command);

	return Items;
}

export async function deleteMedicationRecord(
	patientId: string,
	medicationId: string,
): Promise<tupleReturnType> {
	try {
		const command = new DeleteCommand({
			TableName: TABLE_NAME,
			Key: { patientId, medicationId },
		});

		await docClient.send(command);

		console.log(
			`Deleted record for patientId=${patientId}, medicationId=${medicationId}`,
		);

		return [null, "Record deleted successfully"];
	} catch (error) {
		console.error("Error deleting medication record:", error);

		const err = error instanceof Error ? error : new Error(String(error));

		return [err];
	}
}
