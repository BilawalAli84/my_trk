import { useState,useEffect } from 'react';
import { Button, MenuItem, TextField,TextareaAutosize, styled, useTheme } from '@mui/material';
import axiosClient from 'axios.js';
import { Fragment } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

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

const Tracking = () => {
  const { palette } = useTheme();
  const [domain, setDomain] = useState('');
  const [webUrl, setWebUrl] = useState('');
  const [pixelId, setPixelId] = useState('');
  const [googleId, setGoogleId] = useState('');
  const [isDomainValid, setIsDomainValid] = useState(true);
  const [generatedScript, setGeneratedScript] = useState('');
  const [availableDomains, setAvailableDomains] = useState([]);
  const [availableGoogleId, setAvailableGoogleId] = useState([]);
  const [availablePixels, setAvailablePixels] = useState([]);
  const [availablePaths, setAvailablePaths] = useState([]);


  useEffect(() => {
    // Make an Axios GET request to fetch available domains
    axiosClient.get('/get_domains')
      .then(response => {
        // Update state with the received domains
        setAvailableDomains(response.data.domains);
        const userData = JSON.parse(localStorage.getItem('user'));
        const scriptCode = `
        <script src = 'https://my-track-down.s3.amazonaws.com/track_down.js?key=${userData._id}'></script>
      `;

      // Log to the console or display it in an alert, modal, etc.
      setGeneratedScript(scriptCode);
      })
      .catch(error => {
        console.error('Error fetching domains:', error.message);
      });

      axiosClient.get('/get_conversion')
      .then(response => {
        // Update state with the received pixels
        setAvailablePixels(response.data.pixels);
      })
      .catch(error => {
        console.error('Error fetching pixels:', error.message);
      });

      axiosClient.get('/get_google_conversion')
      .then(response => {
        // Update state with the received pixels
        setAvailableGoogleId(response.data.google_id);
      })
      .catch(error => {
        console.error('Error fetching Ids:', error.message);
      });

      axiosClient.get('/get_urls')
      .then(response => {
        // Update state with the received paths
        setAvailablePaths(response.data.urls);
      })
      .catch(error => {
        console.error('Error fetching paths:', error.message);
      });
  }, []);

  const handleDomainChange = (event) => {
    const value = event.target.value;
    setDomain(value);
    setIsDomainValid(value.trim() !== ''); // Set to true if not empty
  };

  const handleWebUrlChange = (event) => {
    setWebUrl(event.target.value);
  };

  const handlePixelIdChange = (event) => {
    setPixelId(event.target.value);
  };
  const handleGoogleIdChange = (event) => {
    setGoogleId(event.target.value);
  };
  const handleSubmit = async () => {
    // Check if the required field is valid before submitting
    if (isDomainValid) {
      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        const access_token = localStorage.getItem('accessToken');
        // Make an Axios POST request
        const response = await axiosClient.post(
          '/tracking',  // Replace with your actual API endpoint
          {
            domain,
            webUrl,
            pixelId,
            googleId,
            userData,
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        // Handle the response as needed
        console.log('POST request successful:', response.data);
      } catch (error) {
        // Handle errors
        console.error('Error making POST request:', error.message);
      }
    } else {
      // Handle the case where the required field is not valid
      console.error('Domain is required.');
    }
  };

  return (
    <Fragment>
      <ContentBox className="analytics">
        <H4>Universal script</H4>
        <form>
        <TextField
            label="Select your domain"
            select
            value={domain}
            onChange={handleDomainChange}
            fullWidth
            margin="normal"
            required
            error={!isDomainValid}
            helperText={!isDomainValid ? 'Domain is required' : ''}
          >
            {availableDomains.map((domain) => (
              <MenuItem key={domain} value={domain}>
                {domain}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Select a pixel"
            value={pixelId}
            onChange={handlePixelIdChange}
            fullWidth
            margin="normal"
          >
            {availablePixels.map((pixelId) => (
              <MenuItem key={pixelId} value={pixelId}>
                {pixelId}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Select google event id"
            value={googleId}
            onChange={handleGoogleIdChange}
            fullWidth
            margin="normal"
          >
            {availableGoogleId.map((googleId) => (
              <MenuItem key={googleId} value={googleId}>
                {googleId}
              </MenuItem>
            ))}
          </TextField>
          <TextField
          label="Select Url Path"
          select
          value={webUrl}
          onChange={handleWebUrlChange}
          fullWidth
          margin="normal"
        >
          {availablePaths.map((path) => (
            <MenuItem key={path} value={path}>
              {path}
            </MenuItem>
          ))}
        </TextField>
          {/* <TextField
            label="Select Url Rule"
            value={webUrl}
            onChange={handleWebUrlChange}
            fullWidth
            margin="normal"
          /> */}
          {/* <TextField
            label="Enter access_token for conversion"
            value={accessToken}
            onChange={handleAccessTokenChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Enter pixel_id for conversion"
            value={pixelId}
            onChange={handlePixelIdChange}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Select an option"
            value={selectedOption}
            onChange={handleSelectChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="PageView">Page View</MenuItem>
            <MenuItem value="Lead">Lead</MenuItem> */}
            {/* Add more MenuItem components for additional options */}
          {/* </TextField> */}
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Add Tracking
          </Button>
        </form>
        {generatedScript && (
          <div>
            <TextareaAutosize
              rowsMin={4}
              value={generatedScript}
              readOnly
              style={{ width: '100%', marginTop: '8px' }}
            />
          </div>
        )}
      </ContentBox>
    </Fragment>
  );
};

export default Tracking;
