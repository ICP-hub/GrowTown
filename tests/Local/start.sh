dfx stop

dfx start --clean --background

./icrc2.sh

dfx deploy

./transaction.sh

dfx canister update-settings BeGod_backend --add-controller r3yqz-y5gbg-zpur7-osnrv-wjxls-ixeno-c7l3k-7ocwg-hlfwt-ogvsb-4ae

dfx canister update-settings BeGod_frontend --add-controller r3yqz-y5gbg-zpur7-osnrv-wjxls-ixeno-c7l3k-7ocwg-hlfwt-ogvsb-4ae

dfx canister update-settings BeGod_backend --add-controller hlfio-lmew7-yj3yy-ddt7b-zn7od-jmb2a-lkxwf-cn5gx-2ylk7-tsr6t-jqe

dfx canister update-settings BeGod_frontend --add-controller hlfio-lmew7-yj3yy-ddt7b-zn7od-jmb2a-lkxwf-cn5gx-2ylk7-tsr6t-jqe

dfx canister update-settings BeGod_backend --add-controller 4kxuh-gb7ut-zf7uz-3z7s3-bmu2x-46huq-km4ea-baabl-vqcst-sxxbr-nqe