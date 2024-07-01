// ImageContext.js
import React, {createContext, useState, useContext} from 'react';

const ImageContext = createContext();

export function useImages() {
    return useContext(ImageContext);
}

export const ImageProvider = ({children}) => {
    // img2img tab
    const [img2imgInputImage, setImg2imgInputImage] = useState(null);
    const [maskImage, setMaskImage] = useState(null);
    const [img2imgOutputImage, setImg2imgOutputImage] = useState(null);

    // lineart tab
    const [lineartInputImage, setLineartInputImage] = useState(null);
    const [cannyImage, setCannyImage] = useState(null);
    const [lineartOutputImage, setLineartOutputImage] = useState(null);

    // line drawing cutout tab
    const [lineDrawingCutoutInputImage, setLineDrawingCutoutInputImage] = useState(null);
    const [flatLineImage, setFlatLineImage] = useState(null);
    const [lineDrawingCutoutOutputImage, setLineDrawingCutoutOutputImage] = useState(null);

    // normal map tab
    const [normalMapInputImage, setNormalMapInputImage] = useState(null);
    const [normalMapInvertImage, setNormalMapInvertImage] = useState(null);
    const [normalMapOutputImage, setNormalMapOutputImage] = useState(null);

    // light tab
    const [lightInputImage, setLightInputImage] = useState(null);
    const [lightOutputImage, setLightOutputImage] = useState(null);

    // anime shadow tab
    const [animeShadowLineartInputImage, setAnimeShadowLineartInputImage] = useState(null);
    const [animeShadowShadowInputImage, setAnimeShadowShadowInputImage] = useState(null);
    const [animeShadowInvertImage, setAnimeShadowInvertImage] = useState(null);
    const [animeShadowOutputImage, setAnimeShadowOutputImage] = useState(null);


    const value = {
        img2imgInputImage,
        setImg2imgInputImage,
        maskImage,
        setMaskImage,
        img2imgOutputImage,
        setImg2imgOutputImage,

        lineartInputImage,
        setLineartInputImage,
        cannyImage,
        setCannyImage,
        lineartOutputImage,
        setLineartOutputImage,

        lineDrawingCutoutInputImage, setLineDrawingCutoutInputImage,
        flatLineImage, setFlatLineImage,
        lineDrawingCutoutOutputImage, setLineDrawingCutoutOutputImage,

        normalMapInputImage, setNormalMapInputImage,
        normalMapInvertImage, setNormalMapInvertImage,
        normalMapOutputImage, setNormalMapOutputImage,

        lightInputImage, setLightInputImage,
        lightOutputImage, setLightOutputImage,

        animeShadowLineartInputImage, setAnimeShadowLineartInputImage,
        animeShadowShadowInputImage, setAnimeShadowShadowInputImage,
        animeShadowInvertImage, setAnimeShadowInvertImage,
        animeShadowOutputImage, setAnimeShadowOutputImage
    };

    return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
};
