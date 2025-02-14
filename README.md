# Medication Manager

## How to Run
- `npm i`
- Update package.json script `sst` to use your preferred `AWS_PROFILE`
- `npm run sst`
    - Runs SST in a dev/local mode
    - Creates needed API & dynamo table
    - Builds and serves front-end application

## Technologies Used
- SST v3
    - Api Gateway
    - Lambda
    - Authorizer
    - Dynamo DB
    - Static Site
- Vite
- React
- Tailwind
- Biomejs

## Notes
- Authorizer uses a hardcoded value which is only done since this is a demo
- isMedicationRecord() - I wouldn't create object validators like this in a regular project. I'd use something like zod or joi.
- List of available medications is just a small object I created. In reality this would need to be cross referenced to another DB
- Some shared types exist where they are the most relevant, might make sense to move shared types to a types folder

# Scope
I did not include the ability to mark medications as taken. I think this would be a good thing to do on a call together. I'm going to be out of town starting tomorrow so I wanted to get this done before I leave 🙂 For a preliminary coding exercise what I have provided so far should be sufficient to determine if we should move forward to the next step or not.

# Screenshots
### CLI - SST Dev Mode
![SST Dev Mode](/screenshots/sst-dev.png?raw=true "SST Dev Mode")

### CLI - SST Local API
![SST Local API](/screenshots/sst-local-api.png?raw=true "SST Local API")

### Select a patient
![Select Patient](/screenshots/select-patient.png?raw=true "Select Patient")

### Patient Loading
![Patient Loading](/screenshots/loading.png?raw=true "Patient Loading")

### Patient Loaded
![Patient Loaded](/screenshots/loaded.png?raw=true "Patient Loaded")

### Medication Typeahead
![Medication Typeahead](/screenshots/typeahead.png?raw=true "Medication Typeahead")

### Ready to Add a Medication
![Ready to add](/screenshots/ready-to-add.png?raw=true "Ready to add")

### Medication Added
![Medication Added](/screenshots/added.png?raw=true "Medication Added")