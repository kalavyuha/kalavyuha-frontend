import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DarkButton from "../../components/DarkButton";
import ActiveLastBreadcrumb from "../../components/ActiveLastBreadcrumb";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import ShareTwoToneIcon from "@mui/icons-material/ShareTwoTone";
import {
  Box,
  Card,
  CardMedia,
  Typography,
  Stack,
  Button,
  Chip,
  IconButton,
  Rating,
  CardContent,
  Paper,
  Link,
  Grid,
  Container,
  Skeleton,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Facebook,
  Instagram,
  YouTube,
  Telegram,
} from "@mui/icons-material";
import FilterAndMap from "../../components/FilterAndMap";
import { Star as StarIcon } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import OpacityIcon from "@mui/icons-material/Opacity";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import BedIcon from "@mui/icons-material/Bed";
import OffersCarousel from "./offersSection";
import Products from "./ProductSection/Products";
import Services from "./Services/Service";
import SearchBar from "./SearchBar/SearchBar";
import { apiget } from "../service/api";
import { useMatchingSearchResult } from "../../Context/detailPageContext";
import Reviews from "../HomePage/Reviews";

//  Images

//  proucts Images

import AboutUs from "./About/About";
import ImageGallery from "./Gallery/Gallery";
import AddReviews from "./AddReviews/AddReviews";

const timing = [
  { day: "Monday", time: "9:30 am - 10:00 pm" },
  { day: "Tuesday", time: "9:30 am - 10:00 pm" },
  { day: "Wednesday", time: "9:30 am - 10:00 pm" },
  { day: "Thursday", time: "9:30 am - 10:00 pm" },
  { day: "Friday", time: "9:30 am - 10:00 pm" },
  { day: "Saturday", time: "9:30 am - 10:00 pm" },
  { day: "Sunday", time: "Closed" },
];

const facilities = [
  {
    name: "Instant Confirmation",
    icon: <CheckCircleIcon color="success" />,
    available: true,
  },
  { name: "Internet", icon: <WifiIcon color="success" />, available: true },
  {
    name: "Parking",
    icon: <LocalParkingIcon color="success" />,
    available: true,
  },
  { name: "Water", icon: <OpacityIcon color="success" />, available: true },
  { name: "AC/Cooler", icon: <AcUnitIcon color="success" />, available: true },
  {
    name: "Child Friendly",
    icon: <ChildCareIcon color="success" />,
    available: true,
  },
  { name: "1 Bed", icon: <BedIcon color="error" />, available: false },
];

