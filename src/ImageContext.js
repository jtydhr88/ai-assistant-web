// ImageContext.js
import React, { createContext, useState, useContext } from 'react';

const ImageContext = createContext();

export function useImages() {
    return useContext(ImageContext);
}

export const ImageProvider = ({ children }) => {
    const [inputImage, setInputImage] = useState(null);
    const [inputImageBase64, setInputImageBase64] = useState(null);
    const [maskImage, setMaskImage] = useState(null);
    const [outputImage, setOutputImage] = useState(null);

    const value = {
        inputImage,
        setInputImage,
        inputImageBase64,
        setInputImageBase64,
        maskImage,
        setMaskImage,
        outputImage,
        setOutputImage
    };

    return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
};
