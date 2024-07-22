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
import { processInvert, sendRequest } from "../../../../utils/RequestApi";
import { handleImageChange, prepareImage } from "../../../../utils/ImgUtils";
import { executePrompt, removeColor, removeDuplicates } from "../../../../utils/PromptUtils";
import { CardContent } from "@mui/material";
import AnimeShadowConfigPanel from "../../../../components/AnimeShadowConfigPanel";
import { useCache } from "../../../../ImageContext";
import { postGenerateError, updateGenerateStatus } from "../../../../utils/GenerateStatus";
import useGenerateProgress from "../../../../components/useGenerateProgress";
import { useIntl } from "react-intl";
import {
  getDefaultControlUnitPayload,
  getDefaultImg2ImgPayload,
} from "../../../../utils/PayloadUtils";
import GenerateButtonsPanel from "../../../../components/GenerateButtonsPanel";

function AnimeShadow() {
  const {
    animeShadowLineDrawingInputImage,
    setAnimeShadowLineDrawingInputImage,
    animeShadowShadowInputImage,
    setAnimeShadowShadowInputImage,
    animeShadowInvertImage,
    setAnimeShadowInvertImage,
    animeShadowOutputImage,
    setAnimeShadowOutputImage,
    animeShadowPrompt,
    setImg2imgPrompt,
    setLineDrawingPrompt,
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

  const [animeShadowType, setAnimeShadowType] = useState("anime01");
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
    if (animeShadowLineDrawingInputImage) {
      handleImageChange(
        animeShadowLineDrawingInputImage,
        setAnimeShadowLineDrawingInputImage,
        setWidth,
        setHeight,
        processInvert,
        setAnimeShadowInvertImage,
        postGenerateError
      );
    }
  }, [animeShadowLineDrawingInputImage]);

  useEffect(() => {
    if (animeShadowShadowInputImage) {
      handleImageChange(
        animeShadowShadowInputImage,
        setAnimeShadowShadowInputImage,
        setWidth,
        setHeight
      );
    }
  }, [animeShadowShadowInputImage]);

  function postGenerateSuccess() {
    const lineDrawing_fidelity = 1.0;

    const unit1 = getDefaultControlUnitPayload();

    unit1["image"] = prepareImage(animeShadowLineDrawingInputImage);
    unit1["weight"] = 0.5;
    unit1["model"] = "controlnet852AClone_v10 [808807b2]";
    unit1["guidance_start"] = 0;
    unit1["guidance_end"] = 0.35;
    unit1["module"] = "blur_gaussian";
    unit1["threshold_a"] = 0.9;

    const unit2 = getDefaultControlUnitPayload();

    unit2["image"] = prepareImage(animeShadowInvertImage);
    unit2["weight"] = lineDrawing_fidelity;
    unit2["model"] = "Kataragi_lineartXL-lora128 [0598262f]";

    const imageFidelity = 1.0;

    const encoded_base = prepareImage(animeShadowShadowInputImage);

    let finalPrompt =
      "masterpiece, best quality, <lora:" +
      animeShadowType +
      ":1>, monochrome, greyscale, " +
      animeShadowPrompt;

    const executeTags = ["lineart", "sketch", "transparent background"];

    finalPrompt = executePrompt(executeTags, finalPrompt);
    finalPrompt = removeDuplicates(finalPrompt);
    finalPrompt = removeColor(finalPrompt);

    const payload = getDefaultImg2ImgPayload();

    payload["init_images"] = [encoded_base];
    payload["denoising_strength"] = imageFidelity;
    payload["prompt"] = finalPrompt;
    payload["negative_prompt"] = negativePrompt;
    payload["width"] = width;
    payload["height"] = height;

    payload["alwayson_scripts"] = { ControlNet: { args: [unit1, unit2] } };

    sendRequest(
      "http://127.0.0.1:7861/sdapi/v1/img2img",
      "POST",
      payload,
      postGenerateSuccess2,
      postGenerateError,
      setIsGenerating,
      setGenerateButtonText
    );
  }

  function postGenerateSuccess2(data) {
    const base64Image = data.images[0];
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;

    setAnimeShadowOutputImage(imageSrc);

    updateGenerateStatus(
      false,
      setIsGenerating,
      intl.formatMessage({ id: "generate", defaultMessage: "Generate" }),
      setGenerateButtonText,
      "Generate success"
    );
  }

  const handleGenerate = async () => {
    if (!animeShadowLineDrawingInputImage) {
      alert("Please upload an linear image first.");
      return;
    }

    if (!animeShadowShadowInputImage) {
      alert("Please upload an shadow image first.");
      return;
    }

    updateGenerateStatus(
      true,
      setIsGenerating,
      intl.formatMessage({ id: "generating", defaultMessage: "Generating..." }),
      setGenerateButtonText,
      "Generating..."
    );

    const payload = {
      line_image_base64: prepareImage(animeShadowLineDrawingInputImage),
      shadow_image_base64: prepareImage(animeShadowShadowInputImage),
    };

    sendRequest(
      "http://127.0.0.1:7861/ai-assistant/multiply_images",
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
      title={intl.formatMessage({ id: "anime-shadow", defaultMessage: "Anime Shadow" })}
      breadcrumb={[
        {
          label: intl.formatMessage({ id: "shadow", defaultMessage: "Shadow" }),
          route: "/sections/page-sections/anime-shadow",
        },
        { label: intl.formatMessage({ id: "anime-shadow", defaultMessage: "Anime Shadow" }) },
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
                      inputImage={animeShadowLineDrawingInputImage}
                      handleImageChange={handleImageChange}
                      setInputImage={setAnimeShadowLineDrawingInputImage}
                      setHeight={setHeight}
                      setWidth={setWidth}
                      label="lineDrawing-input-image"
                      postProcess={processInvert}
                      postProcessSuccess={setAnimeShadowInvertImage}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputPanel
                      inputImage={animeShadowShadowInputImage}
                      handleImageChange={handleImageChange}
                      setInputImage={setAnimeShadowShadowInputImage}
                      setHeight={setHeight}
                      setWidth={setWidth}
                      label="shadow-input-image"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <PromptAnalyzer
                  inputImage={animeShadowLineDrawingInputImage}
                  prompt={animeShadowPrompt}
                  setPrompt={setAnimeShadowPrompt}
                  negativePrompt={negativePrompt}
                  setNegativePrompt={setNegativePrompt}
                  allPromptSetters={[
                    setImg2imgPrompt,
                    setLineDrawingPrompt,
                    setLineDrawingCutoutPrompt,
                    setNormalMapPrompt,
                    setAnimeShadowPrompt,
                    setColorSchemePrompt,
                  ]}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <AnimeShadowConfigPanel
                  animeShadowType={animeShadowType}
                  setAnimeShadowType={setAnimeShadowType}
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
              <OutputPanel outputImage={animeShadowOutputImage} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </BaseLayout>
  );
}

export default AnimeShadow;
