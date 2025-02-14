/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: "MedicationReminders",
			removal: input?.stage === "production" ? "retain" : "remove",
			protect: ["production"].includes(input?.stage),
			home: "aws",
		};
	},
	async run() {
		//	Create table for patient medications
		const patientMedicationsTable = new sst.aws.Dynamo(
			"PatientMedicationsTable",
			{
				fields: {
					patientId: "string",
					medicationId: "string",
				},
				primaryIndex: { hashKey: "patientId", rangeKey: "medicationId" },
			},
		);

		//	Create API gateway
		const patientMedicationsApi = new sst.aws.ApiGatewayV2(
			"PatientMedicationsApi",
		);

		//	Add authorizer
		const authorizer = patientMedicationsApi.addAuthorizer({
			name: "Authorizer",
			lambda: {
				function: "src/handlers/authorizer.handler",
			},
		});

		//	Add route to get patient meds
		patientMedicationsApi.route(
			"GET /patientMedications",
			{
				handler: "src/handlers/getPatientMeds.handler",
				link: [patientMedicationsTable],
			},
			{
				auth: {
					lambda: authorizer.id,
				},
			},
		);
		//	Add route to add med for patient
		patientMedicationsApi.route(
			"POST /addMedication",
			{
				handler: "src/handlers/addPatientMed.handler",
				link: [patientMedicationsTable],
			},
			{
				auth: {
					lambda: authorizer.id,
				},
			},
		);

		//	Create front-end, give reference to API
		const viteApp = new sst.aws.StaticSite("Web", {
			build: {
				command: "npm run build",
				output: "dist",
			},
			environment: {
				VITE_API_URL: patientMedicationsApi.url,
			},
		});

		// Output infrastructure details
		return {
			appUrl: viteApp.url,
			apiUrl: patientMedicationsApi.url,
			tableName: patientMedicationsTable.name,
		};
	},
});
