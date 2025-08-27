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


    const IndexFilterData = previousData?.state?.data;
    const searchBarData = previousData?.state?.search

    // Log the search data to see what's being passed
    // useEffect(() => {
    //     if (searchBarData) {
    //         console.log('Search data received in Overview:', searchBarData);
    //         console.log('Date:', searchBarData?.date);
    //         console.log('Time:', searchBarData?.time);
    //         console.log('Selected Date Data:', searchBarData?.selectedDateData);
    //     }
    // }, [searchBarData])


    const handleDataChange = (newData) => {
        setData(newData);
    };

    const fetchPopularServices = async () => {
        try {
            const result = await apiget(`${constant.baseUrl}api/v1/Service/popularServiceAndBusinesses/?SearchFor=Service&Category=Beauty&latitude=78.9897978&longitude=28.6767965&page=1`);
            if (result && result.data?.Status === 200) {
                 console.log("TESTING:",result?.data?.Data)
                setPopularServices(result?.data?.Data)
            }
        } catch (err) {
            console.log(err)
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
                <MapComponent />
            </Container>}

            <Container maxWidth="lg">
                <CardList data={data} buisnessType={buisnessType} isLoading={isLoading} />
            </Container>

            <RecommendedSection Services={popularServices}/>
        </>
    );
};

export default Overview;
