import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import Navigation from './Navigation'
import CardList from './Card'
import MapComponent from './Map';
import { useLocation, useNavigate } from 'react-router-dom';
import RecommendedSection from './OtherServices';
import { apiget } from '../service/api';
import { constant } from '../../constant';

const Overview = () => {
    const [data, setData] = useState(null);
    const previousData = useLocation();
    const [showMap, setShowMap] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [buisnessType, setBuisnessType] = useState('');
    const [popularServices, setPopularServices] = useState([]);
    const [userLocation, setUserLocation] = useState({
        latitude: 28.466296,
        longitude: 77.011864
    });

    const IndexFilterData = previousData?.state?.data;
    const searchBarData = previousData?.state?.search

    // Get user location from localStorage or default coordinates
    useEffect(() => {
        const storedLat = localStorage.getItem('latitude');
        const storedLng = localStorage.getItem('longitude');
        
        if (storedLat && storedLng) {
            setUserLocation({
                latitude: parseFloat(storedLat),
                longitude: parseFloat(storedLng)
            });
        }
    }, []);

    const handleDataChange = (newData) => {
        setData(newData);
    };

    const fetchPopularServices = async () => {
        try {
            const result = await apiget(`${constant.baseUrl}/api/v1/Service/popularServiceAndBusinesses/?SearchFor=Service&Category=Beauty&latitude=78.9897978&longitude=28.6767965&page=1`);
            if (result && result.data?.Status === 200) {
                setPopularServices(result?.data?.Data)
            }
        } catch (err) {
            // Handle error silently or with proper error handling
        }
    }

    useEffect(() => {
        fetchPopularServices()
    }, [])

   

    useEffect(() => {
        if (IndexFilterData) {
            setData(IndexFilterData);
        }
    }, [IndexFilterData]);

    return (
        <>

            <Navigation setShowMap={setShowMap} setIsLoading={setIsLoading} showMap={showMap} setBuisnessType={setBuisnessType} onDataChange={handleDataChange} searchData={searchBarData} />
            {showMap && <Container maxWidth="lg">
                <MapComponent 
                    latitude={userLocation.latitude}
                    longitude={userLocation.longitude}
                    businessName={searchBarData?.location || "Search Results"}
                    region={searchBarData?.category || buisnessType || ""}
                    streetAddress={searchBarData?.location || ""}
                    showBusinessInfo={true}
                    businessData={data} // Pass the search results data
                />
            </Container>}

            <Container maxWidth="lg">
                <CardList data={data} buisnessType={buisnessType} isLoading={isLoading} />
            </Container>

            <RecommendedSection Services={popularServices}/>
        </>
    );
};

export default Overview;
