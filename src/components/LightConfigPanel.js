import React from 'react';
import {Box, Slider, Typography} from '@mui/material';

function LightConfigPanel({
                              lightYaw, setLightYaw,
                              lightPitch, setLightPitch,
                              specularPower, setSpecularPower,
                              normalDiffuseStrength, setNormalDiffuseStrength,
                              specularHighlightsStrength, setSpecularHighlightsStrength,
                              totalGain, setTotalGain
                          }) {

    return (
        <div>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Typography>Light Yaw</Typography>
                <Slider
                    value={lightYaw}
                    onChange={(e, newValue) => setLightYaw(newValue)}
                    step={0.1}
                    min={-180}
                    max={180}
                    valueLabelDisplay="auto"
                />
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Typography>Light Pitch</Typography>
                <Slider
                    value={lightPitch}
                    onChange={(e, newValue) => setLightPitch(newValue)}
                    step={0.1}
                    min={-90}
                    max={90}
                    valueLabelDisplay="auto"
                />
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Typography>Specular Power</Typography>
                <Slider
                    value={specularPower}
                    onChange={(e, newValue) => setSpecularPower(newValue)}
                    step={0.1}
                    min={10}
                    max={100}
                    valueLabelDisplay="auto"
                />
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Typography>Normal Diffuse Strength</Typography>
                <Slider
                    value={normalDiffuseStrength}
                    onChange={(e, newValue) => setNormalDiffuseStrength(newValue)}
                    step={0.1}
                    min={0}
                    max={5}
                    valueLabelDisplay="auto"
                />
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Typography>Specular High lights Strength</Typography>
                <Slider
                    value={specularHighlightsStrength}
                    onChange={(e, newValue) => setSpecularHighlightsStrength(newValue)}
                    step={0.1}
                    min={0}
                    max={5}
                    valueLabelDisplay="auto"
                />
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Typography>Total Gain</Typography>
                <Slider
                    value={totalGain}
                    onChange={(e, newValue) => setTotalGain(newValue)}
                    step={0.01}
                    min={0}
                    max={1}
                    valueLabelDisplay="auto"
                />
            </Box>
        </div>
    );
}

export default LightConfigPanel;