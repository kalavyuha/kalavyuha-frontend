import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography, Stack } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import Img1 from '../../assets/images/Signup_Images/sign1.jpeg';
import Img2 from '../../assets/images/Signup_Images/sign2.jpeg';
import Img3 from '../../assets/images/Signup_Images/sign3.jpeg';
import Img4 from '../../assets/images/Signup_Images/sign4.jpeg';
import Img5 from '../../assets/images/Signup_Images/sign5.jpeg';
import Img6 from '../../assets/images/Signup_Images/sign6.jpeg';
import Img7 from '../../assets/images/Signup_Images/sign7.jpeg';
import Img8 from '../../assets/images/Signup_Images/sign8.avif'
import Navbar from '../../components/navigation';
import DarkButton from '../../components/DarkButton';

const images = [Img1, Img2, Img3, Img4, Img5, Img6, Img7, Img8];

const HexagonGallery = () => {
    return (
        <Box
            sx={{
                margin: 'auto',
                marginTop: '50px',
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)', // Define 5 fractions for better control
                gridAutoRows: '150px',
                gap: '0',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: '900px',
            }}
        >
            {/* Column 1 - 2 Images */}
            <Box
                sx={{
                    gridColumn: '2 / span 2',
                    gridRow: '1 / span 2',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '12em',
                    height: '11em',
                    backgroundColor: '#424242',
                    WebkitClipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                }}
            >
                <img
                    src={images[0]}
                    alt="hexagon-1"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'cover',
                    }}
                />
            </Box>

            <Box
                sx={{
                    gridColumn: '2 / span 2',
                    gridRow: '2 / span 2',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '12em',
                    height: '11em',
                    backgroundColor: '#424242',
                    WebkitClipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                }}
            >
                <img
                    src={images[1]}
                    alt="hexagon-2"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'cover',
                    }}
                />
            </Box>

            {/* Column 2 - 3 Images with Shift */}
            <Box
                sx={{
                    gridColumn: '3 / span 2',
                    gridRow: '1',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '12em',
                    height: '11em',
                    backgroundColor: '#424242',
                    WebkitClipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                    transform: 'translateX(10px)',
                }}
            >
                <img
                    src={images[2]}
                    alt="hexagon-3"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'cover',
                    }}
                />
            </Box>

            <Box
                sx={{
                    gridColumn: '3 / span 2',
                    gridRow: '2',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '12em',
                    height: '11em',
                    backgroundColor: '#424242',
                    WebkitClipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                    transform: 'translateX(10px)',
                }}
            >
                <img
                    src={images[3]}
                    alt="hexagon-4"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'cover',
                    }}
                />
            </Box>

            <Box
                sx={{
                    gridColumn: '3 / span 2',
                    gridRow: '3',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '12em',
                    height: '11em',
                    backgroundColor: '#424242',
                    WebkitClipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                    transform: 'translateX(10px)',
                }}
            >
                <img
                    src={images[4]}
                    alt="hexagon-5"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'cover',
                    }}
                />
            </Box>

            {/* Column 3 - 2 Images */}
            <Box
                sx={{
                    gridColumn: '5 / span 2',
                    gridRow: '1 / span 2',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '12em',
                    height: '11em',
                    backgroundColor: '#424242',
                    WebkitClipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                }}
            >
                <img
                    src={images[5]}
                    alt="hexagon-6"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'cover',
                    }}
                />
            </Box>

            <Box
                sx={{
                    gridColumn: '5 / span 2',
                    gridRow: '2 /span 2',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '12em',
                    height: '11em',
                    backgroundColor: '#424242',
                    WebkitClipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                }}
            >
                <img
                    src={images[6]}
                    alt="hexagon-7"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'cover',
                    }}
                />
            </Box>
        </Box>
    );
};

const TwoButon = () => {
    return (
        <>
            <DarkButton buttonTitle={'Login'} />
            <DarkButton buttonTitle={'Eng'} />
        </>
    )
}
const RightBoxStyle = {
    padding: '2em',
    border: '2px solid #000',
    width: { xs: '100%', md: '20em', sm: '100%' },
    color: '#000',
    borderRadius: '2em',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
    '&:hover': {
        backgroundColor: 'black',
        color: 'white',
        borderColor: 'white',
        '& svg': {
            color: 'white',
        },
    },
};
const ArrowStyle = {
    fontSize: '3em'
}

const SignupBuisness = () => {
    return (
        <>
            <Box
                sx={{
                    minHeight: '100vh',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2em',
                    justifyContent: 'center'
                }}
            >

                <Box
                    display="flex"
                    flexDirection={{ xs: 'column', md: 'row' }}
                    alignItems="center"
                    justifyContent={'center'}
                    gap={{ xs: '2em', md: '3em' }}
                >
                    <Box
                        width={{ xs: '100%', md: '40%' }}
                        display="flex"
                        justifyContent="center"
                    >
                        <HexagonGallery />
                    </Box>
                    <Box
                        width={{ xs: '100%', md: '100%' }}
                        display="flex"
                        flexDirection="column"
                        gap={4}
                        height="100%"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Stack
                            direction="row"
                            sx={RightBoxStyle}
                            component={Link}
                            to="/business-registration"
                            style={{ textDecoration: 'none' }}
                        >
                            <Box>
                                <Typography variant="h6">Business Registration</Typography>
                                <Typography variant="body1">Unlock Your Business Potential</Typography>
                            </Box>
                            <ArrowRightAltIcon sx={ArrowStyle} />
                        </Stack>

                        <Stack
                            direction="row"
                            sx={RightBoxStyle}
                            component={Link}
                            to="/join-member"
                            style={{ textDecoration: 'none' }}
                        >
                            <Box>
                                <Typography variant="h6">Join as Member</Typography>
                                <Typography variant="body1">Appoint service nearby you!</Typography>
                            </Box>
                            <ArrowRightAltIcon sx={ArrowStyle} />
                        </Stack>
                    </Box>
                </Box>
                <Link
                    to=""
                    style={{
                        color: '#1b4e6',
                        marginLeft: 'auto',
                        marginRight: '2em',
                        marginTop: '3em',
                        display: 'block',
                        width: 'max-content',
                        textDecoration: 'none',
                    }}
                >
                    Help
                </Link>
            </Box>

        </>
    );
};

export default SignupBuisness;
