import React, { useState } from 'react';
import {
    Box, TextField, Button, InputAdornment, Typography, CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { showSuccess, showError } from '../../components/toast';
import { apipost } from '../service/api'



const Signup = ({ setLoginOpen, setSignupOpen, setUserAction }) => {
    const [showOTP, setShowOTP] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [verifyotp, setVerifyotp] = useState(false);
    const [loading, setLoading] = useState(false)
    const [demoOTP, setDemoOTP] = useState('333333');


    const commonBoxStyle = {
        height: '10px',
        width: '10px',
        backgroundColor: '#fff',
        borderRadius: '50%',
        position: 'absolute',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        phoneNumber: Yup.string()
            .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
            .required('Phone number is required'),
        otp: Yup.string().required('Please enter OTP'),

    });

    const initialValues = {
        name: '',
        phoneNumber: '',
        otp: '',
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            handleSubmit(values);
        },
    })

    const handleSubmit = async (values) => {
        setLoading(true)
        const response = await apipost('api/v1/customer/create', {

            Name: values.name,
            PhoneNumber: values.phoneNumber,
            Password: '7415823695'

        });
        const data = response.data || response;
        console.log(data)

        if (data && data.Status === 200) {
            setSignupOpen(false);

            // Check if user data exists in localStorage (should be set after OTP verification)
            let userDetail = JSON.parse(localStorage.getItem("userDetail") || "{}");
            
            // If not in localStorage or incomplete, create it from response
            if (!userDetail._id) {
                userDetail = {
                    _id: data?.Data?._id,
                    PhoneNumber: data?.Data?.PhoneNumber,
                    Name: data?.Data?.Name
                };
                localStorage.setItem("userDetail", JSON.stringify(userDetail));
            }

            setUserAction(data)
            formik.resetForm();
            showSuccess('Sign up Successfully')
            setLoading(false)
        } else {
            showError('Something went wrong please try again');
            setLoading(false)
        }
    };

    const sendOTP = async (value) => {

        const response = await apipost(`api/v1/otp/send`, {
            PhoneNumber: value,
            UserType: "customer"
        });


        const data = response.data || response;
        if (data.Status === 400) {
            showError("User Already Exists")
        }
        if (data.Status === 200) {
            setIsOTPSent(true);
            showSuccess("OTP Sent Successfully");
        }
    }

    

    const verifyOTP = async (mobile, otp) => {
        setVerifyotp(true);
        const response = await apipost(`api/v1/otp/verify`, {

            PhoneNumber: mobile,
            OTP: Number(otp),
            UserType: "customer"
        });

        const data = response.data || response;
        console.log("OTP Verification Signup Response:", data);
        if (data.Status === 200) {
            setIsVerified(true);
            
            // Store user data in localStorage after successful OTP verification
            const userDetail = {
                _id: data?.Data?._id,
                PhoneNumber: data?.Data?.PhoneNumber,
                Name: data?.Data?.Name
            };
            
            localStorage.setItem("userDetail", JSON.stringify(userDetail));
            console.log("User data stored in localStorage:", userDetail);
        }
        if (data.Status === 401) {
            setIsVerified(false);
            showError("Invalid OTP")
        }
        setVerifyotp(false)

    }

   


    return (

        <>

            <Box
                sx={{
                    padding: '18px', 
                    borderRadius: '2px',
                    // border: '2px solid #fff', 
                    width: { xs: '85%', sm: '350px', md: '350px' }, 
                    // backgroundColor: 'rgba(0,0,0,0.5)', 
                    position: 'relative',

                }}
            >
                {/* <Box
                    sx={{
                        ...commonBoxStyle,
                        top: '-5px',
                        left: '-5px',
                    }}
                />
                <Box
                    sx={{
                        ...commonBoxStyle,
                        top: '-5px',
                        right: '-5px',
                    }}
                />
                <Box
                    sx={{
                        ...commonBoxStyle,
                        bottom: '-5px',
                        left: '-5px',
                    }}
                />
                <Box
                    sx={{
                        ...commonBoxStyle,
                        bottom: '-5px',
                        right: '-5px',
                    }}
                /> */}


                <Box
                    sx={{
                        padding: '16px', 
                        backgroundColor: '#fff', 
                        borderRadius: '8px', 
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', 
                    }}
                >
                    <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
                        Sign up
                    </Typography>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            label="Name"
                            name='name'
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            placeholder="First Name or Full Name"
                            variant="standard"
                            margin="normal"
                            InputLabelProps={{ style: { color: 'black' } }}
                            sx={{
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: '#000', 
                                },
                                '& .MuiInput-underline:hover:before': {
                                    borderBottomColor: '#000', 
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: '#000', 
                                },
                                color: 'black',
                            }}
                            error={formik.touched.name && Boolean(formik.errors.name)} 
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            fullWidth
                            label="Mobile Number"
                            name='phoneNumber'
                            value={formik.values.phoneNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                e.target.value = value;
                                formik.handleChange(e);
                            }}
                            placeholder="Enter your mobile number"
                            variant="standard"
                            margin="normal"
                            InputLabelProps={{ style: { color: 'black' } }} 
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button
                                            sx={{
                                                display: 'block',
                                                color: 'white', 
                                                backgroundColor: 'black', 
                                                border: '1px solid #000', 
                                                '&:hover': {
                                                    backgroundColor: '#333', 
                                                },
                                                '&.Mui-disabled': {
                                                    color: '#fff',
                                                    backgroundColor: '#444',
                                                },
                                                borderRadius: '20px',
                                                padding: '0 10px',
                                                fontSize: '0.9em',

                                            }}

                                            disabled={!!formik.errors.phoneNumber || isOTPSent}
                                            onClick={() => {

                                                sendOTP(formik.values.phoneNumber);
                                                setShowOTP(true);
                                            }}
                                        >
                                            Send OTP
                                        </Button>
                                    </InputAdornment>
                                ),
                                sx: {
                                    '&:before': {
                                        borderBottomColor: '#000', 
                                    },
                                    '&:hover:before': {
                                        borderBottomColor: '#000',
                                    },
                                    '&:after': {
                                        borderBottomColor: '#000',
                                    },
                                    color: 'black',
                                },
                            }}
                            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)} 
                            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                        />
                        {showOTP &&
                            <TextField
                                fullWidth
                                label="OTP"
                                name='otp'
                                value={formik.values.otp}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d{0,6}$/.test(value)) {
                                        formik.handleChange(e);
                                    }
                                }}
                                placeholder="Enter OTP"
                                variant="standard"
                                margin="normal"
                                InputLabelProps={{ style: { color: 'black' } }} 
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {!isVerified ?
                                                <Button
                                                    sx={{
                                                        display: 'block',
                                                        color: 'white',
                                                        backgroundColor: 'black',
                                                        border: '1px solid #000',
                                                        '&:hover': {
                                                            backgroundColor: '#333',
                                                        },
                                                        '&.Mui-disabled': {
                                                            color: '#fff',
                                                            backgroundColor: '#444',
                                                        },
                                                        borderRadius: '20px',
                                                        padding: '0 10px',
                                                        fontSize: '0.9em',

                                                    }}

                                                    disabled={!formik.values.otp && formik.errors.otp}
                                                    onClick={() => verifyOTP(formik.values.phoneNumber, formik.values.otp)}
                                                >
                                                    {verifyotp ? <CircularProgress size={15} sx={{ color: "white" }} /> : "Verify"}
                                                </Button> :
                                                <Button
                                                    sx={{
                                                        backgroundColor: "white",
                                                        color: "white",
                                                        fontWeight: "bold",
                                                        textTransform: "none",
                                                        width: 'max-content',
                                                        padding: '1px 20px',

                                                        borderRadius: "20px",
                                                        border: "none",
                                                        animation: "fadeGreen 1.5s forwards",
                                                        "@keyframes fadeGreen": {
                                                            from: { backgroundColor: "white" },
                                                            to: { backgroundColor: "#4CAF50" },
                                                        },
                                                    }}
                                                >
                                                    Verified
                                                </Button>
                                            }
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        '&:before': {
                                            borderBottomColor: '#000', 
                                        },
                                        '&:hover:before': {
                                            borderBottomColor: '#000',
                                        },
                                        '&:after': {
                                            borderBottomColor: '#000',
                                        },
                                        color: 'black',
                                    },
                                }}
                                error={formik.touched.otp && Boolean(formik.errors.otp)} 
                                helperText={formik.touched.otp && formik.errors.otp}
                            />
                        }

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{
                                backgroundColor: 'black', 
                                color: 'white', 
                                borderColor: 'white',
                                width: '150px', 
                                borderRadius: '20px', 
                                display: 'block', 
                                margin: '2em auto 0', 
                                '&:hover': {
                                    backgroundColor: '#333',
                                },
                                '&.Mui-disabled': {
                                    color: '#fff',
                                    backgroundColor: '#444',
                                },
                            }}
                            disabled={Object.keys(formik.errors).length > 0 || !isVerified}
                        >
                            {loading ? <CircularProgress size={15} sx={{ color: "white" }} /> : "Sign up"}
                        </Button>

                        <Typography fontSize={'0.7em'} width={'80%'} margin={'4em auto 0'} textAlign={'center'} variant='body2'>By creating an account, you agree to our <Link to="" style={{ textDecoration: 'none' }} >Terms of Service </Link>  and  <Link style={{ textDecoration: 'none' }} to="">Privacy Policy</Link></Typography>
                        <Typography variant='body2' mt={3} fontSize={'0.7em'} textAlign={'center'}>Already have an account ? <Link
                            onClick={() => {
                                setSignupOpen(false); 
                                setLoginOpen(true); 
                            }}
                        >Log in here</Link></Typography>
                    </form>
                </Box>
            </Box >
        </>

    );
};

export default Signup;


