import { useState } from "react";
import MedicationManager from "./MedicationManager";

function App() {
	const [patientId, setPatientId] = useState<string | null>(null);
	const [inputValue, setInputValue] = useState("");

	const handleSubmit = () => {
		if (inputValue.trim() === "") return;
		setPatientId(inputValue.trim());
	};

	return (
		<>
			{!patientId ? (
				<div className="flex h-screen items-center justify-center bg-gray-100">
					<div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
						<div>
							<h2 className="text-lg font-semibold mb-4">Enter Patient ID</h2>
							<input
								type="text"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
								placeholder="Enter Patient ID"
								className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								type="button"
								onClick={handleSubmit}
								className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			) : (
				<MedicationManager patientId={patientId} />
			)}
		</>
	);
}

export default App;
