import React, { useState, Fragment } from 'react';
import { Button, TextField, styled, useTheme } from '@mui/material';
import axiosClient from 'axios.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContentBox = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const H4 = styled('h4')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginBottom: '16px',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
}));

const FacebookConversion = () => {
  const { palette } = useTheme();
  const [pixelId, setPixelId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [testCode, setTestCode] = useState('');
  const [isPixelIdValid, setIsPixelIdValid] = useState(true);
  const [isAccessTokenValid, setIsAccessTokenValid] = useState(true);
  const [isTestCodeValid, setIsTestCodeValid] = useState(true);

  const handlePixelIdChange = (event) => {
    const value = event.target.value;
    setPixelId(value);
    setIsPixelIdValid(value.trim() !== '');
  };

  const handleAccessTokenChange = (event) => {
    const value = event.target.value;
    setAccessToken(value);
    setIsAccessTokenValid(value.trim() !== '');
  };

  const handleTestCodeChange = (event) => {
    const value = event.target.value;
    setTestCode(value);
    setIsTestCodeValid(true);
  };

  const handleSubmit = async () => {
    if (isPixelIdValid && isAccessTokenValid) {
      try {
        const response = await axiosClient.post(
          '/facebook-conversion', // Replace with the actual Facebook API endpoint
          {
            pixel_id: pixelId,
            access_token: accessToken,
            test_code: testCode,
          }
        );

        toast.success('Successfully Added!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        console.error('Error making POST request:', error.message);
        toast.error('Failed to add the credentials', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      console.error('Invalid input. Please enter valid values for pixel_id and access_token.');
      toast.error('Invalid input', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <Fragment>
      <ContentBox className="analytics">
        <H4>Add Facebook Pixel</H4>
        <form>
          <TextField
            label="Enter your pixel_id"
            value={pixelId}
            onChange={handlePixelIdChange}
            fullWidth
            margin="normal"
            required
            error={!isPixelIdValid}
            helperText={!isPixelIdValid ? 'Pixel ID is required' : ''}
          />
          <TextField
            label="Enter your access_token"
            value={accessToken}
            onChange={handleAccessTokenChange}
            fullWidth
            margin="normal"
            required
            error={!isAccessTokenValid}
            helperText={!isAccessTokenValid ? 'Access Token is required' : ''}
          />
          <TextField
            label="Enter your test_code (optional)"
            value={testCode}
            onChange={handleTestCodeChange}
            fullWidth
            margin="normal"
            error={!isTestCodeValid}
            helperText={!isTestCodeValid ? 'Test Code is invalid' : ''}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Add
          </Button>
        </form>
        <ToastContainer
          className="toast-position"
          position="top-center"
          autoClose={10000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </ContentBox>
    </Fragment>
  );
};

export default FacebookConversion;
