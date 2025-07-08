import React, { useState } from 'react';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Box, TextField, Button, Link, Grid, Typography, InputAdornment, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apipost } from '../service/api';
import { showError, showSuccess } from '../../components/toast';

const LoginPage = ({ setLoginOpen, setSignupOpen,setUserAction }) => {

    const [isVerified, setIsVerified] = useState(false);
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [verifyotp, setVerifyotp] = useState(false);
    const [loading, setLoading] = useState(false);

    const commonBoxStyle = {
        height: '10px',
        width: '10px',
        backgroundColor: '#fff',
        borderRadius: '50%',
        position: 'absolute',
    };


    const validationSchema = Yup.object({
        phoneNumber: Yup.string()
            .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
            .required('Phone number is required'),
        otp: Yup.string().required('Please enter OTP'),
    });


    const initialValues = {
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
        try {
            setLoading(true);

            const response = await apipost('api/v1/customer/login/', {
                PhoneNumber: values.phoneNumber,
                Password: '7415823695',
            });


            const data = response.data || response;
            console.log(data)
            if (data && data.Status === 1) {

                const userDetail = {
                    _id: data?.Data?._id,
                    Token: data?.Data?.Token,
                };
                
                localStorage.setItem("userDetail", JSON.stringify(userDetail));
                
                formik.resetForm();
                setLoginOpen(false);
                setUserAction(userDetail)
                showSuccess('Login Successfully')

            } else {
                showError('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };




    const sendOTP = async (value) => {

        const response = await apipost(`api/v1/otp/send`, {

            PhoneNumber: value,

        });


        const data = response.data || response;
       
        if (data.Status === 400) {
            showError("User Already Exists")
        }
        if (data.Status === 200) {
            setIsOTPSent(true);
            showSuccess("OTP Sent Successfully");
        }
        setIsOTPSent(true);
    }


    const verifyOTP = async (mobile, otp) => {
        setVerifyotp(true);
        const response = await apipost(`api/v1/otp/verify`, {

            PhoneNumber: mobile,
            OTP: Number(otp)
        });

        const data = response.data || response;
    

        if (data.Status===200) {
            setIsVerified(true);
        }
        if (data.Status === 401) {
            showError("Invalid OTP")
        }


    }




    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundImage: 'url("/path/to/background-image.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Box
                sx={{
                    padding: '16px',
                    borderRadius: '2px',
                    // border: '2px solid #fff',
                    width: { xs: '90%', sm: '550px' },
                    // backgroundColor: 'rgba(0,0,0,0.5)',
                    position: 'relative',
                }}
            >
                {/* <Box sx={{ ...commonBoxStyle, top: '-5px', left: '-5px' }} />
                <Box sx={{ ...commonBoxStyle, top: '-5px', right: '-5px' }} />
                <Box sx={{ ...commonBoxStyle, bottom: '-5px', left: '-5px' }} />
                <Box sx={{ ...commonBoxStyle, bottom: '-5px', right: '-5px' }} /> */}
                <Box
                    sx={{
                        backgroundColor: 'white',
                        padding: { xs: 2, sm: 3, md: 4 },
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ textAlign: 'center', fontSize: { xs: '28px', sm: '28px', md: '32px' } }}
                    >
                        It&apos;s more than an appointment.
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 4, textAlign: 'center' }}
                    >
                        It&apos;s your time saving.
                    </Typography>

                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            {(!isOTPSent) ?
                                <>
                                    <Grid item xs={12} sm={12} md={8}>
                                        <TextField

                                            fullWidth
                                            name="phoneNumber"
                                            label="Phone Number"
                                            value={formik.values.phoneNumber}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                e.target.value = value;
                                                formik.handleChange(e);
                                            }}
                                            variant="standard"
                                            type="text"
                                            error={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
                                            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                        />

                                    </Grid>
                                </> :
                                <>
                                    <Grid item xs={12} sm={12} md={8}>

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
                                    </Grid>
                                </>
                            }

                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={4}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'end',
                                }}
                            >
                                {!isOTPSent ? <Button
                                    sx={{
                                        height: '30px',
                                        width: '100px',
                                        background: '#000',
                                        color: '#f1f1f1',
                                        borderRadius: '20px',
                                        '&.Mui-disabled': {
                                            color: '#fff',
                                            backgroundColor: '#444',
                                        },

                                    }}
                                    disabled={formik.errors.phoneNumber}
                                    variant="contained"
                                    onClick={() => sendOTP(formik.values.phoneNumber)}
                                    
                                >
                                  Get  OTP
                                </Button> :
                                    <Button
                                        sx={{
                                            height: '30px',
                                            width: '100px',
                                            background: '#000',
                                            color: '#f1f1f1',
                                            borderRadius: '20px',
                                            '&.Mui-disabled': {
                                                color: '#fff',
                                                backgroundColor: '#444',
                                            },
                                        }}
                                        disabled={Object.keys(formik.errors).length > 0 || !isVerified}
                                        variant="contained"
                                        type="submit"
                                        endIcon={<ArrowRightAltIcon />}
                                    >
                                        {loading ? <CircularProgress size={15} sx={{ color: "white" }} /> : "Login"}
                                    </Button>}

                            </Grid>

                            <Grid item xs={12} sm={12} md={12}>
                                <Box
                                    width="100%"
                                    sx={{ fontSize: '14px' }}
                                    mt={2}
                                    gap={2}
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                >
                                    <Link href="#" variant="body2">
                                        Forget password?
                                    </Link>
                                    <Box component="span">
                                        Didn&apos;t have an account ?{' '}
                                        <Link
                                            sx={{ textDecoration: 'none', marginLeft: '5px', cursor: 'pointer' }}
                                            onClick={() => {
                                                setLoginOpen(false); // Close Login Popup
                                                setSignupOpen(true); // Open Signup Popup
                                            }}
                                            variant="body2"
                                        >
                                            Sign Up Now
                                        </Link>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginPage;



