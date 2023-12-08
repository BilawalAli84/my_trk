// GoogleConversion.js

import React, { useState, Fragment } from 'react';
import { Button, TextField, styled, useTheme, MenuItem } from '@mui/material';
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

const GoogleConversion = () => {
  const { palette } = useTheme();
  const [googleId, setGoogleId] = useState('');
  const [eventId, setEventId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isGoogleIdValid, setIsGoogleIdValid] = useState(true);
  const [isEventIdValid, setIsEventIdValid] = useState(true);
  const [googleEventToFire, setGoogleEventToFire] = useState('');
  const [isApiKeyValid, setIsApiKeyValid] = useState(true);

  const handleGoogleIdChange = (event) => {
    const value = event.target.value;
    setGoogleId(value);
    setIsGoogleIdValid(value.trim() !== '');
  };
  const handleEventIdChange = (event) => {
    const value = event.target.value;
    setEventId(value);
    setIsEventIdValid(value.trim() !== '');
  };
  const handleGoogleEventToFireChange = (event) => {
    setGoogleEventToFire(event.target.value);
  };

  const handleApiKeyChange = (event) => {
    const value = event.target.value;
    setApiKey(value);
    setIsApiKeyValid(value.trim() !== '');
  };

  const handleSubmit = async () => {
    if (isGoogleIdValid && isApiKeyValid) {
      try {
        const response = await axiosClient.post(
          '/google-conversion', // Replace with the actual Google API endpoint
          {
            google_id: googleId,
            event_id:eventId,
            event_name:googleEventToFire,
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
      console.error('Invalid input. Please enter valid values for Google ID and API Key.');
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
        <H4>Add Google Conversion</H4>
        <form>
          <TextField
            label="Enter your Google ID"
            value={googleId}
            onChange={handleGoogleIdChange}
            fullWidth
            margin="normal"
            required
            error={!isGoogleIdValid}
            helperText={!isGoogleIdValid ? 'Google ID is required' : ''}
          />
          <TextField
            label="Enter your Event ID"
            value={eventId}
            onChange={handleEventIdChange}
            fullWidth
            margin="normal"
            required
            error={!isEventIdValid}
            helperText={!isEventIdValid ? 'Google ID is required' : ''}
          />
          <TextField
            select
            label="Select Google Events to Fire"
            value={googleEventToFire}
            onChange={handleGoogleEventToFireChange}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="PageView">Page View</MenuItem>
            <MenuItem value="Purchase">Purchase</MenuItem>
            <MenuItem value="SubmitLead">Submit lead</MenuItem>
            <MenuItem value="SignUp">Sign-up</MenuItem>
            {/* Add more MenuItem components for additional options */}
          </TextField>
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

export default GoogleConversion;
