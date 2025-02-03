import fs from "fs";
import https from "https";
import { execSync } from "child_process";
import os from "os";
import fetch from "node-fetch";// Import fetch for Node.js

// Define Canister ID
const CANISTER_ID = "br5f7-7uaaa-aaaaa-qaaca-cai";

// Read principal IDs from the file
function getPrincipalsFromFile(filename) {
  const data = fs.readFileSync(filename, "utf8").trim().split("\n");
  return data.map(line => line.split(": ")[1].trim()); // Extracts principal IDs
}

/**
 * Fetch random user details from API
 * Uses fetch instead of axios
 */
async function fetchRandomUserData(count) {
  try {
    const response = await fetch(`https://randomuser.me/api/?results=${count}`);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    
    const data = await response.json();
    return data.results.map((user) => ({
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      telegramHandle: `@${user.login.username}`,
      profilePicUrl: user.picture.large
    }));
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return [];
  }
}

/**
 * Fetch profile picture as binary vec nat8 format
 */
async function fetchProfilePicAsBlob(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve("opt null");
      return;
    }

    https.get(url, (res) => {
      let data = [];
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => {
        let arrayBufferView = Buffer.concat(data);
        let imageVecNat8 = "opt vec {" + Array.from(arrayBufferView).map(byte => byte.toString()).join(";") + "}";
        resolve(imageVecNat8);
      });
    }).on("error", (err) => {
      console.error("Error fetching image:", err.message);
      resolve("opt null");
    });
  });
}

/**
 * Process users and update details in the canister
 */
async function processUsers() {
  const principalIds = getPrincipalsFromFile("principals.txt");
  const users = await fetchRandomUserData(principalIds.length);

  if (users.length !== principalIds.length) {
    console.error("Mismatch: Not enough users fetched for available principal IDs!");
    return;
  }

  for (let i = 0; i < principalIds.length; i++) {
    const user = users[i];
    const principalId = principalIds[i];

    console.log(`Processing user: ${user.name} (${principalId})`);

    const profilePicBlob = await fetchProfilePicAsBlob(user.profilePicUrl);
    console.log(`Profile Pic Blob for ${user.name}: ${profilePicBlob}`);

    // Create temporary file for the argument
    const argContent = `(principal "${principalId}", "${user.name}", "${user.email}", "${user.telegramHandle}", ${profilePicBlob})`;
    const argFilePath = `${os.tmpdir()}/candid_args_${i}.txt`;
    fs.writeFileSync(argFilePath, argContent);

    console.log(`Generated Candid Argument File for ${user.name}:`);
    console.log(argContent);

    try {
      const response = execSync(`dfx canister call ${CANISTER_ID} updateUserDetails --argument-file ${argFilePath}`).toString();
      console.log(`Response for ${user.name}: ${response}`);
    } catch (error) {
      console.error(`Error calling canister for ${user.name}:`, error.message);
    }

    // Clean up temp file
    fs.unlinkSync(argFilePath);

    console.log("-----------------------------------");
  }
}

processUsers();
