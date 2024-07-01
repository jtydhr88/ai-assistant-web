import React from 'react';
import {Box, Slider, Typography} from '@mui/material';

function Img2ImgConfigPanel({imageFidelity, setImageFidelity, anytestFidelity, setAnytestFidelity}) {

    return (
        <div>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Typography>Image Fidelity</Typography>
                <Slider
                    value={imageFidelity}
                    onChange={(e, newValue) => setImageFidelity(newValue)}
                    step={0.01}
                    min={0}
                    max={1}
                    valueLabelDisplay="auto"
                />
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Typography>Anytest Fidelity</Typography>
                <Slider
                    value={anytestFidelity}
                    onChange={(e, newValue) => setAnytestFidelity(newValue)}
                    step={0.01}
                    min={0.35}
                    max={1.25}
                    valueLabelDisplay="auto"
                />
            </Box>
        </div>
    );
}

export default Img2ImgConfigPanel;