import React, { useState,useEffect } from 'react';
import { Container } from '@mui/material';
import Navigation from './Navigation'
import CardList from './Card'
import MapComponent from './Map';
import { useLocation, useNavigate } from 'react-router-dom';
import RecommendedSection from './OtherServices';

const Overview = () => {
    const [data, setData] = useState(null); 
    const previousData = useLocation();
    const [showMap,setShowMap]=useState(false);
    const [isLoading,setIsLoading]=useState(false);


    const IndexFilterData = previousData?.state?.data;
    const searchBarData=previousData?.state?.search


    const handleDataChange = (newData) => {
        setData(newData);
    };


    useEffect(() => {
        if (IndexFilterData) {
            setData(IndexFilterData);
        }
    }, [IndexFilterData]);

    return (
        <>
            
            <Navigation setShowMap={setShowMap} setIsLoading={setIsLoading} showMap={showMap} onDataChange={handleDataChange} searchData={searchBarData} /> 
           {showMap && <Container maxWidth="lg">
                <MapComponent />
            </Container>}
            
            <Container maxWidth="lg">
                <CardList data={data}  isLoading={isLoading}/> 
            </Container>

            <RecommendedSection/>
        </>
    );
};

export default Overview;
