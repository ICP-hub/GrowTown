import ExtTokenClass "../EXT-V2/ext_v2/v2";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import List "mo:base/List";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import _Int "mo:base/Int";
import Iter "mo:base/Iter";
import Error "mo:base/Error";
import _Nat32 "mo:base/Nat32";
import Result "mo:base/Result";
import Nat64 "mo:base/Nat64";
import AID "../EXT-V2/motoko/util/AccountIdentifier";
import ExtCore "../EXT-V2/motoko/ext/Core";
import Types "../EXT-V2/Types";
import _UsersTypes "./Users/Types";
import _V2 "../EXT-V2/ext_v2/v2";
import HashMap "mo:base/HashMap";
import _Hash "mo:base/Hash";
import _Option "mo:base/Option";
import _Queue "../EXT-V2/motoko/util/Queue";
import ExtCommon "../EXT-V2/motoko/ext/Common";
import _owners "../EXT-V2/ext_v2/v2";
import Pagin "pagin";
import _JSON "mo:json";

actor Main {

  type AccountIdentifier = ExtCore.AccountIdentifier;
  type TokenIndex = ExtCore.TokenIndex;
  type TokenIdentifier = ExtCore.TokenIdentifier;

  type NFTInfo = (TokenIndex, AccountIdentifier, Metadata);

  type MetadataValue = (
    Text,
    {
      #text : Text;
      #blob : Blob;
      #nat : Nat;
      #nat8 : Nat8;
    },
  );
  type MetadataContainer = {
    #data : [MetadataValue];
    #blob : Blob;
    #json : Text;
  };

  type TransferRequest = ExtCore.TransferRequest;
  type TransferResponse = ExtCore.TransferResponse;

  type Deposit = {
    tokenId : TokenIndex;
    sender : Principal;
    collectionCanister : Principal;
    timestamp : Time.Time;
    pubKey : Principal;
  };

  type SubAccount = ExtCore.SubAccount;

  public type ListRequest = {
    token : TokenIdentifier;
    from_subaccount : ?SubAccount;
    price : ?Nat64;
  };

  type Listing = {
    seller : Principal;
    price : Nat64;
    locked : ?Time;
  };

  type Transaction = {
    token : TokenIndex;
    seller : AccountIdentifier;
    price : Nat64;
    buyer : AccountIdentifier;
    time : Time;
  };

  type Metadata = {
    #fungible : {
      name : Text;
      symbol : Text;
      decimals : Nat8;
      metadata : ?MetadataContainer;
    };
    #nonfungible : {
      name : Text;
      description : Text;
      asset : Text;
      thumbnail : Text;
      metadata : ?MetadataContainer;
    };
  };

  type NftTypeMetadata = {
    nfttype : Text;
    nft_type_quantity : Nat;
    nft_type_cost : Nat64;
  };

  type User = {
    uid : Text;
    id : Nat;
    accountIdentifier : Principal;
    createdAt : Time.Time;
  };

  //Additional user details
  type UserDetails = {
    name : Text;
    email : Text;
    telegram : Text;
    profilepic : ?Text;

  };

  //LEDGER
  type AccountBalanceArgs = { account : AccountIdentifier };
  type ICPTs = { e8s : Nat64 };
  type SendArgs = {
    memo : Nat64;
    amount : ICPTs;
    fee : ICPTs;
    from_subaccount : ?SubAccount;
    to : AccountIdentifier;
    created_at_time : ?Time;
  };

  let ExternalService_ICPLedger = actor "bw4dl-smaaa-aaaaa-qaacq-cai" : actor {
    send_dfx : shared SendArgs -> async Nat64;
    account_balance_dfx : shared query AccountBalanceArgs -> async ICPTs;
  };

  //Exttypes
  type Time = Time.Time;

  //type User = ExtCore.User;
  type CommonError = ExtCore.CommonError;
  type MetadataLegacy = ExtCommon.Metadata;

  public type SupportedStandard = {
    url : Text;
    name : Text;
  };

  public type Icrc28TrustedOriginsResponse = {
    trusted_origins : [Text];
  };

  // Function to return supported standards
  public query func icrc10_supported_standards() : async [SupportedStandard] {
    return [
      {
        url = "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-10/ICRC-10.md";
        name = "ICRC-10";
      },
      {
        url = "https://github.com/dfinity/wg-identity-authentication/blob/main/topics/icrc_28_trusted_origins.md";
        name = "ICRC-28";
      },
    ];
  };

  // Function to return trusted origins
  public func icrc28_trusted_origins() : async Icrc28TrustedOriginsResponse {
    let trusted_origins = [
      "https://7ynkd-kiaaa-aaaac-ahmfq-cai.icp0.io",
      "http://localhost:3001",
      "http://bd3sg-teaaa-aaaaa-qaaba-cai.localhost:4943",
      "http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai",
      "http://127.0.0.1:4943",
    ];

    return {
      trusted_origins = trusted_origins;
    };
  };

  /* -------------------------------------------------------------------------- */
  /*                         Data Maps                                          */
  /* -------------------------------------------------------------------------- */

  // Maps user and the collection canisterIds they create
  private var usersCollectionMap = TrieMap.TrieMap<Principal, [(Time.Time, Principal)]>(Principal.equal, Principal.hash);
  private stable var stableusersCollectionMap : [(Principal, [(Time.Time, Principal)])] = [];

  // Stores details about the tokens coming into this vault
  private stable var deposits : [Deposit] = [];

  // favorites data structure
  private var _favorites : HashMap.HashMap<AccountIdentifier, [(TokenIdentifier)]> = HashMap.HashMap<AccountIdentifier, [(TokenIdentifier)]>(0, AID.equal, AID.hash);
  private stable var stableFavorites : [(AccountIdentifier, [(TokenIdentifier)])] = [];

  //DB to store user related data
  private stable var usersArray : [User] = [];
  private stable var userIdCounter : Nat = 0;
  //private stable var userDetailsArray: [UserDetails] = [];
  private var userDetailsMap : TrieMap.TrieMap<Principal, UserDetails> = TrieMap.TrieMap<Principal, UserDetails>(Principal.equal, Principal.hash);

  //private stable var Objects Array
  private stable var _objects_Array : [(Nat, NftTypeMetadata)] = [];
  private stable var _objectIdCounter : Nat = 0;

  //stable storage to store the redeemed tokens by the user
  private stable var _redeemedTokens : [(Principal, TokenIdentifier)] = [];

  /* -------------------------------------------------------------------------- */
  /*                         SYSTEM FUNCTIONS                                   */
  /* -------------------------------------------------------------------------- */

  system func preupgrade() {
    stableusersCollectionMap := Iter.toArray(usersCollectionMap.entries());
    stableFavorites := Iter.toArray(_favorites.entries());

  };

  system func postupgrade() {
    usersCollectionMap := TrieMap.fromEntries(stableusersCollectionMap.vals(), Principal.equal, Principal.hash);
    _favorites := HashMap.fromIter<AccountIdentifier, [(TokenIdentifier)]>(
      stableFavorites.vals(),
      10,
      AID.equal,
      AID.hash,
    );

  };

  public shared func fetchCycles() : async Nat {
    let balance = Cycles.balance();
    Debug.print("Current cycle balance: " # Nat.toText(balance));
    return balance;
  };

  let IC = actor "aaaaa-aa" : actor {
    canister_status : { canister_id : Principal } -> async {
      settings : { controllers : [Principal] };
    };
  };

  public shared (_msg) func isController(canister_id : Principal, principal_id : Principal) : async Bool {
    let status = await IC.canister_status({ canister_id = canister_id });
    return contains(status.settings.controllers, principal_id);
  };

  func contains(arr : [Principal], value : Principal) : Bool {
    var found = false;
    for (item in arr.vals()) {
      if (item == value) {
        found := true;
      };
    };
    return found;
  };

  /* -------------------------------------------------------------------------- */
  /*                         collection related methods                         */
  /* -------------------------------------------------------------------------- */

  //add collection manually to collection map
  public query (message) func greet() : async Text {
    return "Hello, " # Principal.toText(message.caller) # "!";
  };
  public shared ({ caller = user }) func add_collection_to_map(collection_id : Principal) : async Text {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    let canisterId = Principal.fromActor(Main);
    let controllerResult = await isController(canisterId, user);

    if (controllerResult == false) {
      return ("Unauthorized: Only admins can add new collection");
    };

    let userCollections = usersCollectionMap.get(user);
    switch (userCollections) {
      case null {
        let updatedCollections = [(Time.now(), collection_id)];
        usersCollectionMap.put(user, updatedCollections);
        return "Collection added";
      };
      case (?collections) {
        let collectionsList = List.fromArray(collections);
        let collExists = List.some<(Time.Time, Principal)>(collectionsList, func((_, collId)) { collId == collection_id });
        if (collExists) {
          return "Collection already added";
        } else {
          let newCollectionsList = List.push((Time.now(), collection_id), collectionsList);
          usersCollectionMap.put(user, List.toArray(newCollectionsList));
          return "Collection added";
        };
      };
    };
  };

  //remove collection created by any admin
  public shared ({ caller = user }) func removeCollection(collection_id : Principal) : async Text {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    let canisterId = Principal.fromActor(Main);
    let controllerResult = await isController(canisterId, user);
    if (controllerResult == false) {
      return "Unauthorized: Only admins can delete a collection.";
    };

    var found = false;
    for ((userPrincipal, collections) in usersCollectionMap.entries()) {
      var updatedCollections = List.filter<(Time.Time, Principal)>(
        List.fromArray(collections),
        func((_, collId)) { 
          if (collId == collection_id) {
            found := true;
            return false;
          };
          return true;
        },
      );
      if (found) {
        usersCollectionMap.put(userPrincipal, List.toArray(updatedCollections));
      };
    };
    if (found) {
      return "Collection removed successfully.";
    } else {
      return "Collection not found.";
    };
  };

  // Collection creation
  public shared ({ caller = user }) func createExtCollection(_title : Text, _symbol : Text, _metadata : Text) : async (Principal, Principal) {
    // if (Principal.isAnonymous(user)) {
    //     throw Error.reject("User is not authenticated");
    // };
    // let canisterId = Principal.fromActor(Main);
    // // Check if the caller is one of the controllers
    // let controllerResult = await isController(canisterId,user);

    // if (controllerResult == false) {
    // throw Error.reject("Unauthorized: Only admins can create a new collection.");
    // };

    Cycles.add<system>(850_500_000_000);
    let extToken = await ExtTokenClass.EXTNFT(Principal.fromActor(Main));
    let extCollectionCanisterId = await extToken.getCanisterId();
    let collectionCanisterActor = actor (Principal.toText(extCollectionCanisterId)) : actor {
      ext_setCollectionMetadata : (
        name : Text,
        symbol : Text,
        metadata : Text,
      ) -> async ();
      setMinter : (minter : Principal) -> async ();
      ext_admin : () -> async Principal;
    };
    await collectionCanisterActor.setMinter(user);
    await collectionCanisterActor.ext_setCollectionMetadata(_title, _symbol, _metadata);

    let collections = usersCollectionMap.get(user);
    switch (collections) {
      case null {
        let updatedCollections = [(Time.now(), extCollectionCanisterId)];
        usersCollectionMap.put(user, updatedCollections);
        return (user, extCollectionCanisterId);
      };
      case (?collections) {
        let updatedObj = List.push((Time.now(), extCollectionCanisterId), List.fromArray(collections));
        usersCollectionMap.put(user, List.toArray(updatedObj));
        return (user, extCollectionCanisterId);
      };
    };

  };

  // Getting Collection Metadata
  public shared ({ caller = user }) func getUserCollectionDetails() : async ?[(Time.Time, Principal, Text, Text, Text)] {
    let collections = usersCollectionMap.get(user);
    switch (collections) {
      case (null) {
        return null;
      };
      case (?collections) {
        var result : [(Time.Time, Principal, Text, Text, Text)] = [];
        for ((timestamp, collectionCanisterId) in collections.vals()) {
          let collectionCanister = actor (Principal.toText(collectionCanisterId)) : actor {
            getCollectionDetails : () -> async (Text, Text, Text);
          };
          let details = await collectionCanister.getCollectionDetails();
          result := Array.append(result, [(timestamp, collectionCanisterId, details.0, details.1, details.2)]);
        };
        return ?result;
      };
    };
  };

  // Getting Collections that user own(only gets canisterIds of respective collections)
  public shared query ({ caller = user }) func getUserCollections() : async ?[(Time.Time, Principal)] {
    return usersCollectionMap.get(user);
  };

  // Getting all the collections ever created
  public shared func getAllCollections() : async [(Principal, [(Time.Time, Principal, Text, Text, Text)])] {
    var result : [(Principal, [(Time.Time, Principal, Text, Text, Text)])] = [];

    for ((userPrincipal, collections) in usersCollectionMap.entries()) {
      var collectionDetails : [(Time.Time, Principal, Text, Text, Text)] = [];

      for ((time, collectionCanisterId) in collections.vals()) {

        try {
          let collectionCanisterActor = actor (Principal.toText(collectionCanisterId)) : actor {
            getCollectionDetails : () -> async (Text, Text, Text);
          };

          let (collectionName, collectionSymbol, collectionMetadata) = await collectionCanisterActor.getCollectionDetails();

          collectionDetails := Array.append(collectionDetails, [(time, collectionCanisterId, collectionName, collectionSymbol, collectionMetadata)]);
        } catch (_e) {
          Debug.print("Error fetching collection details for canister: " # Principal.toText(collectionCanisterId));
          collectionDetails := Array.append(collectionDetails, [(time, collectionCanisterId, "Unknown Collection", "Unknown Symbol", "Unknown Metadata")]);
        };
      };
      result := Array.append(result, [(userPrincipal, collectionDetails)]);
    };

    return result;
  };

  //getTotalCollection
  public shared ({ caller = _user }) func totalcollections() : async Nat {
    var count : Nat = 0;
    for ((k, v) in usersCollectionMap.entries()) {
      count := count + v.size();
    };
    return count;
  };

  //getting all the nfts ever minted in any collection (admin side)
  public shared ({ caller = _user }) func getAllCollectionNFTs(
    _collectionCanisterId : Principal,
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ data : [(TokenIndex, AccountIdentifier, Types.Metadata, ?Nat64)]; current_page : Nat; total_pages : Nat }, Text> {
    //  if (Principal.isAnonymous(user)) {
    //     throw Error.reject("User is not authenticated");
    // };
    // let canisterId = Principal.fromActor(Main);
    // // Check if the caller is one of the controllers
    // let controllerResult = await isController(canisterId,user);

    // if (controllerResult == false) {
    // throw Error.reject("Unauthorized: Only admins can view collection nfts");
    // };

    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Types.Metadata, ?Nat64)];
    };

    let nfts = await collectionCanisterActor.getAllNonFungibleTokenData();

    let paginatedNFTs = Pagin.paginate<(TokenIndex, AccountIdentifier, Types.Metadata, ?Nat64)>(nfts, chunkSize);

    let nftPage = if (pageNo < paginatedNFTs.size()) {
      paginatedNFTs[pageNo];
    } else { [] };

    return #ok({
      data = nftPage;
      current_page = pageNo + 1;
      total_pages = paginatedNFTs.size();
    });
  };

  //trying to return count as well as fetch tail of each grouped nft
  public shared ({ caller = _user }) func getFilteredCollectionNFTs(
    _collectionCanisterId : Principal,
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ data : [(TokenIndex, AccountIdentifier, Types.Metadata, ?Nat64, Nat)]; current_page : Nat; total_pages : Nat }, Text> {
    // if (Principal.isAnonymous(user)) {
    //     throw Error.reject("User is not authenticated");
    // };

    // let canisterId = Principal.fromActor(Main);

    // // Check if the caller is one of the controllers
    // let controllerResult = await isController(canisterId, user);

    // if (controllerResult == false) {
    //     throw Error.reject("Unauthorized: Only admins can view collection NFTs");
    // };

    // Define the canister actor interface
    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      try2getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Types.Metadata, ?Nat64, Nat)];
    };

    let nfts = await collectionCanisterActor.try2getAllNonFungibleTokenData();

    let paginatedNFTs = Pagin.paginate<(TokenIndex, AccountIdentifier, Types.Metadata, ?Nat64, Nat)>(nfts, chunkSize);

    let nftPage = if (pageNo < paginatedNFTs.size()) {
      paginatedNFTs[pageNo];
    } else { [] };

    return #ok({
      data = nftPage;
      current_page = pageNo + 1;
      total_pages = paginatedNFTs.size();
    });
  };

  //GET SINGLE COLLECTION DETAILS
  // Function to get all NFT details within a specific collection and the count of total NFTs
  public shared func getSingleCollectionDetails(
    collectionCanisterId : Principal
  ) : async ([(TokenIndex, AccountIdentifier, Types.Metadata)], Nat) {
    let collectionCanisterActor = actor (Principal.toText(collectionCanisterId)) : actor {
      getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Types.Metadata)];
    };
    try {
      let nfts = await collectionCanisterActor.getAllNonFungibleTokenData();
      let nftCount = nfts.size();
      return (nfts, nftCount);
    } catch (_e) {

      Debug.print(Text.concat("Error fetching NFTs from canister: ", Principal.toText(collectionCanisterId)));
      return ([], 0);
    };
  };

  /* -------------------------------------------------------------------------- */
  /*                             NFT related methods                            */
  /* -------------------------------------------------------------------------- */

  public shared func addObject(objMetadata : NftTypeMetadata) : async Text {
    let costPerUnit = objMetadata.nft_type_cost;

    let existingObject = Array.find(
      _objects_Array,
      func(entry : (Nat, NftTypeMetadata)) : Bool {
        return entry.1.nfttype == objMetadata.nfttype and entry.1.nft_type_quantity == objMetadata.nft_type_quantity;
      },
    );

    switch (existingObject) {
      case (?_) {
        return "Error: Object with name '" # objMetadata.nfttype # "' and value " # Nat.toText(objMetadata.nft_type_quantity) # " already exists.";
      };
      case null {
        let newId = _objectIdCounter;
        _objectIdCounter += 1;

        let updatedMetadata : NftTypeMetadata = {
          nfttype = objMetadata.nfttype;
          nft_type_quantity = objMetadata.nft_type_quantity;
          nft_type_cost = costPerUnit;
        };
        _objects_Array := Array.append(_objects_Array, [(newId, updatedMetadata)]);
        return "Object added successfully with ID: " # Nat.toText(newId) # " and Name: " # objMetadata.nfttype # " with cost : " # Nat64.toText(costPerUnit);
      };
    };
  };

  public shared func removeObject(id : Nat) : async Text {
    let existingObject = Array.find(
      _objects_Array,
      func(entry : (Nat, NftTypeMetadata)) : Bool {
        return entry.0 == id;
      },
    );
    switch (existingObject) {
      case (?_) {

        _objects_Array := Array.filter(
          _objects_Array,
          func(entry : (Nat, NftTypeMetadata)) : Bool {
            return entry.0 != id;
          },
        );
        return "Object with ID: " # Nat.toText(id) # " has been successfully removed.";
      };
      case null {
        return "Error: Object with ID: " # Nat.toText(id) # " does not exist.";
      };
    };
  };

  public shared func getObjects() : async [(Nat, NftTypeMetadata)] {
    return _objects_Array;
  };

  public shared func getObjectsAsPairs() : async {
    nfttype : [Text];
    nft_type_quantity : [Nat];
  } {
    let nftTypes = Array.map<(Nat, NftTypeMetadata), Text>(
      _objects_Array,
      func(entry : (Nat, NftTypeMetadata)) : Text {
        return entry.1.nfttype;
      },
    );

    let nftQuantities = Array.map<(Nat, NftTypeMetadata), Nat>(
      _objects_Array,
      func(entry : (Nat, NftTypeMetadata)) : Nat {
        return entry.1.nft_type_quantity;
      },
    );

    return { nfttype = nftTypes; nft_type_quantity = nftQuantities };
  };

  public shared func findCost(nfttype : Text, nftamount : Nat) : async ?Nat64 {
    let foundObject = Array.find(
      _objects_Array,
      func(entry : (Nat, NftTypeMetadata)) : Bool {
        return entry.1.nfttype == nfttype and entry.1.nft_type_quantity == nftamount;
      },
    );

    switch (foundObject) {
      case (?entry) { return ?entry.1.nft_type_cost };
      case null { return null };
    };
  };

  // function to mannually get Tokenidentifier
  public shared ({ caller = _user }) func getNftTokenId(
    _collectionCanisterId : Principal,
    _tokenId : TokenIndex,

  ) : async TokenIdentifier {
    let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, _tokenId);
    return tokenIdentifier;
  };

  // Minting NFTs
  public shared ({ caller = user }) func mintExtNonFungible(
    _collectionCanisterId : Principal,
    name : Text,
    desc : Text,
    asset : Text,
    thumb : Text,
    metadata : ?MetadataContainer,
    amount : Nat

  ) : async [(TokenIndex, TokenIdentifier)] {
    // if (Principal.isAnonymous(user)) {
    //     throw Error.reject("User is not authenticated");
    // };
    // let canisterId = Principal.fromActor(Main);
    // // Check if the caller is one of the controllers
    // let controllerResult = await isController(canisterId,user);

    // if (controllerResult == false) {
    // throw Error.reject("Unauthorized: Only admins can mint nft.");
    // };

    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_mint : (
        request : [(AccountIdentifier, Types.Metadata)]
      ) -> async [TokenIndex];
    };
    let metadataNonFungible : Types.Metadata = #nonfungible {
      name = name;
      description = desc;
      asset = asset;
      thumbnail = thumb;
      metadata = metadata;
    };

    let receiver = AID.fromPrincipal(user, null);
    var request : [(AccountIdentifier, Types.Metadata)] = [];
    var i : Nat = 0;
    while (i < amount) {
      request := Array.append(request, [(receiver, metadataNonFungible)]);
      i := i + 1;
    };
    let extMint = await collectionCanisterActor.ext_mint(request);
    var result_list = List.nil<(TokenIndex, TokenIdentifier)>();
    for (i in extMint.vals()) {
      let _tokenIdentifier = await getNftTokenId(_collectionCanisterId, i);
      result_list := List.push((i, _tokenIdentifier), result_list);
    };
    List.toArray(result_list);
  };

  public shared ({ caller = user }) func mintExtNonFungible3(
    _collectionCanisterId : Principal,
    name : Text,
    desc : Text,
    asset : Text,
    thumb : Text,
    metadata : ?MetadataContainer,
    amount : Nat,
    price : ?Nat64,
  ) : async [(TokenIndex, TokenIdentifier, Result.Result<(), CommonError>)] {
    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_mint : (
        request : [(AccountIdentifier, Types.Metadata)]
      ) -> async [TokenIndex];
    };
    let metadataNonFungible : Types.Metadata = #nonfungible {
      name = name;
      description = desc;
      asset = asset;
      thumbnail = thumb;
      metadata = metadata;
    };

    let receiver = AID.fromPrincipal(user, null);

    var request : [(AccountIdentifier, Types.Metadata)] = [];
    var i : Nat = 0;
    while (i < amount) {
      request := Array.append(request, [(receiver, metadataNonFungible)]);
      i := i + 1;
    };

    let extMint = await collectionCanisterActor.ext_mint(request);

    if (Array.size(extMint) != amount) {
      Debug.trap("Error: Not all tokens were minted successfully.");
    };

    let marketplaceActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceList : (caller : Principal, request : ListRequest) -> async Result.Result<(), CommonError>;
    };

    var results : [(TokenIndex, TokenIdentifier, Result.Result<(), CommonError>)] = [];

    for (index in extMint.vals()) {

      let _tokenIdentifier = await getNftTokenId(_collectionCanisterId, index);
      let listRequest : ListRequest = {
        token = _tokenIdentifier;
        price = price;
        from_subaccount = null;
      };

      let listPriceResult = await marketplaceActor.ext_marketplaceList(user, listRequest);

      results := Array.append(results, [(index, _tokenIdentifier, listPriceResult)]);
    };
    return results;
  };

  // Minting Fungible Tokens
  public shared ({ caller = user }) func mintExtFungible(
    _collectionCanisterId : Principal,
    name : Text,
    symbol : Text,
    decimals : Nat8,
    metadata : ?MetadataContainer,
    amount : Nat

  ) : async [TokenIndex] {

    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_mint : (
        request : [(AccountIdentifier, Types.Metadata)]
      ) -> async [TokenIndex];
    };
    let metadataFungible : Types.Metadata = #fungible {
      name = name;
      symbol = symbol;
      decimals = decimals;
      metadata = metadata;
    };

    let receiver = AID.fromPrincipal(user, null);
    var request : [(AccountIdentifier, Types.Metadata)] = [];
    var i : Nat = 0;
    while (i < amount) {
      request := Array.append(request, [(receiver, metadataFungible)]);
      i := i + 1;
    };
    let extMint = await collectionCanisterActor.ext_mint(request);
    extMint;
  };

  // Get Fungible token details for specific collection
  public shared func getFungibleTokens(
    _collectionCanisterId : Principal
  ) : async [(TokenIndex, AccountIdentifier, Types.Metadata)] {
    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      getAllFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Types.Metadata)];
    };
    await collectionCanisterActor.getAllFungibleTokenData();
  };

  // Get NFT details for specific collection
  public shared func getNonFungibleTokens(
    _collectionCanisterId : Principal
  ) : async [(TokenIndex, AccountIdentifier, Types.Metadata)] {
    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Types.Metadata)];
    };
    await collectionCanisterActor.getAllNonFungibleTokenData();
  };

  //fetch details of a particular NFT
  public shared func getSingleNonFungibleTokens(
    _collectionCanisterId : Principal,
    _tokenId : TokenIndex,
    user : AccountIdentifier,
  ) : async [(TokenIndex, TokenIdentifier, AccountIdentifier, Metadata, ?Nat64, Bool)] {

    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      getSingleNonFungibleTokenData : (TokenIndex) -> async [(TokenIndex, AccountIdentifier, Metadata, ?Nat64)];
    };

    let tokenData = await collectionCanisterActor.getSingleNonFungibleTokenData(_tokenId);

    var isOwned : Bool = false;

    if (tokenData.size() > 0) {
      let (tokenIndex, nftOwner, metadata, price) = tokenData[0];
      isOwned := (nftOwner == user);

      let _tokenIdentifier = await getNftTokenId(_collectionCanisterId, tokenIndex);

      return [(tokenIndex, _tokenIdentifier, nftOwner, metadata, price, isOwned)];
    } else {
      return [];
    };
  };

  // Gets all details about the tokens that were transfered into this vault
  public shared query func getDeposits() : async [Deposit] {
    return deposits;
  };

  //fetch total number of nfts accross all collections
  public shared func getTotalNFTs() : async Nat {
    var totalNFTs : Nat = 0;
    for ((_, collections) in usersCollectionMap.entries()) {
      for ((_, collectionCanisterId) in collections.vals()) {
        let collectionCanisterActor = actor (Principal.toText(collectionCanisterId)) : actor {
          getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Types.Metadata)];
        };
        try {
          let nfts = await collectionCanisterActor.getAllNonFungibleTokenData();
          totalNFTs += nfts.size();
        } catch (_e) {
          Debug.print(Text.concat("Error fetching NFTs from canister: ", Principal.toText(collectionCanisterId)));
        };
      };
    };
    return totalNFTs;
  };

  public shared func getAllNFTNames() : async [Text] {
    var nftNames : [Text] = [];
    for ((_, collections) in usersCollectionMap.entries()) {
      for ((_, collectionCanisterId) in collections.vals()) {
        let collectionCanisterActor = actor (Principal.toText(collectionCanisterId)) : actor {
          getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Types.Metadata)];
        };

        try {
          let nfts = await collectionCanisterActor.getAllNonFungibleTokenData();
          for ((_, _, metadata) in nfts.vals()) {
            let nftName = switch (metadata) {
              case (#nonfungible { name }) name;
              case (_) "Unknown NFT";
            };
            nftNames := Array.append(nftNames, [nftName]);
          };
        } catch (_e) {

          Debug.print(Text.concat("Error fetching NFT names from canister: ", Principal.toText(collectionCanisterId)));
        };
      };
    };

    return nftNames;
  };

  public shared func getCollectionAndNFTNames() : async [(Text, [(Time.Time, Principal, [(Text, [Text])])])] {
    var result : [(Text, [(Time.Time, Principal, [(Text, [Text])])])] = [];

    for ((userPrincipal, collections) in usersCollectionMap.entries()) {
      var collectionNFTs : [(Time.Time, Principal, [(Text, [Text])])] = [];

      for ((time, collectionCanisterId) in collections.vals()) {
        try {
          let collectionCanisterActor = actor (Principal.toText(collectionCanisterId)) : actor {
            getCollectionDetails : () -> async (Text, Text, Text);
            getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Types.Metadata)];
          };

          let (collectionName, _, _) = await collectionCanisterActor.getCollectionDetails();

          var nftNames : [Text] = [];

          let nfts = await collectionCanisterActor.getAllNonFungibleTokenData();
          for ((_, _, metadata) in nfts.vals()) {
            let nftName = switch (metadata) {
              case (#nonfungible { name }) name;
              case (_) "Unknown NFT";
            };
            nftNames := Array.append<Text>(nftNames, [nftName]);
          };

          collectionNFTs := Array.append<(Time.Time, Principal, [(Text, [Text])])>(
            collectionNFTs,
            [(time, collectionCanisterId, [(collectionName, nftNames)])],
          );

        } catch (_e) {
          Debug.print("Error fetching data for canister: " # Principal.toText(collectionCanisterId));
          collectionNFTs := Array.append<(Time.Time, Principal, [(Text, [Text])])>(
            collectionNFTs,
            [(time, collectionCanisterId, [("Unknown Collection", [])])],
          );
        };
      };

      result := Array.append(result, [(Principal.toText(userPrincipal), collectionNFTs)]);
    };

    return result;
  };

  /* -------------------------------------------------------------------------- */
  /*                            User Related Methods                            */
  /* -------------------------------------------------------------------------- */

  //create user
  public shared ({ caller = user }) func create_user(accountIdentifier : Principal, uid : Text) : async Result.Result<(Nat, Time.Time), Text> {
    // if (Principal.isAnonymous(user)) {
    //   throw Error.reject("User is not authenticated");
    // };
    let existingUser = Array.find<User>(
      usersArray,
      func(u : User) : Bool {
        u.accountIdentifier == accountIdentifier;
      },
    );

    switch (existingUser) {
      case (?_) {

        return #err("User already exists.");
      };
      case (null) {

        let newUserId = userIdCounter + 1;
        userIdCounter := newUserId;

        let currentTime = Time.now();

        let newUser : User = {
          uid = uid;
          id = newUserId;
          accountIdentifier = accountIdentifier;
          createdAt = currentTime;

        };

        usersArray := Array.append(usersArray, [newUser]);

        Debug.print("New user created with ID: " # Nat.toText(newUserId));

        return #ok((newUserId, currentTime));
      };
    };
  };

  //enter user details
  public shared ({ caller = user }) func updateUserDetails(accountIdentifier : Principal, name : Text, email : Text, telegram : Text, profilePic : ?Text) : async Result.Result<Text, Text> {
    let existingUser = Array.find<User>(
      usersArray,
      func(u : User) : Bool {
        u.accountIdentifier == accountIdentifier;
      },
    );

    switch (existingUser) {
      case (null) {
        return #err("User not found. Please create a user before setting details.");
      };
      case (?_) {
        let userDetails : UserDetails = {
          name = name;
          email = email;
          telegram = telegram;
          profilepic = profilePic;
        };

        userDetailsMap.put(accountIdentifier, userDetails);

        return #ok("User details updated successfully.");
      };
    };
  };

  // Get user details (for admin and user side both)
  public shared query ({ caller = user }) func getUserDetails(accountIdentifier : Principal) : async Result.Result<(Principal, Text, Nat, Text, Text, Text, ?Text), Text> {
    // if (Principal.isAnonymous(user)) {
    //   throw Error.reject("User is not authenticated");
    // };

    let existingUser = Array.find<User>(
      usersArray,
      func(u : User) : Bool {
        u.accountIdentifier == accountIdentifier;
      },
    );

    switch (existingUser) {
      case (null) {
        return #err("User not found.");
      };
      case (?foundUser) {
        let userDetails = userDetailsMap.get(accountIdentifier);

        switch (userDetails) {
          case (null) {
            return #ok((foundUser.accountIdentifier, foundUser.uid, foundUser.id, "No Name", "No Email", "No Telegram", null));
          };
          case (?details) {
            return #ok((foundUser.accountIdentifier, foundUser.uid, foundUser.id, details.name, details.email, details.telegram, details.profilepic));
          };
        };
      };
    };
  };

  //fetch list of all users
  public shared query ({ caller = user }) func getAllUsers(chunkSize : Nat, pageNo : Nat) : async Result.Result<{ data : [(Principal, Nat, Time.Time, Text, Text, ?Text)]; current_page : Nat; total_pages : Nat }, Text> {
    // if (Principal.isAnonymous(user)) {
    //   throw Error.reject("User is not authenticated");
    // };

    let allUsersDetails = Array.map<User, (Principal, Nat, Time.Time, Text, Text, ?Text)>(
      usersArray,
      func(u : User) : (Principal, Nat, Time.Time, Text, Text, ?Text) {
        let userDetails = userDetailsMap.get(u.accountIdentifier);

        let name = switch (userDetails) {
          case (null) "No Name";
          case (?details) details.name;
        };

        let email = switch (userDetails) {
          case (null) "No Email";
          case (?details) details.email;
        };

        let profilePic = switch (userDetails) {
          case (null) null;
          case (?details) details.profilepic;
        };

        return (u.accountIdentifier, u.id, u.createdAt, name, email, profilePic);
      },
    );

    let index_pages = Pagin.paginate<(Principal, Nat, Time.Time, Text, Text, ?Text)>(allUsersDetails, chunkSize);

    if (index_pages.size() < pageNo) {
      return #err("Page not found");
    };

    if (index_pages.size() == 0) {
      return #err("No users found");
    };

    let users_page = index_pages[pageNo];

    return #ok({
      data = users_page;
      current_page = pageNo + 1;
      total_pages = index_pages.size();
    });
  };

  // Function to get the total number of users
  public shared query ({ caller = _user }) func getTotalUsers() : async Nat {
    //  if (Principal.isAnonymous(user)) {
    //     throw Error.reject("User is not authenticated");
    // };
    return usersArray.size();
  };

  //nfts bought by (mycollection)
  public shared ({ caller = user }) func userNFTcollection(
    _collectionCanisterId : Principal,
    user : AccountIdentifier,
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ data : [(TokenIdentifier, TokenIndex, Metadata, Text, Principal, ?Nat64)]; current_page : Nat; total_pages : Nat }, CommonError> {

    let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      getAllNFTData : () -> async [(TokenIndex, AccountIdentifier, Metadata, ?Nat64)];
      getCollectionDetails : () -> async (Text, Text, Text);
    };

    let (collectionName, _, _) = await collectionCanisterActor.getCollectionDetails();
    let allNFTs = await collectionCanisterActor.getAllNFTData();

    var boughtNFTs : [(TokenIdentifier, TokenIndex, Metadata, Text, Principal, ?Nat64)] = [];

    for ((tokenIndex, nftOwner, metadata, price) in allNFTs.vals()) {
      if (nftOwner == user) {
        let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);
        boughtNFTs := Array.append(
          boughtNFTs,
          [(tokenIdentifier, tokenIndex, metadata, collectionName, _collectionCanisterId, price)],
        );
      };
    };

    let paginatedNFTs = Pagin.paginate<(TokenIdentifier, TokenIndex, Metadata, Text, Principal, ?Nat64)>(boughtNFTs, chunkSize);

    if (pageNo >= paginatedNFTs.size()) {
      return #err(#Other("Page not found"));
    };

    return #ok({
      data = paginatedNFTs[pageNo];
      current_page = pageNo + 1;
      total_pages = paginatedNFTs.size();
    });
  };

  //redeem token function (burn nft)
  public shared ({ caller = user }) func redeemtoken(_collectionCanisterId : Principal, tokenIdentifier : TokenIdentifier) : async Result.Result<Metadata, Text> {
    let tokenActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      burnToken : (TokenIdentifier) -> async Result.Result<(Metadata, Bool), Text>;
    };

    let burnResult = await tokenActor.burnToken(tokenIdentifier);
    switch (burnResult) {
      case (#ok((metadata, _isBurned))) {
        _redeemedTokens := Array.append(_redeemedTokens, [(user, tokenIdentifier)]);
        return #ok(metadata);
      };
      case (#err(errorMessage)) {
        return #err("Burn token failed: " # errorMessage);
      };
    };
  };

  public query func getallRedeemedTokens() : async [(Principal, TokenIdentifier)] {
    return _redeemedTokens;
  };

  public query func getRedeemedTokens(user : Principal) : async [(Principal, TokenIdentifier)] {
    let userRedeemedTokens = Array.filter<(Principal, TokenIdentifier)>(
      _redeemedTokens,
      func((princ, _)) {
        princ == user;
      },
    );
    return userRedeemedTokens;
  };

  // Function to add a token to the user's favorites
  func _addToFavorites(user : AccountIdentifier, tokenIdentifier : TokenIdentifier) : () {

    let userFavorites = switch (_favorites.get(user)) {
      case (?favorites) favorites;
      case (_) [];
    };

    let updatedFavorites = Array.append(userFavorites, [(tokenIdentifier)]);

    _favorites.put(user, updatedFavorites);
  };

  // ADD TO FAVORITES //
  public shared ({ caller = user }) func addToFavorites(
    user : AccountIdentifier,
    tokenIdentifier : TokenIdentifier,
  ) : async Result.Result<Text, CommonError> {
    if (Principal.isAnonymous(Principal.fromText(user))) {
      throw Error.reject("User is not authenticated");
    };

    let userFavorites = switch (_favorites.get(user)) {
      case (?favorites) favorites;
      case (_) [];
    };

    let isAlreadyFavorite = Array.find(
      userFavorites,
      func(entry : (TokenIdentifier)) : Bool {
        entry == tokenIdentifier;
      },
    ) != null;

    if (isAlreadyFavorite) {
      return #err(#Other("Token is already in favorites"));
    } else {

      let updatedFavorites = Array.append(userFavorites, [tokenIdentifier]);

      _favorites.put(user, updatedFavorites);
      return #ok("Token added to favorites successfully");
    };
  };

  //REMOVE FROM FAVORITES
  public shared ({ caller = user }) func removeFromFavorites(user : AccountIdentifier, tokenIdentifier : TokenIdentifier) : async Result.Result<Text, CommonError> {
    if (Principal.isAnonymous(Principal.fromText(user))) {
      throw Error.reject("User is not authenticated");
    };

    let userFavorites = switch (_favorites.get(user)) {
      case (?favorites) favorites;
      case (_) return #err(#Other("No favorites found for this user"));
    };

    let isFavorite = Array.find(
      userFavorites,
      func(entry : (TokenIdentifier)) : Bool {
        entry == tokenIdentifier;
      },
    ) != null;

    if (isFavorite == false) {
      return #err(#Other("Token is not in favorites"));
    };

    let updatedFavorites = Array.filter(
      userFavorites,
      func(entry : (TokenIdentifier)) : Bool {
        entry != tokenIdentifier;
      },
    );

    _favorites.put(user, updatedFavorites);
    return #ok("Token removed from favorites successfully");
  };

  // GET USER FAVORITES
  public shared query ({ caller = user }) func getFavorites(user : AccountIdentifier) : async Result.Result<[(TokenIdentifier)], CommonError> {
    if (Principal.isAnonymous(Principal.fromText(user))) {
      throw Error.reject("User is not authenticated");
    };

    switch (_favorites.get(user)) {
      case (?favorites) {
        return #ok(favorites);
      };
      case (_) {

        return #err(#Other("No favorites found for this user"));
      };
    };
  };

  //USER ACTIVITY
  public shared func useractivity(_collectionCanisterId : Principal, buyerId : AccountIdentifier) : async [(TokenIndex, TokenIdentifier, Transaction, Text)] {
    let transactionActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceTransactions : () -> async [Transaction];
    };

    let transactions = await transactionActor.ext_marketplaceTransactions();

    var transformedTransactions : [(TokenIndex, TokenIdentifier, Transaction, Text)] = [];

    for (transaction in transactions.vals()) {
      if (transaction.buyer == buyerId) {
        let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, transaction.token);

        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
          getCollectionDetails : () -> async (Text, Text, Text);
        };
        let (collectionName, _, _) = await collectionCanisterActor.getCollectionDetails();

        transformedTransactions := Array.append(
          transformedTransactions,
          [(transaction.token, tokenIdentifier, transaction, collectionName)],
        );
      };
    };
    return transformedTransactions;
  };

  public shared ({ caller = user }) func alluseractivity(buyerId : AccountIdentifier, chunkSize : Nat, pageNo : Nat) : async Result.Result<{ data : [(TokenIndex, TokenIdentifier, Transaction, Text)]; current_page : Nat; total_pages : Nat }, Text> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    var allUserActivities : [(TokenIndex, TokenIdentifier, Transaction, Text)] = [];

    let allCollections = await getAllCollections();

    for ((_, collections) in allCollections.vals()) {
      for ((_, collectionCanisterId, collectionName, _, _) in collections.vals()) {
        let transactionActor = actor (Principal.toText(collectionCanisterId)) : actor {
          ext_marketplaceTransactions : () -> async [Transaction];
        };

        try {
          let transactions = await transactionActor.ext_marketplaceTransactions();

          for (transaction in transactions.vals()) {
            if (transaction.buyer == buyerId) {
              let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(collectionCanisterId, transaction.token);

              allUserActivities := Array.append(
                allUserActivities,
                [(transaction.token, tokenIdentifier, transaction, collectionName)],
              );
            };
          };

        } catch (_e) {
          Debug.print(Text.concat("Error fetching transactions from canister: ", Principal.toText(collectionCanisterId)));
        };
      };
    };
    let index_pages = Pagin.paginate<(TokenIndex, TokenIdentifier, Transaction, Text)>(allUserActivities, chunkSize);

    if (index_pages.size() < pageNo) {
      return #err("Page not found");
    };

    if (index_pages.size() == 0) {
      return #err("No user activities found");
    };

    let userActivitiesPage = index_pages[pageNo];

    return #ok({
      data = userActivitiesPage;
      current_page = pageNo + 1;
      total_pages = index_pages.size();
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                                  MARKETPLACE                               */
  /* -------------------------------------------------------------------------- */

  //set price for the nfts
  public shared (msg) func listprice(_collectionCanisterId : Principal, request : ListRequest) : async Result.Result<(), CommonError> {
    // if (Principal.isAnonymous(msg.caller)) {
    //     throw Error.reject("User is not authenticated");
    // };
    // let canisterId = Principal.fromActor(Main);
    // // Check if the caller is one of the controllers
    // let controllerResult = await isController(canisterId,msg.caller);

    // if (controllerResult == false) {
    // throw Error.reject("Unauthorized: Only admins can list price");
    // };

    let priceactor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceList : (caller : Principal, request : ListRequest) -> async Result.Result<(), CommonError>;
    };
    return await priceactor.ext_marketplaceList(msg.caller, request);
  };

  //Get the NFT listings and their corresponding prices, now including TokenIndex and TokenIdentifier
  public shared func listings(_collectionCanisterId : Principal) : async [(TokenIndex, TokenIdentifier, Listing, Metadata)] {
    let priceListings = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceListings : () -> async [(TokenIndex, Listing, Metadata)];
    };

    let listingData = await priceListings.ext_marketplaceListings();

    let transformedListingData = Array.map<(TokenIndex, Listing, Metadata), (TokenIndex, TokenIdentifier, Listing, Metadata)>(
      listingData,
      func((tokenIndex, listing, metadata) : (TokenIndex, Listing, Metadata)) : (TokenIndex, TokenIdentifier, Listing, Metadata) {
        let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);
        return (tokenIndex, tokenIdentifier, listing, metadata);
      },
    );

    return transformedListingData;
  };

  public shared func plistings(
    _collectionCanisterId : Principal,
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ data : [(TokenIndex, TokenIdentifier, Listing, Metadata)]; current_page : Nat; total_pages : Nat }, Text> {
    let priceListings = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceListings : () -> async [(TokenIndex, Listing, Metadata)];
    };

    let listingData = await priceListings.ext_marketplaceListings();

    let transformedListingData = Array.map<(TokenIndex, Listing, Metadata), (TokenIndex, TokenIdentifier, Listing, Metadata)>(
      listingData,
      func((tokenIndex, listing, metadata) : (TokenIndex, Listing, Metadata)) : (TokenIndex, TokenIdentifier, Listing, Metadata) {
        let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);
        return (tokenIndex, tokenIdentifier, listing, metadata);
      },
    );

    let paginatedListings = Pagin.paginate<(TokenIndex, TokenIdentifier, Listing, Metadata)>(transformedListingData, chunkSize);

    if (paginatedListings.size() < pageNo) {
      return #err("Page not found");
    };

    if (paginatedListings.size() == 0) {
      return #err("No listings found");
    };

    let listingPage = paginatedListings[pageNo];

    return #ok({
      data = listingPage;
      current_page = pageNo + 1;
      total_pages = paginatedListings.size();
    });
  };

  //new listings with count as well
  public shared func countlistings(
    _collectionCanisterId : Principal,
    chunkSize : Nat,
    pageNo : Nat,
  ) : async Result.Result<{ data : [(TokenIndex, TokenIdentifier, Listing, Metadata, Nat)]; current_page : Nat; total_pages : Nat }, Text> {
    let priceListings = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceListings_2 : () -> async [(TokenIndex, Listing, Metadata, Nat)];
    };

    let listingData = await priceListings.ext_marketplaceListings_2();

    let transformedListingData = Array.map<(TokenIndex, Listing, Metadata, Nat), (TokenIndex, TokenIdentifier, Listing, Metadata, Nat)>(
      listingData,
      func((tokenIndex, listing, metadata, count) : (TokenIndex, Listing, Metadata, Nat)) : (TokenIndex, TokenIdentifier, Listing, Metadata, Nat) {
        let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);
        return (tokenIndex, tokenIdentifier, listing, metadata, count);
      },
    );

    let paginatedListings = Pagin.paginate<(TokenIndex, TokenIdentifier, Listing, Metadata, Nat)>(transformedListingData, chunkSize);

    if (paginatedListings.size() < pageNo) {
      return #err("Page not found");
    };

    if (paginatedListings.size() == 0) {
      return #err("No listings found");
    };

    let listingPage = paginatedListings[pageNo];

    return #ok({
      data = listingPage;
      current_page = pageNo + 1;
      total_pages = paginatedListings.size();
    });
  };

  //purchase nft
  public shared ({ caller = _user }) func purchaseNft(_collectionCanisterId : Principal, tokenid : TokenIdentifier, price : Nat64, buyer : AccountIdentifier) : async Result.Result<(AccountIdentifier, Nat64), CommonError> {
    // if (Principal.isAnonymous(user)) {
    //     throw Error.reject("User is not authenticated");
    // };
    let buynft = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplacePurchase : (tokenid : TokenIdentifier, price : Nat64, buyer : AccountIdentifier) -> async Result.Result<(AccountIdentifier, Nat64), CommonError>;
    };
    return await buynft.ext_marketplacePurchase(tokenid, price, buyer);
  };

  //settle and confirm purchase
  public shared ({ caller = user }) func settlepurchase(_collectionCanisterId : Principal, paymentaddress : AccountIdentifier) : async Result.Result<(), CommonError> {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    let confirmpurchase = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceSettle : (paymentaddress : AccountIdentifier) -> async Result.Result<(), CommonError>;
    };
    return await confirmpurchase.ext_marketplaceSettle(paymentaddress);
  };

  // Get the transaction details
  public shared func transactions(_collectionCanisterId : Principal) : async [(TokenIndex, TokenIdentifier, Transaction)] {
    let transactionActor = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceTransactions : () -> async [Transaction];
    };

    let transactions = await transactionActor.ext_marketplaceTransactions();

    let transformedTransactions = Array.map<Transaction, (TokenIndex, TokenIdentifier, Transaction)>(
      transactions,
      func(transaction : Transaction) : (TokenIndex, TokenIdentifier, Transaction) {
        let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, transaction.token);
        return (transaction.token, tokenIdentifier, transaction);
      },
    );

    return transformedTransactions;
  };

  // Get all transactions for admin side 
  public shared (msg) func alltransactions(chunkSize : Nat, pageNo : Nat) : async Result.Result<{ data : [(TokenIndex, TokenIdentifier, Transaction)]; current_page : Nat; total_pages : Nat }, Text> {
    if (Principal.isAnonymous(msg.caller)) {
      throw Error.reject("User is not authenticated");
    };
    let canisterId = Principal.fromActor(Main);
    let controllerResult = await isController(canisterId, msg.caller);

    if (controllerResult == false) {
      throw Error.reject("Unauthorized: Only admins can list price");
    };
    var allTransactions : [(TokenIndex, TokenIdentifier, Transaction)] = [];

    let allCollections = await getAllCollections();

    for ((_, collections) in allCollections.vals()) {
      for ((_, collectionCanisterId, _, _, _) in collections.vals()) {
        let transactionActor = actor (Principal.toText(collectionCanisterId)) : actor {
          ext_marketplaceTransactions : () -> async [Transaction];
        };

        try {
          let transactions = await transactionActor.ext_marketplaceTransactions();

          let transformedTransactions = Array.map<Transaction, (TokenIndex, TokenIdentifier, Transaction)>(
            transactions,
            func(transaction : Transaction) : (TokenIndex, TokenIdentifier, Transaction) {
              let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(collectionCanisterId, transaction.token);
              return (transaction.token, tokenIdentifier, transaction);
            },
          );

          allTransactions := Array.append(allTransactions, transformedTransactions);

        } catch (_e) {
          Debug.print(Text.concat("Error fetching transactions from canister: ", Principal.toText(collectionCanisterId)));
        };
      };
    };
    let index_pages = Pagin.paginate<(TokenIndex, TokenIdentifier, Transaction)>(allTransactions, chunkSize);

    if (index_pages.size() < pageNo) {
      return #err("Page not found");
    };

    if (index_pages.size() == 0) {
      return #err("No transactions found");
    };

    let transactionsPage = index_pages[pageNo];

    return #ok({
      data = transactionsPage;
      current_page = pageNo + 1;
      total_pages = index_pages.size();
    });
  };

  //get marketplace stats
  public shared func marketstats(_collectionCanisterId : Principal) : async (Nat64, Nat64, Nat64, Nat64, Nat, Nat, Nat) {
    let getstats = actor (Principal.toText(_collectionCanisterId)) : actor {
      ext_marketplaceStats : () -> async (Nat64, Nat64, Nat64, Nat64, Nat, Nat, Nat);
    };

    return await getstats.ext_marketplaceStats();
  };

  public shared (msg) func transfer_balance(
    _collectionCanisterId : Principal,
    paymentAddress : AccountIdentifier,
    amount_e8s : Nat64,
    subaccount : ?SubAccount,
  ) : async Result.Result<Nat64, CommonError> {
    if (Principal.isAnonymous(msg.caller)) {
      throw Error.reject("User is not authenticated");
    };
    Debug.print("Available cycles: " # Nat.toText(Cycles.balance()));

    try {
      // Prepare the arguments for the ICP ledger transfer
      let send_args = {
        memo = 0 : Nat64;
        amount = { e8s = amount_e8s };
        fee = { e8s = 10000 : Nat64 };
        from_subaccount = subaccount;
        to = paymentAddress;
        created_at_time = null : ?Time;
      };

      Debug.print("Sending args: ");

      let block_height = await ExternalService_ICPLedger.send_dfx(send_args);

      Debug.print("Transfer successful, block height: " # debug_show (block_height));
      return #ok(block_height);

    } catch (err) {
      Debug.print("Transfer failed with error.");
      let errorMessage = "Transfer Failed: " # Error.message(err);
      return #err(#Other(errorMessage));
    };
  };

  public shared ({ caller = user }) func balance_settelment(_collectionCanisterId : Principal) : async () {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    let getResult = actor (Principal.toText(_collectionCanisterId)) : actor {
      heartbeat_disbursements : () -> async ();
    };
    return await getResult.heartbeat_disbursements();
  };

  public shared ({ caller = user }) func balance_nft_settelment(_collectionCanisterId : Principal) : async () {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };
    let getResult = actor (Principal.toText(_collectionCanisterId)) : actor {
      heartbeat_myself : () -> async ();
    };
    return await getResult.heartbeat_myself();
  };

  public shared ({ caller = user }) func all_settelment(_collectionCanisterId : Principal) : async () {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("User is not authenticated");
    };

    let getResult = actor (Principal.toText(_collectionCanisterId)) : actor {
      heartbeat_external : () -> async ();
    };
    return await getResult.heartbeat_external();
  };

  public shared (_msg) func send_balance_and_nft(
    _collectionCanisterId : Principal,
    paymentAddress : AccountIdentifier,
    amount_e8s : Nat64,
    subaccount : ?SubAccount,
  ) : async Result.Result<Nat64, CommonError> {
    // if (Principal.isAnonymous(msg.caller)) {
    //     throw Error.reject("User is not authenticated");
    // };
    Debug.print("Available cycles: " # Nat.toText(Cycles.balance()));

    try {
      let send_args = {
        memo = 0 : Nat64;
        amount = { e8s = amount_e8s };
        fee = { e8s = 10000 : Nat64 };
        from_subaccount = subaccount;
        to = paymentAddress;
        created_at_time = null : ?Time;
      };

      Debug.print("Sending args: " # debug_show (send_args));

      let block_height : Nat64 = await ExternalService_ICPLedger.send_dfx(send_args);
      Debug.print("Transfer successful, block height: " # Nat64.toText(block_height));

      let marketplaceActor = actor (Principal.toText(_collectionCanisterId)) : actor {
        ext_marketplaceSettle : (paymentAddress : AccountIdentifier) -> async Result.Result<(), CommonError>;
      };

      switch (await marketplaceActor.ext_marketplaceSettle(paymentAddress)) {
        case (#ok _) {
          Debug.print("NFT settle successful.");
          return #ok(block_height);
        };
        case (#err _e) {
          return #err(#Other("NFT settle failed:"));
        };
      };

    } catch (err) {
      Debug.print("Unexpected error occurred during transfer and NFT settle.");
      let errorMessage = "Unexpected Transfer Failed: " # Error.message(err);
      return #err(#Other(errorMessage));
    };
  };

};
