import { useState } from 'react';
import { Button, TextField, MenuItem, styled, useTheme } from '@mui/material';
import axiosClient from 'axios.js';
import { Fragment } from 'react';
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

const UrlRules = () => {
  const { palette } = useTheme();
  const [domain, setDomain] = useState('');
  const [isDomainValid, setIsDomainValid] = useState(true);
  const [urlPath, setUrlPath] = useState('');
  const [eventToFire, setEventToFire] = useState('');
  // const [googleEventToFire, setGoogleEventToFire] = useState('');
  const [tags, setTags] = useState('');

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };
  const handleDomainChange = (event) => {
    const value = event.target.value;
    setDomain(value);
    setIsDomainValid(/^https?:\/\/[^\/]+\..+$/.test(value.trim()));
  };

  const handleUrlPathChange = (event) => {
    setUrlPath(event.target.value);
  };

  const handleEventToFireChange = (event) => {
    setEventToFire(event.target.value);
  };
  // const handleGoogleEventToFireChange = (event) => {
  //   setGoogleEventToFire(event.target.value);
  // };

  const handleSubmit = async () => {
    // Check if the required fields are valid before submitting
    if (isDomainValid && urlPath && eventToFire) {
      try {
        // Make an Axios POST request to the /url_rules endpoint
        const response = await axiosClient.post(
          '/url_rules',
          {
            urlPath,
            eventToFire,
            tags,
            // googleEventToFire,
          }
        );

        // Show success notification
        toast.success('URL rule registered successfully!', {
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
        toast.error('Failed to register URL rule. Please try again.', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      // Handle the case where any of the required fields are not valid
      console.error('Invalid input. Please fill in all the required fields.');

      // Show validation error notification
      toast.error('Invalid input. Please fill in all the required fields.', {
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
        <H4>URL Rules Set-Up</H4>
        <form>
          <TextField
            label="Enter URL Path"
            value={urlPath}
            onChange={handleUrlPathChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            select
            label="Select Facebook Event to Fire"
            value={eventToFire}
            onChange={handleEventToFireChange}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="PageView">Page View</MenuItem>
            <MenuItem value="Lead">Click</MenuItem>
            <MenuItem value="Purchase">Purchase</MenuItem>
            <MenuItem value="Schedule">Schedule</MenuItem>

            {/* Add more MenuItem components for additional options */}
          </TextField>
          {/* <TextField
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
          </TextField> */}
          <TextField
          label="Enter Tags (Optional)"
          value={tags}
          onChange={handleTagsChange}
          fullWidth
          margin="normal"
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
          theme="dark"
        />
      </ContentBox>
    </Fragment>
  );
};

export default UrlRules;
