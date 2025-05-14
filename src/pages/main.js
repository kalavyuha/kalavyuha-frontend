import React from 'react'
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

const main = () => {
    return (
        <>
           
            <Banner />
            <ServiceDirectory/>
            <RecommendedSection/>
            <RecommendedSection/>
            <BusinessList/>
            <AppInfoSection />
            <Reviews />
        </>
    )
}

export default main