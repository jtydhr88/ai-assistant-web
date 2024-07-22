import BaseLayout from "layouts/sections/components/BaseLayout";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import InputPanel from "../../../../components/InputPanel";
import Card from "@mui/material/Card";
import PromptAnalyzer from "../../../../components/PromptAnalyzer";
import OutputPanel from "../../../../components/OutputPanel";
import ProgressIndicator from "../../../../components/ProgressIndicator";
import { sendRequest } from "../../../../utils/RequestApi";
import { baseGeneration, handleImageChange, prepareImage } from "../../../../utils/ImgUtils";
import LineDrawingConfigPanel from "../../../../components/LineDrawingConfigPanel";
import { executePrompt, removeColor, removeDuplicates } from "../../../../utils/PromptUtils";
import { CardContent } from "@mui/material";
import Box from "@mui/material/Box";
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

function LineDrawingCutout() {
  const {
    lineDrawingCutoutInputImage,
    setLineDrawingCutoutInputImage,
    lineDrawingCutoutOutputImage,
    setLineDrawingCutoutOutputImage,
    setNormalMapInputImage,
    setAnimeShadowLineDrawingInputImage,
    setColorSchemeInputImage,
    setLineDrawingTransparentInputImage,
    lineDrawingCutoutPrompt,
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

  const [lineDrawingFidelity, setLineDrawingFidelity] = useState(1);
  const [lineDrawingBold, setLineDrawingBold] = useState(0);
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
    if (lineDrawingCutoutInputImage) {
      handleImageChange(
        lineDrawingCutoutInputImage,
        setLineDrawingCutoutInputImage,
        setWidth,
        setHeight
      );
    }
  }, [lineDrawingCutoutInputImage]);

  function postGenerateSuccess(data) {
    const base64Image = data.images[0];
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
    setLineDrawingCutoutOutputImage(imageSrc);

    updateGenerateStatus(
      false,
      setIsGenerating,
      "Generate",
      setGenerateButtonText,
      "Generate success"
    );
  }

  const handleGenerate = () => {
    if (!lineDrawingCutoutInputImage) {
      alert("Please upload an image first.");
      return;
    }

    setIsGenerating(true);
    setGenerateButtonText(
      intl.formatMessage({ id: "generating", defaultMessage: "Generating..." })
    );

    console.log("Generating...");

    const lineDrawing = 1 - lineDrawingBold;

    let finalPrompt =
      "masterpiece, best quality, <lora:sdxl_BWLine:" +
      lineDrawing +
      ">, <lora:sdxl_BW_bold_Line:" +
      lineDrawingBold +
      ">, monochrome, lineDrawing, white background, " +
      lineDrawingCutoutPrompt;

    const executeTags = ["sketch", "transparent background"];

    finalPrompt = executePrompt(executeTags, finalPrompt);
    finalPrompt = removeDuplicates(finalPrompt);
    finalPrompt = removeColor(finalPrompt);

    const whiteBaseImage = baseGeneration([width, height], [255, 255, 255, 255]);

    const cn_args = getDefaultControlUnitPayload();

    cn_args["image"] = prepareImage(lineDrawingCutoutInputImage);
    cn_args["weight"] = lineDrawingFidelity;
    cn_args["model"] = "CN-anytest_v4-marged_am_dim256 [49b6c950]";

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
      title={intl.formatMessage({ id: "lineDrawing2", defaultMessage: "Line Draw Cutout" })}
      breadcrumb={[
        {
          label: intl.formatMessage({ id: "lineDrawing", defaultMessage: "LineDrawing" }),
          route: "/sections/page-sections/lineDrawing2",
        },
        { label: intl.formatMessage({ id: "lineDrawing2", defaultMessage: "Line Draw Cutout" }) },
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
                      inputImage={lineDrawingCutoutInputImage}
                      handleImageChange={handleImageChange}
                      setInputImage={setLineDrawingCutoutInputImage}
                      setHeight={setHeight}
                      setWidth={setWidth}
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
                  inputImage={lineDrawingCutoutInputImage}
                  prompt={lineDrawingCutoutPrompt}
                  setPrompt={setLineDrawingCutoutPrompt}
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
                <LineDrawingConfigPanel
                  lineDrawingBold={lineDrawingBold}
                  setLineDrawingBold={setLineDrawingBold}
                  lineDrawingFidelity={lineDrawingFidelity}
                  setLineDrawingFidelity={setLineDrawingFidelity}
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
              <OutputPanel outputImage={lineDrawingCutoutOutputImage} />
              {lineDrawingCutoutOutputImage && (
                <Box display="flex" flexDirection="row" flexWrap="wrap">
                  <TransferPanel
                    outputImage={lineDrawingCutoutOutputImage}
                    targetTabInputSetter={setNormalMapInputImage}
                    label={"transfer-to-normal-tab"}
                    targetLink={"/sections/page-sections/normal"}
                  />
                  <TransferPanel
                    outputImage={lineDrawingCutoutOutputImage}
                    targetTabInputSetter={setAnimeShadowLineDrawingInputImage}
                    label={"transfer-to-anime-shadow-tab"}
                    targetLink={"/sections/page-sections/anime-shadow"}
                  />
                  <TransferPanel
                    outputImage={lineDrawingCutoutOutputImage}
                    targetTabInputSetter={setColorSchemeInputImage}
                    label={"transfer-to-color-scheme-tab"}
                    targetLink={"/sections/page-sections/color-scheme"}
                  />
                  <TransferPanel
                    outputImage={lineDrawingCutoutOutputImage}
                    targetTabInputSetter={setLineDrawingTransparentInputImage}
                    label={"transfer-to-line-drawing-transparent-tab"}
                    targetLink={"/sections/page-sections/line-drawing-transparent"}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </BaseLayout>
  );
}

export default LineDrawingCutout;
