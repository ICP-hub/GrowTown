#!/bin/bash

# Define Canister ID
CANISTER_ID='br5f7-7uaaa-aaaaa-qaaca-cai'

# Read principal IDs from principals.txt into an array
PRINCIPAL_IDS=()
while IFS= read -r PRINCIPAL_ID; do
  PRINCIPAL_IDS+=("$PRINCIPAL_ID")
done < principals.txt

# Read user details from users.txt and process only if principal exists in principals.txt
while IFS='|' read -r PRINCIPAL_ID NAME EMAIL TELEGRAM_HANDLE PROFILE_PIC_URL; do
  # Check if PRINCIPAL_ID exists in PRINCIPAL_IDS list
  if [[ ! " ${PRINCIPAL_IDS[@]} " =~ " ${PRINCIPAL_ID} " ]]; then
    continue
  fi

  echo "Processing user: $NAME ($PRINCIPAL_ID)"

  # Convert profile pic to raw binary using Node.js with https module
  PROFILE_PIC_BLOB=$(node - <<EOF
const https = require("https");

const IMAGE_URL = "$PROFILE_PIC_URL";

https.get(IMAGE_URL, (res) => {
  let data = [];
  res.on("data", (chunk) => data.push(chunk));
  res.on("end", () => {
    let arrayBufferView = Buffer.concat(data);
    let imageVecNat8 = "opt vec {" + Array.from(arrayBufferView).map(byte => byte.toString()).join(";") + "}";
    console.log(imageVecNat8);
  });
}).on("error", (err) => {
  console.error("Error fetching image", err);
  console.log("opt null");
});
EOF
  )

  # Debug: Print the converted image data
  echo "Profile Pic Blob for $NAME: $PROFILE_PIC_BLOB"

  # Ensure PROFILE_PIC_BLOB is correctly formatted (opt null if empty)
  if [[ -z "$PROFILE_PIC_BLOB" || "$PROFILE_PIC_BLOB" == "opt null" ]]; then
    PROFILE_PIC_BLOB="opt null"
  fi

  # Create temporary argument file
  ARG_FILE=$(mktemp)
  echo "(principal \"$PRINCIPAL_ID\", \"$NAME\", \"$EMAIL\", \"$TELEGRAM_HANDLE\", $PROFILE_PIC_BLOB)" > "$ARG_FILE"

  # Debug: Print the argument file contents
  echo "Generated Candid Argument File for $NAME:"
  cat "$ARG_FILE"

  # Call updateUserDetails canister method and capture output
  RESPONSE=$(dfx canister call $CANISTER_ID updateUserDetails --argument-file "$ARG_FILE" 2>&1)

  # Debug: Print the response
  echo "Response for $NAME: $RESPONSE"

  # Clean up temporary files
  rm -f "$ARG_FILE"

  echo "-----------------------------------"

done 
