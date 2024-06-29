import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import Img2ImgTab from './tabs/Img2ImgTab';
import LineartTab from './tabs/LineartTab';
import NormalMapTab from './tabs/NormalMapTab';
import LightTab from './tabs/LightTab';
import AnimeShadowTab from './tabs/AnimeShadowTab';
import LineDrawingCutoutTab from "./tabs/LineDrawingCutoutTab";



function App() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="img2img" />
                    <Tab label="Lineart" />
                    <Tab label="LineDrawingCutoutTab" />
                    <Tab label="Normal Map" />
                    <Tab label="Light" />
                    <Tab label="Anime Shadow" />
                </Tabs>
            </Box>
            {value === 0 && <Img2ImgTab />}
            {value === 1 && <LineartTab />}
            {value === 2 && <LineDrawingCutoutTab />}
            {value === 3 && <NormalMapTab />}
            {value === 4 && <LightTab />}
            {value === 5 && <AnimeShadowTab />}
        </Box>
    );
}

export default App;
