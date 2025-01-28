# dfx stop

# dfx start --clean --background
./icrc2.sh

dfx deploy

./transaction.sh

dfx canister update-settings Growntown_Backend --add-controller odgbc-u5ozn-y5ikb-loews-au6n5-k5woy-kf3yu-klqkp-geyiu-eezvc-pqe

dfx canister update-settings Growntown_AdminFrontend --add-controller odgbc-u5ozn-y5ikb-loews-au6n5-k5woy-kf3yu-klqkp-geyiu-eezvc-pqe

dfx canister update-settings Growntown_Frontend --add-controller 5poib-uaar7-uhwx6-hq2iv-r3nun-lx5kz-gkams-nvxce-szojg-sipiu-4ae