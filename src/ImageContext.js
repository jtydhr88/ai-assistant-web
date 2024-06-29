// ImageContext.js
import React, {createContext, useState, useContext} from 'react';

const ImageContext = createContext();

export function useImages() {
    return useContext(ImageContext);
}

export const ImageProvider = ({children}) => {
    // img2img tab
    const [img2imgInputImage, setImg2imgInputImage] = useState(null);
    const [img2imgInputImageBase64, setImg2imgInputImageBase64] = useState(null);
    const [maskImage, setMaskImage] = useState(null);
    const [maskImageBase64, setMaskImageBase64] = useState(null);
    const [img2imgOutputImage, setImg2imgOutputImage] = useState(null);

    // lineart tab
    const [lineartInputImage, setLineartInputImage] = useState(null);
    const [lineartInputImageBase64, setLineartInputImageBase64] = useState(null);
    const [cannyImage, setCannyImage] = useState(null);
    const [cannyImageBase64, setCannyImageBase64] = useState(null);
    const [lineartOutputImage, setLineartOutputImage] = useState(null);

    // lineart tab
    const [lineDrawingCutoutInputImage, setLineDrawingCutoutInputImage] = useState(null);
    const [lineDrawingCutoutInputImageBase64, setLineDrawingCutoutInputImageBase64] = useState(null);
    const [flatLineImage, setFlatLineImage] = useState(null);
    const [flatLineImageBase64, setFlatLineImageBase64] = useState(null);
    const [lineDrawingCutoutOutputImage, setLineDrawingCutoutOutputImage] = useState(null);

    const [normalMapInputImage, setNormalMapInputImage] = useState(null);
    const [normalMapInputImageBase64, setNormalMapInputImageBase64] = useState(null);
    const [invertImage, setInvertImage] = useState(null);
    const [invertImageBase64, setInvertImageBase64] = useState(null);
    const [normalMapOutputImage, setNormalMapOutputImage] = useState(null);


    const value = {
        img2imgInputImage,
        setImg2imgInputImage,
        img2imgInputImageBase64,
        setImg2imgInputImageBase64,
        maskImage,
        setMaskImage,
        maskImageBase64,
        setMaskImageBase64,
        img2imgOutputImage,
        setImg2imgOutputImage,

        lineartInputImage,
        setLineartInputImage,
        lineartInputImageBase64,
        setLineartInputImageBase64,
        cannyImage,
        setCannyImage,
        cannyImageBase64,
        setCannyImageBase64,
        lineartOutputImage,
        setLineartOutputImage,

        lineDrawingCutoutInputImage, setLineDrawingCutoutInputImage,
        lineDrawingCutoutInputImageBase64, setLineDrawingCutoutInputImageBase64,
        flatLineImage, setFlatLineImage,
        flatLineImageBase64, setFlatLineImageBase64,
        lineDrawingCutoutOutputImage, setLineDrawingCutoutOutputImage,

        normalMapInputImage, setNormalMapInputImage,
        normalMapInputImageBase64, setNormalMapInputImageBase64,
        invertImage, setInvertImage,
        invertImageBase64, setInvertImageBase64,
        normalMapOutputImage, setNormalMapOutputImage,
    };

    return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
};
