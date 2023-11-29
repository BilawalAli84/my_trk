import { useState } from 'react';
import { Button, TextField, TextareaAutosize, styled, useTheme } from '@mui/material';
import axiosClient from 'axios.js';
import { Fragment } from 'react';
// import { toast } from 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const Domain = () => {
    const { palette } = useTheme();
    const [domain, setDomain] = useState('');
    const [isDomainValid, setIsDomainValid] = useState(true);
    const [generatedScript, setGeneratedScript] = useState('');
  
    const handleDomainChange = (event) => {
      const value = event.target.value;
      setDomain(value);
      // Check if the entered domain has correct syntax
      setIsDomainValid(/^https?:\/\/[^\/]+\..+$/.test(value.trim()));
    };
  
    const handleSubmit = async () => {
    // Check if the required field is valid before submitting
    if (isDomainValid) {
      try {
        // Make an Axios POST request
        const response = await axiosClient.post(
          '/domain', // Updated API endpoint
          {
            domain,
          }
        );

        // Show success notification
        toast.success('Domain registered successfully!', {
          position: 'top-center',
          autoClose: 3000, // Close the notification after 3000 milliseconds (adjust as needed)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        // Handle errors
        console.error('Error making POST request:', error.message);

        // Show error notification
        toast.error('Failed to register domain. Please try again.', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      // Handle the case where the domain syntax is not valid
      console.error('Invalid domain syntax. Please enter a valid domain (e.g., https://example.com).');

      // Show validation error notification
      toast.error('Invalid domain syntax. Please enter a valid domain (e.g., https://example.com).', {
        position: 'top-center',
        autoClose: 5000, // Show validation error for a longer duration
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
          <H4>Domain Set-Up</H4>
          <form>
            <TextField
              label="Enter your domain"
              value={domain}
              onChange={handleDomainChange}
              fullWidth
              margin="normal"
              required
              error={!isDomainValid}
              helperText={!isDomainValid ? 'Invalid domain syntax' : ''}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
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
            theme="dark" />
        </ContentBox>
      </Fragment>
    );
  };
  
  export default Domain;
  