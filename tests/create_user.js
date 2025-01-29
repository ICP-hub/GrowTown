import { execSync } from "child_process";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const PRINCIPALS_FILE = "principals.txt";
const CANISTER_ID = 'br5f7-7uaaa-aaaaa-qaaca-cai';
const MAX_IDENTITIES = 10;

if (!CANISTER_ID) {
  console.error(" Error: Environment variable CANISTER_ID_GROWNTOWN_BACKEND is not set.");
  process.exit(1);
}

// Function to execute shell commands safely
const execCommand = (command) => {
  try {
    return execSync(command, { encoding: "utf8" }).trim();
  } catch (error) {
    console.error(` Error executing command: ${command}`);
    console.error(error.stderr);
    process.exit(1); // Exit immediately on failure
  }
};

// Function to read or create principals file
const getStoredPrincipals = () => {
  if (fs.existsSync(PRINCIPALS_FILE)) {
    console.log(" Principals file found. Reading existing principals...");
    return fs.readFileSync(PRINCIPALS_FILE, "utf8")
      .split("\n")
      .map(line => line.trim().split(": ").pop()) // Extracts only the principal
      .filter(Boolean);
  } else {
    console.log(" Principals file not found. Creating a new one...");
    fs.writeFileSync(PRINCIPALS_FILE, ""); // Create empty file
    return [];
  }
};

// Function to create a new identity and return its principal
const createNewIdentity = (identityName) => {
  execCommand(`dfx identity new ${identityName} --force`);
  const principal = execCommand(`dfx identity get-principal --identity ${identityName}`);
  console.log(` New identity created: ${identityName}`);
  console.log(` Principal: ${principal}`);
  return principal;
};

// Function to create new users
const createUsers = async () => {
  let principals = getStoredPrincipals();
  let identitiesCreated = 0;

  if (principals.length < MAX_IDENTITIES) {
    console.log(" Creating new user identities...");
    for (let i = principals.length + 1; i <= MAX_IDENTITIES; i++) {
      const identityName = `user${i}`;
      const principal = createNewIdentity(identityName);

      if (principal) {
        principals.push(principal);
        fs.appendFileSync(PRINCIPALS_FILE, `user${i}: ${principal}\n`);
        identitiesCreated++;
      }
    }
    console.log(` ${identitiesCreated} new identities created and stored in principals.txt.`);
  } else {
    console.log(" Already 10 identities exist. Skipping creation.");
  }

  console.log(" Creating users in Growntown_Backend...");

  for (const principal of principals) {
    const userUUID = uuidv4();
    console.log(` Creating user: Principal=${principal}, UUID=${userUUID}`);

    const command = `dfx canister call ${CANISTER_ID} create_user '(principal "${principal}", "${userUUID}")'`;
    const result = execCommand(command);

    console.log(` Successfully created user: ${principal}`);
    console.log(result);
  }

  console.log(" All users created successfully.");
};

// Execute the script
createUsers();