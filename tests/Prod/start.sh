
# dfx stop

# dfx start --clean --background


dfx identity use Mohit;
dfx cycles balance --network ic;
./icrc2.sh
dfx deploy --network ic
# dfx deploy BeGod_frontend --network ic