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
// import {
//     Container,
//   } from '@mui/material';
import BusinessList from "./HomePage/BusinessList"

const Main = () => {
    
    useEffect(() => {
        const fetchLocationCoordinates = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                // Save latitude and longitude to localStorage
                if (data.latitude && data.longitude) {
                    localStorage.setItem('latitude', data.latitude);
                    localStorage.setItem('longitude', data.longitude);
                }
            } catch (error) {
                console.error('Error fetching IP-based location coordinates:', error);
            }
        };

        const getUserExactLocation = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // Save exact latitude and longitude to localStorage
                        localStorage.setItem('latitude', position.coords.latitude);
                        localStorage.setItem('longitude', position.coords.longitude);
                    },
                    (error) => {
                        // User declined or error occurred
                        switch(error.code) {
                            case error.PERMISSION_DENIED:
                                // User declined to share location
                                break;
                            case error.POSITION_UNAVAILABLE:
                                // Location information is unavailable
                                break;
                            case error.TIMEOUT:
                                // Location request timed out
                                break;
                            default:
                                // An unknown error occurred while retrieving location
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
                // Geolocation is not supported by this browser
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
            <RecommendedSection category="Fitness" />
            <RecommendedSection category="Health Care" />
            <BusinessList/>
            {/* <AppInfoSection /> */}
            <Reviews />
        </>
    )
}

export default Main