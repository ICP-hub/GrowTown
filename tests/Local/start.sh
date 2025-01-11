dfx stop

dfx start --clean --background

./icrc2.sh

dfx deploy GrowTown_assethandler 
dfx deploy GrowTown_backend
# dfx deploy 


./transaction.sh

# dfx canister update-settings GrowTown --add-controller 4kxuh-gb7ut-zf7uz-3z7s3-bmu2x-46huq-km4ea-baabl-vqcst-sxxbr-nqe