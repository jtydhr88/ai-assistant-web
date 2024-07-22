// ImageContext.js
import React, { createContext, useState, useContext } from "react";

const ImageContext = createContext();

export function useCache() {
  return useContext(ImageContext);
}

// eslint-disable-next-line react/prop-types
export const ImageProvider = ({ children }) => {
  // img2img tab
  const [img2imgInputImage, setImg2imgInputImage] = useState(null);
  const [img2imgPrompt, setImg2imgPrompt] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [img2imgOutputImage, setImg2imgOutputImage] = useState(null);

  // lineDrawing tab
  const [lineDrawingInputImage, setLineDrawingInputImage] = useState(null);
  const [lineDrawingPrompt, setLineDrawingPrompt] = useState(null);
  const [cannyImage, setCannyImage] = useState(null);
  const [lineDrawingOutputImage, setLineDrawingOutputImage] = useState(null);

  // line drawing cutout tab
  const [lineDrawingCutoutInputImage, setLineDrawingCutoutInputImage] = useState(null);
  const [lineDrawingCutoutPrompt, setLineDrawingCutoutPrompt] = useState(null);
  const [flatLineImage, setFlatLineImage] = useState(null);
  const [lineDrawingCutoutOutputImage, setLineDrawingCutoutOutputImage] = useState(null);

  // normal map tab
  const [normalMapInputImage, setNormalMapInputImage] = useState(null);
  const [normalMapPrompt, setNormalMapPrompt] = useState(null);
  const [normalMapInvertImage, setNormalMapInvertImage] = useState(null);
  const [normalMapOutputImage, setNormalMapOutputImage] = useState(null);

  // light tab
  const [lightInputImage, setLightInputImage] = useState(null);
  const [lightOutputImage, setLightOutputImage] = useState(null);

  // anime shadow tab
  const [animeShadowLineDrawingInputImage, setAnimeShadowLineDrawingInputImage] = useState(null);
  const [animeShadowShadowInputImage, setAnimeShadowShadowInputImage] = useState(null);
  const [animeShadowPrompt, setAnimeShadowPrompt] = useState(null);
  const [animeShadowInvertImage, setAnimeShadowInvertImage] = useState(null);
  const [animeShadowOutputImage, setAnimeShadowOutputImage] = useState(null);

  // color scheme tab
  const [colorSchemeInputImage, setColorSchemeInputImage] = useState(null);
  const [colorSchemePrompt, setColorSchemePrompt] = useState(null);
  const [colorSchemeInvertImage, setColorSchemeInvertImage] = useState(null);
  const [colorSchemeOutputImage, setColorSchemeOutputImage] = useState(null);

  // coloring tab
  const [coloringInputImage, setColoringInputImage] = useState(null);
  const [coloringPrompt, setColoringPrompt] = useState(null);
  const [coloringNolineImage, setColoringNolineImage] = useState(null);
  const [coloringOutputImage, setColoringOutputImage] = useState(null);

  // lineDrawing transparent tab
  const [lineDrawingTransparentInputImage, setLineDrawingTransparentInputImage] = useState(null);
  const [lineDrawingTransparentOutputImage, setLineDrawingTransparentOutputImage] = useState(null);

  // resize tab
  const [resizeInputImage, setResizeInputImage] = useState(null);
  const [resizePrompt, setResizePrompt] = useState(null);
  const [resizeOutputImage, setResizeOutputImage] = useState(null);

  // positive negative Shape tab
  const [positiveNegativeShapeInputImage, setPositiveNegativeShapeInputImage] = useState(null);
  const [positiveNegativeShapeOutputImage, setPositiveNegativeShaeOutputImage] = useState(null);

  const value = {
    img2imgInputImage,
    setImg2imgInputImage,
    img2imgPrompt,
    setImg2imgPrompt,
    maskImage,
    setMaskImage,
    img2imgOutputImage,
    setImg2imgOutputImage,

    lineDrawingInputImage,
    setLineDrawingInputImage,
    lineDrawingPrompt,
    setLineDrawingPrompt,
    cannyImage,
    setCannyImage,
    lineDrawingOutputImage,
    setLineDrawingOutputImage,

    lineDrawingCutoutInputImage,
    setLineDrawingCutoutInputImage,
    lineDrawingCutoutPrompt,
    setLineDrawingCutoutPrompt,
    flatLineImage,
    setFlatLineImage,
    lineDrawingCutoutOutputImage,
    setLineDrawingCutoutOutputImage,

    normalMapInputImage,
    setNormalMapInputImage,
    normalMapPrompt,
    setNormalMapPrompt,
    normalMapInvertImage,
    setNormalMapInvertImage,
    normalMapOutputImage,
    setNormalMapOutputImage,

    lightInputImage,
    setLightInputImage,
    lightOutputImage,
    setLightOutputImage,

    animeShadowLineDrawingInputImage,
    setAnimeShadowLineDrawingInputImage,
    animeShadowPrompt,
    setAnimeShadowPrompt,
    animeShadowShadowInputImage,
    setAnimeShadowShadowInputImage,
    animeShadowInvertImage,
    setAnimeShadowInvertImage,
    animeShadowOutputImage,
    setAnimeShadowOutputImage,

    colorSchemeInputImage,
    setColorSchemeInputImage,
    colorSchemePrompt,
    setColorSchemePrompt,
    colorSchemeInvertImage,
    setColorSchemeInvertImage,
    colorSchemeOutputImage,
    setColorSchemeOutputImage,

    lineDrawingTransparentInputImage,
    setLineDrawingTransparentInputImage,
    lineDrawingTransparentOutputImage,
    setLineDrawingTransparentOutputImage,

    resizeInputImage,
    setResizeInputImage,
    resizePrompt,
    setResizePrompt,
    resizeOutputImage,
    setResizeOutputImage,

    coloringInputImage,
    setColoringInputImage,
    coloringNolineImage,
    setColoringNolineImage,
    coloringOutputImage,
    setColoringOutputImage,
    coloringPrompt,
    setColoringPrompt,

    positiveNegativeShapeInputImage,
    setPositiveNegativeShapeInputImage,
    positiveNegativeShapeOutputImage,
    setPositiveNegativeShaeOutputImage,
  };

  return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
};
