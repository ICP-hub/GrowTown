# dfx stop

# dfx start --clean --background
./icrc2.sh

dfx deploy

# ./transaction.sh

dfx canister update-settings Growntown_Backend --add-controller 5poib-uaar7-uhwx6-hq2iv-r3nun-lx5kz-gkams-nvxce-szojg-sipiu-4ae

dfx canister update-settings Growntown_AdminFrontend --add-controller 5poib-uaar7-uhwx6-hq2iv-r3nun-lx5kz-gkams-nvxce-szojg-sipiu-4ae

dfx canister update-settings Growntown_Frontend --add-controller 5poib-uaar7-uhwx6-hq2iv-r3nun-lx5kz-gkams-nvxce-szojg-sipiu-4ae

dfx canister update-settings icrc2_token_canister --add-controller 5poib-uaar7-uhwx6-hq2iv-r3nun-lx5kz-gkams-nvxce-szojg-sipiu-4ae

dfx canister update-settings Growntown_Backend --add-controller 4kxuh-gb7ut-zf7uz-3z7s3-bmu2x-46huq-km4ea-baabl-vqcst-sxxbr-nqe
