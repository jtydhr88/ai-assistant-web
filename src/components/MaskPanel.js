import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import {processMaskImage} from "../utils/OpenCVUtils";

function MaskPanel({inputImage, maskImage, setMaskImage, handleMaskImageChange, cv}) {

    function createMask(event, cv, inputImage, setMaskImage) {
        if (!inputImage) {
            alert('Please upload an image first.');
            return;
        }

        const imgElement = document.createElement('img');
        imgElement.src = inputImage;

        imgElement.onload = () => {
            processMaskImage(cv, imgElement).then(dataUrl => {
                setMaskImage(dataUrl);
            });
        };
    }

    return (
        <div>
            <Typography variant="h6">Mask Image</Typography>
            <input
                type="file"
                onChange={(e) => handleMaskImageChange(e, setMaskImage)}
                style={{display: 'block', marginBottom: 8}}
            />
            {maskImage && <img src={maskImage} alt="Mask" style={{width: '100%', height: 'auto'}}/>}
            <Box sx={{display: 'flex', justifyContent: 'space-between', marginTop: 1}}>
                <Button variant="outlined"
                        onClick={(e) => createMask(e, cv, inputImage, setMaskImage)}>Create</Button>
            </Box>
        </div>
    );
}

export default MaskPanel;