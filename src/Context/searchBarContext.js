import React, { createContext, useContext, useState } from 'react';


const SearchContext = createContext();


export const SearchBarProvider = ({ children }) => {
    const [category, setCategory] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [searchedData, setSearchedData] = useState([]);

    return (
        <SearchContext.Provider
            value={{
                category,
                setCategory,
                selectedDate,
                setSelectedDate,
                selectedTime,
                setSelectedTime,
                selectedLocation,
                setSelectedLocation,
                selectedService,
                setSelectedService,
                searchedData,
                 setSearchedData
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearchContext must be used within a SearchBarProvider');
    }
    return context;
};
