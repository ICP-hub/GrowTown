for id in $(dfx identity list); do
  if [[ "$id" != "Mohit" && "$id" != "anonymous" && "$id" != "controller" && "$id" != "default" && "$id" != "minter" ]]; then
    dfx identity remove "$id"
  fi
done
