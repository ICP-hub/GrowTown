export const SearchResults = ({ results, isVisible, onClose }) => {
  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleItemClick = (item) => {
    if (item.principalId) { // For collections
      navigate(`/admin/collection/collectionDetails/${item.id}`, {
        state: { collectiondata: [item.id, item.principalId, item.name, null, JSON.stringify(item.metadata)] }
      });
    } else if (item.tokenIndex) { // For NFTs
      navigate(`/admin/collection/collectionDetails/${item.collectionId}/nft/${item.tokenIndex}`, {
        state: { 
          list: [item.tokenIndex, item.userId, item.nonfungible],
          collectiondata: [null, item.collectionId, item.collectionName]
        }
      });
    }
    onClose();
  };

  const renderItem = (item) => {
    // Collection Item
    if (item.principalId) {
      return (
        <div className="flex items-center p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
          <img
            src={item.image || '/default-collection.png'}
            alt={item.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div className="ml-3">
            <h3 className="text-white font-medium">{item.name} Collection</h3>
            <p className="text-gray-400 text-sm">by {item.principalId.toString()}</p>
          </div>
        </div>
      );
    }

    // NFT Item
    if (item.tokenIndex) {
      const metadata = item.nonfungible.metadata?.[0]?.json ? 
        JSON.parse(item.nonfungible.metadata[0].json) : {};
      
      return (
        <div className="flex items-center p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
          <img
            src={metadata.imageurl1 || '/default-nft.png'}
            alt={item.nonfungible.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div className="ml-3">
            <h3 className="text-white font-medium">{item.nonfungible.name}</h3>
            <p className="text-gray-400 text-sm">
              {item.collectionName} • {metadata.nftType || 'Unknown Type'}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  // ...rest of component code...
};
