import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';

function ProgressIndicator({ progress, currentStep, totalSteps }) {
    const normalizedProgress = progress * 100;

    return (
        <Box sx={{ width: '100%', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">{`Step ${currentStep} of ${totalSteps}`}</Typography>
            <LinearProgress variant="determinate" value={normalizedProgress} />
        </Box>
    );
}

export default ProgressIndicator;