function BeautyMain() {
  const [buisnessInfo, setBuisnessInfo] = useState([]);
  const [buisnessProduct, setBuisnessProduct] = useState([]);
  const [amenities, setAmenities] = useState({});
  const [services, setServices] = useState([]);
  const [images, setimages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [matchingServices, setMatchingServices] = useState({});
  const [loading, setLoading] = useState(false);
  const [buisnessHours, setBuisnessHours] = useState([]);
  const [staff, setStaff] = useState([]);
  const { isMatchingResult } = useMatchingSearchResult();

  const params = useParams();
  const { id } = params;

  const fetchDetailData = async () => {
    setLoading(true);
    const result = await apiget(`api/v1/BussinessDetails/alldetails/${id}`);
    console.log(result)
    if (result && result?.data?.Status === 200) {
      setBuisnessInfo(result?.data?.Data?.BusinessInfo);
      setServices(result?.data?.Data?.Services);
      setimages(result?.data?.Data?.BussinessImages || []);
      setBuisnessProduct(result?.data?.Data?.BussinessProducts);
      setAmenities(result?.data?.Data?.BussinessFacilities);
      setReviews(result?.data?.Data?.CustomerReview);
      setBuisnessHours(result?.data?.Data?.BussinessHours);
      setStaff(result?.data?.Data?.Staffs);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetailData();
  }, []);

  useEffect(() => {
    setMatchingServices(services && services[0] ? services[0] : {});
  }, [services]);
  console.log("data", buisnessInfo);
  return (
    <>
      <SearchBar
        onDataChange={""}
        buisnessInfo={buisnessInfo}
        reviews={reviews?.totalReviews || 0}
      />

      <Container maxWidth="lg">
        {/* {images.length > 0 && <ImageGallery images={images} />}  changes made by rakshit */}
        {images && images.length > 0 && <ImageGallery images={images} />}{" "}
        {/*---------changes made by Rakshit*/}
        <OffersCarousel buisnessId={buisnessInfo?.BussinessUserId} />
        <Box sx={{ padding: 2, mt: 2 }}>
          <Box
            sx={{
              display: { xs: "unset", sm: "flex", md: "flex" },
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            {loading ? (
              <>
                <Skeleton
                  variant="text"
                  width={200}
                  height={30}
                  sx={{ mb: { xs: 2, sm: "unset", md: "unset" } }}
                />

                <Box>
                  <Skeleton variant="text" width={180} height={28} />
                  <Skeleton variant="text" width={140} height={24} />
                </Box>

                <Stack
                  direction={{ xs: "row", sm: "row", md: "row" }}
                  alignItems={"center"}
                  justifyContent={{
                    xs: "space-between",
                    sm: "unset",
                    md: "unset",
                  }}
                  gap={3}
                >
                  <Box textAlign="right">
                    <Stack direction="row" spacing={1}>
                      <Skeleton variant="text" width={60} height={24} />
                      <Skeleton variant="text" width={60} height={24} />
                    </Stack>
                    <Skeleton variant="text" width={120} height={18} />
                  </Box>
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={40}
                    sx={{ borderRadius: 1 }}
                  />
                </Stack>
              </>
            ) : (
              isMatchingResult && (
                <>
                  <Typography
                    variant="body1"
                    mb={{ xs: 2, sm: "unset", md: "unset" }}
                    fontSize={"16px"}
                    fontWeight={600}
                  >
                    {!matchingServices ? "No" : ""} Matching search results
                  </Typography>

                  {matchingServices && (
                    <>
                      <Box>
                        <Typography
                          variant="body1"
                          fontSize={{ xs: "14px", sm: "unset", md: "unset" }}
                          style={{ textTransform: "capitalize" }}
                          fontWeight="bold"
                        >
                          {matchingServices?.ServiceName || ""}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {matchingServices?.Duration}
                          <Button
                            variant="text"
                            size="small"
                            sx={{
                              padding: 0,
                              textTransform: "none",
                              color: "#1b4d69",
                            }}
                          >
                            More Details
                          </Button>
                        </Typography>
                      </Box>

                      <Stack
                        direction={{ xs: "row", sm: "row", md: "row" }}
                        alignItems={"center"}
                        justifyContent={{
                          xs: "space-between",
                          sm: "unset",
                          md: "unset",
                        }}
                        gap={3}
                      >
                        <Box textAlign="right">
                          <Stack direction={"row"} spacing={1}>
                            {matchingServices?.Price && (
                              <Typography
                                variant="body1"
                                fontWeight="bold"
                                style={{
                                  textDecoration: matchingServices?.isDiscount
                                    ? "line-through"
                                    : "none",
                                }}
                              >
                                {`₹${matchingServices?.Price}/-`}
                              </Typography>
                            )}
                            {matchingServices?.DiscountedPrice &&
                              matchingServices?.isDiscount && (
                                <Typography variant="body1" fontWeight="bold">
                                  {`₹${matchingServices.DiscountedPrice}/-`}
                                </Typography>
                              )}
                          </Stack>
                          <Typography
                            variant="body2"
                            fontSize={{ xs: "10px", sm: "14px", md: "14px" }}
                            sx={{ color: "#1b4d69" }}
                          >
                            Save up to{" "}
                            {matchingServices?.DiscountPercentage || "50%"}
                          </Typography>
                        </Box>

                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#000",
                            "&:hover": { backgroundColor: "#164253" },
                            textTransform: "capitalize",
                          }}
                          size="medium"
                        >
                          Add
                        </Button>
                      </Stack>
                    </>
                  )}
                </>
              )
            )}
          </Box>
        </Box>
        <Services
          services={services}
          buisness_Id={buisnessInfo?.BussinessUserId}
          loading={loading}
          staffData={staff}
          businessInfo={buisnessInfo}
        />
        {buisnessProduct.length > 0 && (
          <Products
            products={buisnessProduct}
            location={buisnessInfo?.StreetAddress}
          />
        )}
        <Reviews data={reviews} />
        <AddReviews />

        <AboutUs
          timing={timing}
          facilities={amenities}
          latitude={buisnessInfo?.Latitude}
          longitude={buisnessInfo?.Longitude}
          description={buisnessInfo?.Introduction}
          region={buisnessInfo?.Region}
          StreetAddress={buisnessInfo?.StreetAddress}
          buisnessName={buisnessInfo?.BusinessName}
          timingData={buisnessHours}
        />
        {/* <ServiceBooking /> */}
      </Container>
    </>
  );
}
export default BeautyMain;
