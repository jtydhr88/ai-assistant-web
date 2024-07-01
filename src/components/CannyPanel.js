import React, {useState} from 'react';
import {Box, Button, Slider, Typography} from '@mui/material';
import {processCannyImage} from "../utils/OpenCVUtils";

function CannyPanel({cv, inputImage, cannyImage, setCannyImage}) {

    const [cannyThreshold1, setCannyThreshold1] = useState(20);
    const [cannyThreshold2, setCannyThreshold2] = useState(120);

    function createCanny(event, cv, cannyThreshold1, cannyThreshold2) {
        if (!inputImage) {
            alert('Please upload an image first.');
            return;
        }

        const imgElement = document.createElement('img');
        imgElement.src = inputImage;

        imgElement.onload = () => {
            processCannyImage(cv, imgElement, cannyThreshold1, cannyThreshold2).then(dataUrl => {
                setCannyImage(dataUrl);
            });
        };
    }
    return (
        <div>
            <div>
                <Typography variant="h6">Canny Image</Typography>
                {cannyImage && <img src={cannyImage} alt="Canny" style={{width: '100%', height: 'auto'}}/>}
                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <Typography>Canny Threshold1</Typography>
                    <Slider
                        value={cannyThreshold1}
                        onChange={(e, newValue) => setCannyThreshold1(newValue)}
                        step={1}
                        min={0}
                        max={253}
                        valueLabelDisplay="auto"
                    />
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <Typography>Canny Threshold2</Typography>
                    <Slider
                        value={cannyThreshold2}
                        onChange={(e, newValue) => setCannyThreshold2(newValue)}
                        step={1}
                        min={0}
                        max={254}
                        valueLabelDisplay="auto"
                    />
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', marginTop: 1}}>
                    <Button variant="outlined"
                            onClick={(e) => createCanny(e, cv, cannyThreshold1, cannyThreshold2)}>Create</Button>
                </Box>
            </div>
        </div>
    );
}

export default CannyPanel;