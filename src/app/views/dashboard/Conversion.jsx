import { useState, Fragment } from 'react';
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

const Conversion = () => {
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
    // Validate pixel_id (you can customize the validation logic)
    setIsPixelIdValid(value.trim() !== '');
  };

  const handleAccessTokenChange = (event) => {
    const value = event.target.value;
    setAccessToken(value);
    // Validate access_token (you can customize the validation logic)
    setIsAccessTokenValid(value.trim() !== '');
  };

  const handleTestCodeChange = (event) => {
    const value = event.target.value;
    setTestCode(value);
    // Allow an empty string for test_code (optional field)
    setIsTestCodeValid(true); // You can customize the validation logic if needed
  };

  const handleSubmit = async () => {
    // Check if pixel_id and access_token are valid
    if (isPixelIdValid && isAccessTokenValid) {
      try {
        // Make an Axios POST request
        const response = await axiosClient.post(
          '/conversion', // Updated API endpoint
          {
            pixel_id: pixelId,
            access_token: accessToken,
            test_code: testCode, // Include test_code even if it's an empty string
          }
        );

        // Show success notification
        toast.success('Successfully Added!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        // Handle errors
        console.error('Error making POST request:', error.message);

        // Show error notification
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
      // Handle the case where any of the fields are not valid
      console.error('Invalid input. Please enter valid values for pixel_id and access_token.');

      // Show validation error notification
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
        <H4>Add Pixel</H4>
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

export default Conversion;
