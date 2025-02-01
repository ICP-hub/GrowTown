import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ results, onClose }) => {
  const navigate = useNavigate();
  console.log("Search Results Component:", results);

  if (!results || results.length === 0) return null;

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

  const handleNftClick = (collection, nft) => {
    console.log("Clicking NFT:", { collection, nft });
    
    // Navigate to NFT details with complete collection context
    navigate(`/Admin/collection/collectionDetails/${collection.id}/nft/${nft.id}`, {
      state: { 
        collectiondata: collection.collectionData,
        nftData: {
          id: nft.id,
          name: nft.name,
          metadata: nft.metadata
        },
        resetNFTs: true
      },
      replace: true
    });
    onClose();
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl max-h-[400px] overflow-y-auto">
      {results.map((collection, index) => (
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

          {/* NFTs */}
          {collection.nfts?.map((nft, nftIndex) => (
            <div
              key={`${index}-${nftIndex}`}
              className="p-4 pl-8 hover:bg-[#2b2b2b] cursor-pointer border-b border-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                handleNftClick(collection, nft);
              }}
            >
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-white font-medium">{nft.name}</h3>
                  <p className="text-gray-400 text-sm">NFT in {collection.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
