import { Principal } from '@dfinity/principal';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ collections, nfts, users, onClose }) => {
  const navigate = useNavigate();
  console.log("Search collections :", collections);
  console.log("Search nfts :", nfts && nfts);
  console.log("Search users :", users && users);



  const handleItemClick = (collection) => {
    console.log("Clicking collection:", collection);

    // Navigate to collection details
    navigate(`/Admin/collection/collectionDetails/${collection.id}`, {
      state: {
        collectiondata: collection.collectionData,
        resetNFTs: true  // Add flag to reset NFTs
      },
      replace: true  // Use replace to avoid history stacking
    });
    onClose();
  };

  const handleNftClick = (nft, collectiondata) => {
    const principal = collectiondata && collectiondata?.[1];
    const id = principal && Principal.fromUint8Array(
      principal._arr
    ).toText();

    if (!nft && !collectiondata && !id)
      return;
    console.log("Clicking NFT:", { nft, collectiondata });

    // Navigate to NFT details with complete collection context
    navigate(`/Admin/collection/collectionDetails/${id}/nft/${id}`, {
      state: {
        list: nft,
        collectiondata: collectiondata,
      }
    })

    onClose();
  };


  const handleUserClick = (user) => {

    const userPrincipalArray = user[0];
    const principal = userPrincipalArray
      ? Principal.fromUint8Array(userPrincipalArray._arr).toText()
      : null;

    if (!user && !principal)
      return;
    console.log("Clicking User:", user);

    // Navigate to NFT details with complete collection context
    navigate(`/Admin/users/${principal}`, {state:{ user }})

    onClose();
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl max-h-[400px] overflow-y-auto">
      {collections && collections.map((collection, index) => (
        <div key={index}>
          {/* Collection item */}
          <div
            className="p-4 hover:bg-[#2b2b2b] cursor-pointer border-b border-gray-700"
            onClick={() => handleItemClick(collection)}
          >
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-white font-medium">{collection.name}</h3>
                <p className="text-gray-400 text-sm">Collection</p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* NFTs */}
      {(nfts && nfts?.NFTList.length > 0) && nfts?.NFTList[0].map((nft, index) => (
        <div key={index}>

          <div
            className="p-4 hover:bg-[#2b2b2b] cursor-pointer border-b border-gray-700"
            onClick={() => handleNftClick(nft, nfts?.collectiondata)}
          >
            <div className="flex items-center gap-3">
              <div>
                {console.log('nft-->', nft[2])}
                <h3 className="text-white font-medium">{nft[2]?.nonfungible?.name}</h3>
                <p className="text-gray-400 text-sm">NFT</p>
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Users */}
      {(users && users?.length > 0) && users?.map((user, index) => (
        <div key={index}>

          <div
            className="p-4 hover:bg-[#2b2b2b] cursor-pointer border-b border-gray-700"
          onClick={() => handleUserClick(user)}
          >
            <div className="flex items-center gap-3">
              <div>
                {/* {console.log('nft-->',nft[2])} */}
                <h3 className="text-white font-medium">{user[3]}</h3>
                <p className="text-gray-400 text-sm">User</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
