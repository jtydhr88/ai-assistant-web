import React from 'react';
import {Box, Slider, Typography} from '@mui/material';

function LineartConfigPanel({linearFidelity, setLinearFidelity, linearBold, setLinearBold}) {

    return (
        <div>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Typography>Linear Fidelity</Typography>
                <Slider
                    value={linearFidelity}
                    onChange={(e, newValue) => setLinearFidelity(newValue)}
                    step={0.01}
                    min={0.5}
                    max={1.25}
                    valueLabelDisplay="auto"
                />
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Typography>Linear Bold</Typography>
                <Slider
                    value={linearBold}
                    onChange={(e, newValue) => setLinearBold(newValue)}
                    step={0.01}
                    min={0}
                    max={1}
                    valueLabelDisplay="auto"
                />
            </Box>
        </div>
    );
}

export default LineartConfigPanel;