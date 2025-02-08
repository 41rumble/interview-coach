import React, { useState } from 'react';
import { Box, Container, Switch, FormControlLabel, Typography } from '@mui/material';
import InterviewCoach from './components/InterviewCoach2';
import './App.css';

function App() {
  const [showMarkers, setShowMarkers] = useState(true);
  const [showFaceMesh, setShowFaceMesh] = useState(true);


  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Interview Coach AI
          </Typography>
          
          <Box>
            <FormControlLabel
              control={<Switch checked={showMarkers} onChange={(e) => setShowMarkers(e.target.checked)} />}
              label="Show All Markers"
            />
            <FormControlLabel
              control={<Switch checked={showFaceMesh} onChange={(e) => setShowFaceMesh(e.target.checked)} />}
              label="Face Mesh"
            />

          </Box>
        </Box>

        <InterviewCoach
          showMarkers={showMarkers}
          showFaceMesh={showFaceMesh && showMarkers}
        />
      </Box>
    </Container>
  );
}

export default App;
