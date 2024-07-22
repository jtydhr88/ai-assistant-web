/*
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Sections components
import BaseLayout from "layouts/sections/components/BaseLayout";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import InputPanel from "../../../../components/InputPanel";
import Card from "@mui/material/Card";
import PromptAnalyzer from "../../../../components/PromptAnalyzer";
import OutputPanel from "../../../../components/OutputPanel";
import ProgressIndicator from "../../../../components/ProgressIndicator";
import { processNoline, sendRequest } from "../../../../utils/RequestApi";
import { handleImageChange, prepareImage } from "../../../../utils/ImgUtils";
import { executePrompt, removeColor, removeDuplicates } from "../../../../utils/PromptUtils";
import { CardContent } from "@mui/material";
import { useCache } from "../../../../ImageContext";
import { postGenerateError, updateGenerateStatus } from "../../../../utils/GenerateStatus";
import useGenerateProgress from "../../../../components/useGenerateProgress";
import ColoringConfigPanel from "../../../../components/ColoringConfigPanel";
import { useIntl } from "react-intl";
import {
  getDefaultControlUnitPayload,
  getDefaultImg2ImgPayload,
} from "../../../../utils/PayloadUtils";
import GenerateButtonsPanel from "../../../../components/GenerateButtonsPanel";

function Coloring() {
  const {
    coloringInputImage,
    setColoringInputImage,
    coloringNolineImage,
    setColoringNolineImage,
    coloringOutputImage,
    setColoringOutputImage,
    coloringPrompt,
    setColoringPrompt,
    setImg2imgPrompt,
    setLineartPrompt,
    setLineDrawingCutoutPrompt,
    setNormalMapPrompt,
    setAnimeShadowPrompt,
    setColorSchemePrompt,
  } = useCache();
  const intl = useIntl();
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [negativePrompt, setNegativePrompt] = useState(
    "lowres, error, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, blurry"
  );

  const [imageFidelity, setImageFidelity] = useState(0.4);
  const [coloringType, setColoringType] = useState("watercolor");

  const {
    isGenerating,
    setIsGenerating,
    generateButtonText,
    setGenerateButtonText,
    progressData,
    isInterruptable,
    setIsInterruptable,
  } = useGenerateProgress();

  useEffect(() => {
    if (coloringInputImage) {
      handleImageChange(
        coloringInputImage,
        setColoringInputImage,
        setWidth,
        setHeight,
        processNoline,
        setColoringNolineImage,
        postGenerateError
      );
    }
  }, [coloringInputImage]);

  function postGenerateSuccess(data) {
    const base64Image = data.images[0];
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
    setColoringOutputImage(imageSrc);

    updateGenerateStatus(
      false,
      setIsGenerating,
      intl.formatMessage({ id: "generate", defaultMessage: "Generate" }),
      setGenerateButtonText,
      "Generate success"
    );
  }

  const handleGenerate = () => {
    if (!coloringInputImage) {
      alert("Please upload an image first.");
      return;
    }

    setIsGenerating(true);
    setGenerateButtonText(
      intl.formatMessage({ id: "generating", defaultMessage: "Generating..." })
    );

    console.log("Generating...");

    let prePrompt = "masterpiece, best quality, ";

    if (coloringType === "watercolor") {
      prePrompt = prePrompt + "(painting, watercolor:1.4), <lora:suisai01:1.1>, ";
    } else if (coloringType === "thick-coating") {
      prePrompt = prePrompt + "<lora:atunuri02:1>,";
    } else if (coloringType === "anime-coloring") {
      prePrompt = prePrompt + "<lora:animenuri:1.0>,";
    }

    let finalPrompt = prePrompt + coloringPrompt;

    const executeTags = ["flat color", "transparent background"];

    finalPrompt = executePrompt(executeTags, finalPrompt);
    finalPrompt = removeDuplicates(finalPrompt);
    finalPrompt = removeColor(finalPrompt);

    const finalNegePrompt = "(flat color:1.2), " + negativePrompt;

    const cn_args = getDefaultControlUnitPayload();

    cn_args["image"] = prepareImage(coloringInputImage);
    cn_args["weight"] = 1.25;
    cn_args["model"] = "Kataragi_lineartXL-lora128 [0598262f]";
    cn_args["module"] = "lineart_realistic";

    const encoded_base = prepareImage(coloringNolineImage);

    const payload = getDefaultImg2ImgPayload();

    payload["init_images"] = [encoded_base];
    payload["denoising_strength"] = 1.0 - imageFidelity;
    payload["prompt"] = finalPrompt;
    payload["negative_prompt"] = finalNegePrompt;
    payload["width"] = width;
    payload["height"] = height;

    payload["alwayson_scripts"] = { ControlNet: { args: [cn_args] } };

    sendRequest(
      "http://127.0.0.1:7861/sdapi/v1/img2img",
      "POST",
      payload,
      postGenerateSuccess,
      postGenerateError,
      setIsGenerating,
      setGenerateButtonText
    );
  };

  return (
    <BaseLayout
      title={intl.formatMessage({ id: "coloring", defaultMessage: "Coloring" })}
      breadcrumb={[
        {
          label: intl.formatMessage({ id: "color", defaultMessage: "Color" }),
          route: "/sections/page-sections/coloring",
        },
        { label: intl.formatMessage({ id: "coloring", defaultMessage: "Coloring" }) },
      ]}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <InputPanel
                      inputImage={coloringInputImage}
                      handleImageChange={handleImageChange}
                      setInputImage={setColoringInputImage}
                      setHeight={setHeight}
                      setWidth={setWidth}
                      postProcess={processNoline}
                      postProcessSuccess={setColoringNolineImage}
                      postProcessError={postGenerateError}
                      label="color-input-image"
                    />
                  </Grid>
                  <Grid item xs={6}></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <PromptAnalyzer
                  inputImage={coloringInputImage}
                  prompt={coloringPrompt}
                  setPrompt={setColoringPrompt}
                  negativePrompt={negativePrompt}
                  setNegativePrompt={setNegativePrompt}
                  allPromptSetters={[
                    setImg2imgPrompt,
                    setLineartPrompt,
                    setLineDrawingCutoutPrompt,
                    setNormalMapPrompt,
                    setAnimeShadowPrompt,
                    setColorSchemePrompt,
                    setColoringPrompt,
                  ]}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <ColoringConfigPanel
                  imageFidelity={imageFidelity}
                  setImageFidelity={setImageFidelity}
                  coloringType={coloringType}
                  setColoringType={setColoringType}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <GenerateButtonsPanel
                  isGenerating={isGenerating}
                  setIsGenerating={setIsGenerating}
                  handleGenerate={handleGenerate}
                  generateButtonText={generateButtonText}
                  isInterruptable={isInterruptable}
                  setIsInterruptable={setIsInterruptable}
                />
                <ProgressIndicator
                  progress={progressData.progress}
                  currentStep={progressData.sampling_step}
                  totalSteps={progressData.sampling_steps}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <OutputPanel outputImage={coloringOutputImage} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </BaseLayout>
  );
}

export default Coloring;
