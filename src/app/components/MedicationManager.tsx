import { useEffect, useState } from "react";
import { addMedication, getPatientMedications } from "../modules/fetch";
import { LoadingSpinner } from "./indicators";

import type { MedicationRecord } from "../../handlers/modules/dynamodb";

const medicationsList = [
	{ id: "med-001", name: "Aspirin" },
	{ id: "med-002", name: "Ibuprofen" },
	{ id: "med-003", name: "Acetaminophen" },
	{ id: "med-004", name: "Metformin" },
	{ id: "med-005", name: "Atorvastatin" },
	{ id: "med-006", name: "Lisinopril" },
	{ id: "med-007", name: "Levothyroxine" },
	{ id: "med-008", name: "Omeprazole" },
	{ id: "med-009", name: "Losartan" },
	{ id: "med-010", name: "Albuterol" },
].sort((a, b) => a.name.localeCompare(b.name));

const frequencies = ["Daily", "Twice Daily", "Every Other Day", "As Needed"];

export default function MedicationManager({
	patientId,
}: { patientId: string }) {
	const [medication, setMedication] = useState("");
	const [medicationId, setMedicationId] = useState("");
	const [dosage, setDosage] = useState("");
	const [frequency, setFrequency] = useState("");
	const [suggestions, setSuggestions] = useState<typeof medicationsList>([]);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [addedMedications, setAddedMedications] = useState<MedicationRecord[]>(
		[],
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [loadingMedications, setIsLoadingMedications] = useState(true);

	const handleMedicationChange = (value: string) => {
		setMedication(value);
		setSelectedIndex(-1);
		setSuggestions(
			value
				? medicationsList.filter((m) =>
						m.name.toLowerCase().includes(value.toLowerCase()),
					)
				: [],
		);
	};

	const handleSelectMedication = (med: { id: string; name: string }) => {
		setMedication(med.name);
		setMedicationId(med.id);
		setSuggestions([]);
		setSelectedIndex(-1);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
			if (!medication && suggestions.length === 0) {
				setSuggestions(medicationsList);
			}
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIndex((prev) => Math.max(prev - 1, 0));
			if (!medication && suggestions.length === 0) {
				setSuggestions(medicationsList);
			}
		} else if (e.key === "Enter" && selectedIndex >= 0) {
			e.preventDefault();
			handleSelectMedication(suggestions[selectedIndex]);
		} else if (e.key === "Escape") {
			setSuggestions([]);
			setSelectedIndex(-1);
		}
	};

	const handleSubmit = async () => {
		if (!medication || !medicationId) return;
		const newRecord: MedicationRecord = {
			patientId,
			medicationId,
			medicationName: medication,
			dosage,
			frequency,
		};
		setIsSubmitting(true);
		const [addErr, response] = await addMedication(newRecord);
		setIsSubmitting(false);

		if (addErr) {
			//  TODO - Dont use built in alert for errors
			alert(addErr);
			return;
		}
		if (response?.message === "success") {
			setAddedMedications([...addedMedications, newRecord]);
			setMedication("");
			setMedicationId("");
			setDosage("");
			setFrequency("");
			setSuggestions([]);
		}
	};

	useEffect(() => {
		getPatientMedications(patientId).then(([err, response]) => {
			if (err) {
				console.error("Error when fetching patient medications");
				return;
			}
			console.log(response.medications);
			setAddedMedications(response.medications);
			setIsLoadingMedications(false);
		});
	}, [patientId]);

	const canSubmit =
		!isSubmitting &&
		[medication, medicationId, dosage, frequency].every(Boolean);

	return (
		<div className="flex h-screen items-center justify-center bg-gray-100">
			<div className="bg-white p-6 rounded-2xl shadow-lg w-96">
				<h2 className="text-lg font-semibold mb-4">Patient ID: {patientId}</h2>

				<div className="relative">
					<input
						type="text"
						value={medication}
						onChange={(e) => handleMedicationChange(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Enter medication name"
						className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{suggestions.length > 0 && (
						<ul className="absolute bg-white border border-gray-300 rounded-lg mt-1 w-full shadow-lg max-h-40 overflow-y-auto">
							{suggestions.slice().map((med, index) =>
								selectedIndex < index + 4 ? (
									// biome-ignore lint/a11y/useKeyWithClickEvents: <Handled on input>
									<li
										key={med.id}
										className={`p-2 cursor-pointer ${
											index === selectedIndex
												? "bg-blue-100"
												: "hover:bg-gray-100"
										}`}
										onClick={() => handleSelectMedication(med)}
									>
										{med.name}
									</li>
								) : (
									false
								),
							)}
						</ul>
					)}
				</div>

				<input
					type="text"
					value={dosage}
					onChange={(e) => setDosage(e.target.value)}
					placeholder="Enter dosage"
					className="w-full p-2 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>

				<select
					value={frequency}
					onChange={(e) => setFrequency(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Select frequency</option>
					{frequencies.map((freq) => (
						<option key={freq} value={freq}>
							{freq}
						</option>
					))}
				</select>

				<button
					type="submit"
					onClick={handleSubmit}
					className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
					disabled={!canSubmit || loadingMedications}
				>
					{isSubmitting || loadingMedications ? (
						<LoadingSpinner />
					) : (
						"Add Medication"
					)}
				</button>

				<div className="mt-6">
					<h3 className="text-lg font-semibold">Medications</h3>
					{addedMedications.length > 0 && (
						<ul className="mt-2 space-y-2">
							{addedMedications.map((med) => (
								<li
									key={med.medicationId}
									className="p-2 bg-gray-100 rounded-lg shadow"
								>
									<strong>{med.medicationName}</strong> -{" "}
									{med.dosage || "No dosage"} -{" "}
									{med.frequency || "No frequency"}
								</li>
							))}
						</ul>
					)}
					{!loadingMedications && addedMedications.length === 0 && (
						<p className="text-center">No Medications Added</p>
					)}
					{loadingMedications && (
						<p className="text-center">Fetching Medications...</p>
					)}
				</div>
			</div>
		</div>
	);
}
