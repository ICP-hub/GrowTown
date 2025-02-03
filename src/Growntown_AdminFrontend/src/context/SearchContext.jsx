import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    collections: true,
    nfts: true,
    users: true,
  });
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase().trim());
  };

  const handleFilterChange = (filterName, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const isMatch = (item) => {
    if (!searchQuery) return true;
    
    try {
      // Advanced search implementation
      const query = searchQuery.toLowerCase();
      const searchTerms = query.split(' ').filter(term => term.length > 0);

      // For Collections
      if (item.collectionName && searchFilters.collections) {
        const collectionName = item.collectionName.toLowerCase();
        if (searchTerms.some(term => collectionName.includes(term))) return true;
      }

      // For NFTs
      if (item[2]?.nonfungible && searchFilters.nfts) {
        const nft = item[2].nonfungible;
        
        // Check multiple NFT fields
        const searchableFields = [
          nft.name,
          nft.collectionName
        ].map(field => field?.toLowerCase() || '');

        // Check metadata
        if (nft.metadata?.[0]?.json) {
          const metadata = JSON.parse(nft.metadata[0].json);
          searchableFields.push(
            metadata.nftType?.toLowerCase() || '',
            metadata.newtype?.toLowerCase() || '',
            metadata.artistname?.toLowerCase() || '',
            metadata.attributes?.map(attr => 
              `${attr.trait_type?.toLowerCase()} ${attr.value?.toLowerCase()}`
            ).join(' ') || ''
          );
        }

        // Check if any search term matches any field
        return searchTerms.some(term =>
          searchableFields.some(field => field.includes(term))
        );
      }

      // For Users
      if (item.userId && searchFilters.users) {
        const userFields = [
          item.userId,
          item.username,
          item.email
        ].map(field => field?.toLowerCase() || '');

        return searchTerms.some(term =>
          userFields.some(field => field.includes(term))
        );
      }

      return false;
    } catch (error) {
      console.error('Error in search matching:', error);
      return false;
    }
  };

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      handleSearch, 
      isMatch,
      searchFilters,
      handleFilterChange,
      searchResults,
      setSearchResults
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
