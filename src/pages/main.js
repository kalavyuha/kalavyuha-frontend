import React, { useEffect } from 'react'
// import NewsLetter from './HomePage/NewsLetter'
import Reviews from './HomePage/Reviews'
import AppInfoSection from './HomePage/AppInfoSection'
import Banner from './HomePage/Banner'
import Navbar from '../components/Navbar'
import ServiceDirectory from './HomePage/NearByServices'
import DailyOffers from './HomePage/DailyOffers'
import RecommendedSection from './HomePage/RecommendedSection'
import FAQSection from './HomePage/faqSection'
import Footer from './BusniessPage/businessFooter'
import {
    Container,
  } from '@mui/material';
import BusinessList from "./HomePage/BusinessList"

const Main = () => {
    
    useEffect(() => {
        const fetchLocationCoordinates = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                console.log('IP-based location coordinates:', {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    city: data.city,
                    region: data.region,
                    country: data.country_name
                });
            } catch (error) {
                console.error('Error fetching IP-based location coordinates:', error);
            }
        };

        const getUserExactLocation = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // User agreed to share location
                        // console.log('User agreed to share exact location:', {
                        //     latitude: position.coords.latitude,
                        //     longitude: position.coords.longitude,
                        //     accuracy: position.coords.accuracy,
                        //     timestamp: new Date(position.timestamp).toLocaleString()
                        // });
                    },
                    (error) => {
                        // User declined or error occurred
                        switch(error.code) {
                            case error.PERMISSION_DENIED:
                                console.log('User declined to share location');
                                break;
                            case error.POSITION_UNAVAILABLE:
                                console.log('Location information is unavailable');
                                break;
                            case error.TIMEOUT:
                                console.log('Location request timed out');
                                break;
                            default:
                                console.log('An unknown error occurred while retrieving location');
                                break;
                        }
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            } else {
                console.log('Geolocation is not supported by this browser');
            }
        };

        fetchLocationCoordinates();
        getUserExactLocation();
    }, []);

    return (
        <>
           
            <Banner />
            <ServiceDirectory/>
            <RecommendedSection category="Beauty" />
            {/* <RecommendedSection category="Wellness" />
            <RecommendedSection category="Health" /> */}
            <BusinessList/>
            <AppInfoSection />
            <Reviews />
        </>
    )
}

export default Main