import React, { useEffect, useState } from 'react';
import { styled,MenuItem, TextField, } from '@mui/material';
import axiosClient from 'axios.js';
import { Fragment } from 'react';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
} from "reactstrap";

const itemsPerPage = 10;
const cardStyle = {
  border: '1px solid #dddddd',
  backgroundColor: '#f2f2f2',
  margin: '0 auto',
  width: '80%',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const tableStyle = {
  borderCollapse: 'collapse',
  width: '100%',
  margin: '0 auto',
};
const ContentBox = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
}));
const thStyle = {
  borderBottom: '1px solid #dddddd',
  textAlign: 'left',
  padding: '12px',
  backgroundColor: '#f2f2f2',
  fontWeight: 'bold',
};

const tdStyle = {
  borderBottom: '1px solid #dddddd',
  textAlign: 'left',
  padding: '12px',
};

const trEvenStyle = {
  backgroundColor: '#f2f2f2',
};

const H4 = styled('h4')(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: '500',
  marginBottom: '16px',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
}));

const PaginationButtons = styled(Button)({
  marginLeft: '8px',
  backgroundColor: '#007bff',
  borderColor: '#007bff',
  '&:hover': {
    backgroundColor: '#0056b3',
    borderColor: '#0056b3',
  },
  '& .MuiButton-label': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [data, setData] = useState([]);
  const [tagNames, setTagNames] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [tagData, setTagData] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const access_token = localStorage.getItem('accessToken');
        const response = await fetch(`https://tracking-backend-sooty.vercel.app/track_down/unique_optins?page=${currentPage}&perPage=${itemsPerPage}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
  
        if (response.ok) {
          const jsonData = await response.json();
          setData(jsonData.uniqueRows);
          setTotalRows(jsonData.totalRows);
        } else {
          console.error('Failed to fetch data from the API');
        }
      } catch (error) {
        console.error('Error while fetching data:', error);
      }
    };
  
    fetchData();
    axiosClient.get('/get_tags')
      .then(response => {
        // Update state with the received pixels
        setAvailableTags(response.data.tags);
      })
      .catch(error => {
        console.error('Error fetching pixels:', error.message);
      });
  }, [currentPage]);

  const totalPages = Math.ceil(totalRows / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  const handleNextPage2 = () => {
    setCurrentPage2((prevPage) => prevPage + 1);
  };

  const handlePrevPage2 = () => {
    setCurrentPage2((prevPage) => prevPage - 1);
  };
  const handleTagNameChange = async (event) => {
    const selectedTagName = event.target.value;
    setTagNames(selectedTagName);

    try {
      const access_token = localStorage.getItem('accessToken');
      const response = await fetch(`https://tracking-backend-sooty.vercel.app/track_down/get_tag_data?tagName=${selectedTagName}&page=${currentPage2}&perPage=${itemsPerPage}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (response.ok) {
        const jsonData = await response.json();
        console.log(jsonData);
        setTagData(jsonData.uniqueRows);
      } else {
        console.error('Failed to fetch tag data from the API');
      }
    } catch (error) {
      console.error('Error while fetching tag data:', error);
    }
  };
  return (
    <>
      <div className="content">
      <Fragment>
          <ContentBox className="analytics">
        <H4>Your Reporting Data</H4>
        <Card style={cardStyle}>
          <CardHeader />
          <CardBody>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>UTM Source</th>
                  <th style={thStyle}>UTM Term</th>
                  <th style={thStyle}>Source Url</th>
                </tr>
              </thead>
              <tbody>
                {data.map((customer, index) => (
                  <tr key={index} style={index % 2 === 0 ? trEvenStyle : null}>
                    <td style={tdStyle}>{customer.tracked_date}</td>
                    <td style={tdStyle}>{customer.email_input}</td>
                    <td style={tdStyle}>{customer.utm_source}</td>
                    <td style={tdStyle}>{customer.utm_term}</td>
                    <td style={tdStyle}>{customer.current_url}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <PaginationButtons
                color="primary"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <NavigateBeforeIcon />
              </PaginationButtons>{' '}
              <PaginationButtons
                color="primary"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <NavigateNextIcon />
              </PaginationButtons>
            </div>
          </CardBody>
        </Card>
            <TextField
                select
                label="Select a Tag"
                value={tagNames}
                onChange={handleTagNameChange}
                fullWidth
                margin="normal"
              >
                {availableTags.map((tagNames) => (
                  <MenuItem key={tagNames} value={tagNames}>
                    {tagNames}
                  </MenuItem>
                ))}
              </TextField>
              <H4>Tag Data</H4>
            <Card style={cardStyle}>
              <CardHeader />
              <CardBody>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      {/* Define headers based on your tag data structure */}
                      <th style={thStyle}>Date</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>UTM Source</th>
                      <th style={thStyle}>UTM Term</th>
                      <th style={thStyle}>Source Url</th>
                      {/* ... Add more columns as needed */}
                    </tr>
                  </thead>
                  <tbody>
                    {tagData.map((tagItem, index) => (
                      <tr key={index} style={index % 2 === 0 ? trEvenStyle : null}>
                        {/* Map tag data to table cells */}
                        <td style={tdStyle}>{tagItem.tracked_date}</td>
                        <td style={tdStyle}>{tagItem.email_input}</td>
                        <td style={tdStyle}>{tagItem.utm_source}</td>
                        <td style={tdStyle}>{tagItem.utm_term}</td>
                        <td style={tdStyle}>{tagItem.current_url}</td>
                        {/* ... Map more columns as needed */}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <PaginationButtons
                color="primary"
                onClick={handlePrevPage2}
                disabled={currentPage2 === 1}
              >
                <NavigateBeforeIcon />
              </PaginationButtons>{' '}
              <PaginationButtons
                color="primary"
                onClick={handleNextPage2}
                disabled={currentPage2 === totalPages}
              >
                <NavigateNextIcon />
              </PaginationButtons>
            </div>
              </CardBody>
            </Card>

            </ContentBox>
        </Fragment>
      </div>
    </>
  );
}

export default Dashboard;
