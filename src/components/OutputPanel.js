import React from 'react';
import {Box, Typography, Button} from '@mui/material';

function OutputPanel({outputImage}) {

    const handleDownloadImage = () => {
        console.log("Downloading image...");

        const link = document.createElement('a');
        link.href = outputImage;
        link.download = 'output-image.jpeg';  // 设置下载的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <Typography variant="h6">Output Image</Typography>
            {outputImage &&
                <img src={outputImage} alt="Output" style={{width: '300px', height: 'auto'}}/>}
            <Button variant="contained" onClick={handleDownloadImage}>Download</Button>
            <Button variant="contained">Transfer to Lineart Tab</Button>
        </Box>
    );
}

export default OutputPanel;