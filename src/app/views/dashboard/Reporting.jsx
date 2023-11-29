import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material';
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
  const [totalRows, setTotalRows] = useState(0);
  const [data, setData] = useState([]);

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
  }, [currentPage]);

  const totalPages = Math.ceil(totalRows / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <>
      <div className="content">
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
      </div>
    </>
  );
}

export default Dashboard;
