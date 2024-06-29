import React from 'react';
import {Typography} from '@mui/material';

function InputPanel({inputImage, setInputImage, setWidth, setHeight, postProcess}) {

    const handleImageChange = (event, setImage, setWidth, setHeight) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);

                if (postProcess) {
                    postProcess(reader.result);
                }

                const img = new Image();

                img.onload = () => {
                    console.log("Width:", img.width, "Height:", img.height);
                    setWidth(img.width);

                    setHeight(img.height);
                };

                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{width: '50%'}}>
            <Typography variant="h6">Input Image</Typography>
            <input
                type="file"
                onChange={(e) => handleImageChange(e, setInputImage, setWidth, setHeight)}
                style={{display: 'block', marginBottom: 8}}
            />
            {inputImage &&
                <img src={inputImage} alt="Input" style={{width: '100%', height: 'auto'}}/>}
        </div>
    );
}

export default InputPanel;