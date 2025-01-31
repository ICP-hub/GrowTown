import React from 'react';
import { useNavigate } from 'react-router-dom';

// Change to named export
export const SearchResults = ({ results, isVisible, onClose }) => {
  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleItemClick = (item) => {
    if (item.collectionId) { // For collections
      navigate(`/admin/collection/collectionDetails/${item.collectionId}`);
    } else if (item.tokenId) { // For NFTs
      navigate(`/admin/collection/collectionDetails/${item.collectionId}/nft/${item.tokenId}`);
    }
    onClose();
  };

  const renderItem = (item) => {
    // Collection Item
    if (item.collectionId) {
      return (
        <div className="flex items-center p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
          <img
            src={item.image || '/default-collection.png'}
            alt={item.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div className="ml-3">
            <h3 className="text-white font-medium">{item.name}</h3>
            <p className="text-gray-400 text-sm">Collection</p>
          </div>
        </div>
      );
    }

    // NFT Item
    if (item.tokenId) {
      const metadata = item.metadata?.[0]?.json ? JSON.parse(item.metadata[0].json) : {};
      return (
        <div className="flex items-center p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
          <img
            src={metadata.imageurl1 || '/default-nft.png'}
            alt={item.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div className="ml-3">
            <h3 className="text-white font-medium">{item.name}</h3>
            <p className="text-gray-400 text-sm">
              NFT • {metadata.nftType || 'Unknown Type'}
            </p>
          </div>
        </div>
      );
    }

    // User Item
    if (item.userId) {
      return (
        <div className="flex items-center p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-white text-lg">{item.username?.[0]?.toUpperCase()}</span>
          </div>
          <div className="ml-3">
            <h3 className="text-white font-medium">{item.username}</h3>
            <p className="text-gray-400 text-sm">User</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="absolute top-full mt-2 w-full bg-[#2b2b2b] rounded-lg shadow-xl border border-gray-700 max-h-[70vh] overflow-y-auto">
      {results.length > 0 ? (
        <div className="p-2">
          {results.map((item, index) => (
            <div key={index} onClick={() => handleItemClick(item)}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-400">
          No results found
        </div>
      )}
    </div>
  );
};
