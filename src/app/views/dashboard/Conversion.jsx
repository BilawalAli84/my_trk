import React, { useState, Fragment } from 'react';
import { Button, styled, useTheme } from '@mui/material';
import FacebookConversion from './FacebookConversion'; // Import the FacebookConversion component
import GoogleConversion from './GoogleConversion'; // Import the GoogleConversion component

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

const ButtonContainer = styled('div')({
  display: 'flex',
  gap: '16px', // Adjust the spacing as needed
  marginBottom: '16px',
});

const Conversion = () => {
  const { palette } = useTheme();
  const [selectedSection, setSelectedSection] = useState('facebook');

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  return (
    <Fragment>
      <ContentBox className="analytics">
        <ButtonContainer>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSectionChange('facebook')}
            disabled={selectedSection === 'facebook'}
          >
            Add Facebook Conversion
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSectionChange('google')}
            disabled={selectedSection === 'google'}
          >
            Add Google Conversion
          </Button>
        </ButtonContainer>
        <div>
          {selectedSection === 'facebook' && <FacebookConversion />}
          {selectedSection === 'google' && <GoogleConversion />}
        </div>
      </ContentBox>
    </Fragment>
  );
};

export default Conversion;
