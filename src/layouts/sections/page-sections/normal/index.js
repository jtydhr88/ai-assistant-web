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
import { baseGeneration, handleImageChange, prepareImage } from "../../../../utils/ImgUtils";
import { executePrompt, removeColor, removeDuplicates } from "../../../../utils/PromptUtils";
import { CardContent } from "@mui/material";
import NormalConfigPanel from "../../../../components/NormalConfigPanel";
import { useCache } from "../../../../ImageContext";
import TransferPanel from "../../../../components/TransferPanel";
import { postGenerateError, updateGenerateStatus } from "../../../../utils/GenerateStatus";
import useGenerateProgress from "../../../../components/useGenerateProgress";
import { useIntl } from "react-intl";
import {
  getDefaultControlUnitPayload,
  getDefaultImg2ImgPayload,
} from "../../../../utils/PayloadUtils";
import GenerateButtonsPanel from "../../../../components/GenerateButtonsPanel";

function Normal() {
  const {
    normalMapInputImage,
    setNormalMapInputImage,
    normalMapInvertImage,
    setNormalMapInvertImage,
    normalMapOutputImage,
    setNormalMapOutputImage,
    setLightInputImage,
    normalMapPrompt,
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

  const [linearFidelity, setLinearFidelity] = useState(1.25);
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
    if (normalMapInputImage) {
      handleImageChange(
        normalMapInputImage,
        setNormalMapInputImage,
        setWidth,
        setHeight,
        processInvert,
        setNormalMapInvertImage,
        postGenerateError
      );
    }
  }, [normalMapInputImage]);

  function postGenerateSuccess(data) {
    const base64Image = data.images[0];
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
    setNormalMapOutputImage(imageSrc);

    updateGenerateStatus(
      false,
      setIsGenerating,
      intl.formatMessage({ id: "generate", defaultMessage: "Generate" }),
      setGenerateButtonText,
      "Generate success"
    );
  }

  const handleGenerate = () => {
    if (!normalMapInputImage) {
      alert("Please upload an image first.");
      return;
    }

    setIsGenerating(true);
    setGenerateButtonText(
      intl.formatMessage({ id: "generating", defaultMessage: "Generating..." })
    );

    console.log("Generating...");

    let finalPrompt =
      "masterpiece, best quality, normal map, <lora:sdxl-testlora-normalmap_04b_dim32:1.2>" +
      normalMapPrompt;

    const executeTags = [
      "monochrome",
      "greyscale",
      "lineart",
      "white background",
      "sketch",
      "transparent background",
    ];

    finalPrompt = executePrompt(executeTags, finalPrompt);
    finalPrompt = removeDuplicates(finalPrompt);
    finalPrompt = removeColor(finalPrompt);

    const whiteBaseImage = baseGeneration([width, height], [255, 255, 255, 255]);

    const cn_args = getDefaultControlUnitPayload();

    cn_args["image"] = prepareImage(normalMapInvertImage);
    cn_args["weight"] = linearFidelity;
    cn_args["model"] = "Kataragi_lineartXL-lora128 [0598262f]";

    const encoded_base = prepareImage(whiteBaseImage);

    const payload = getDefaultImg2ImgPayload();

    payload["init_images"] = [encoded_base];
    payload["denoising_strength"] = 1.0;
    payload["prompt"] = finalPrompt;
    payload["negative_prompt"] = negativePrompt;
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
      title={intl.formatMessage({ id: "normal-mapping", defaultMessage: "Normal Mapping" })}
      breadcrumb={[
        {
          label: intl.formatMessage({ id: "shadow", defaultMessage: "Shadow" }),
          route: "/sections/page-sections/normal",
        },
        { label: intl.formatMessage({ id: "normal-mapping", defaultMessage: "Normal Mapping" }) },
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
                      inputImage={normalMapInputImage}
                      handleImageChange={handleImageChange}
                      setInputImage={setNormalMapInputImage}
                      setHeight={setHeight}
                      setWidth={setWidth}
                      postProcess={processInvert}
                      postProcessSuccess={setNormalMapInvertImage}
                      postProcessError={postGenerateError}
                      label="input-image"
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
                  inputImage={normalMapInputImage}
                  prompt={normalMapPrompt}
                  setPrompt={setNormalMapPrompt}
                  negativePrompt={negativePrompt}
                  setNegativePrompt={setNegativePrompt}
                  allPromptSetters={[
                    setImg2imgPrompt,
                    setLineartPrompt,
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
                <NormalConfigPanel
                  linearFidelity={linearFidelity}
                  setLinearFidelity={setLinearFidelity}
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
              <OutputPanel outputImage={normalMapOutputImage} />
              {normalMapOutputImage && (
                <TransferPanel
                  outputImage={normalMapOutputImage}
                  targetTabInputSetter={setLightInputImage}
                  label={"transfer-to-lighting-tab"}
                  targetLink={"/sections/page-sections/light"}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </BaseLayout>
  );
}

export default Normal;
