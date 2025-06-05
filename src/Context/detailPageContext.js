
import React, { createContext, useContext, useState } from 'react'

const MatchingSearchResultContext = createContext();

export const MatchingSearchResultProvider = ({ children }) => {
    const [isMatchingResult, setIsMatchingResult] = useState(false);

    return (
        <MatchingSearchResultContext.Provider value={{ isMatchingResult, setIsMatchingResult }}>
            {children}
        </MatchingSearchResultContext.Provider>
    );
};
export const useMatchingSearchResult = () => useContext(MatchingSearchResultContext);
