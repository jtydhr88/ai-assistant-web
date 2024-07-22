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
import CannyPanel from "../../../../components/CannyPanel";
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

function LineDrawing() {
  const {
    lineDrawingInputImage,
    setLineDrawingInputImage,
    cannyImage,
    setCannyImage,
    lineDrawingOutputImage,
    setLineDrawingOutputImage,
    setNormalMapInputImage,
    setAnimeShadowLineDrawingInputImage,
    setLineDrawingCutoutInputImage,
    setColorSchemeInputImage,
    setLineDrawingTransparentInputImage,
    lineDrawingPrompt,
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
    if (lineDrawingInputImage) {
      handleImageChange(lineDrawingInputImage, setLineDrawingInputImage, setWidth, setHeight);
    }
  }, [lineDrawingInputImage]);

  function postGenerateSuccess(data) {
    const base64Image = data.images[0];
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
    setLineDrawingOutputImage(imageSrc);

    updateGenerateStatus(
      false,
      setIsGenerating,
      intl.formatMessage({ id: "generate", defaultMessage: "Generate" }),
      setGenerateButtonText,
      "Generate success"
    );
  }

  const handleGenerate = () => {
    if (!lineDrawingInputImage) {
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
      lineDrawingPrompt;

    const executeTags = ["sketch", "transparent background"];

    finalPrompt = executePrompt(executeTags, finalPrompt);
    finalPrompt = removeDuplicates(finalPrompt);
    finalPrompt = removeColor(finalPrompt);

    console.log([width, height]);

    const whiteBaseImage = baseGeneration([width, height], [255, 255, 255, 255]);

    const cn_args = getDefaultControlUnitPayload();

    cn_args["image"] = prepareImage(cannyImage);
    cn_args["weight"] = lineDrawingFidelity;
    cn_args["model"] = "control-lora-canny-rank256 [ec2dbbe4]";

    const encoded_base = prepareImage(whiteBaseImage);

    const payload = getDefaultImg2ImgPayload();

    payload["init_images"] = [encoded_base];
    payload["denoising_strength"] = 1;
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
      title={intl.formatMessage({ id: "lineDrawing", defaultMessage: "LineDrawing" })}
      breadcrumb={[
        {
          label: intl.formatMessage({ id: "lineDrawing", defaultMessage: "LineDrawing" }),
          route: "/sections/page-sections/lineDrawing",
        },
        { label: intl.formatMessage({ id: "lineDrawing1", defaultMessage: "LineDrawing" }) },
      ]}
    >
      <Grid container spacing={2}>
        {/* 左主列 */}
        <Grid item xs={12} md={6} container spacing={2}>
          {/* 第一行 */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <InputPanel
                      inputImage={lineDrawingInputImage}
                      handleImageChange={handleImageChange}
                      setInputImage={setLineDrawingInputImage}
                      setHeight={setHeight}
                      setWidth={setWidth}
                      label="input-image"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CannyPanel
                      inputImage={lineDrawingInputImage}
                      cannyImage={cannyImage}
                      setCannyImage={setCannyImage}
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
                  inputImage={lineDrawingInputImage}
                  prompt={lineDrawingPrompt}
                  setPrompt={setLineDrawingPrompt}
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
              <OutputPanel outputImage={lineDrawingOutputImage} />
              {lineDrawingOutputImage && (
                <Box display="flex" flexDirection="row" flexWrap="wrap">
                  <TransferPanel
                    outputImage={lineDrawingOutputImage}
                    targetTabInputSetter={setLineDrawingInputImage}
                    label={"send-back-as-input"}
                    targetLink={"/sections/page-sections/line-drawing"}
                  />
                  <TransferPanel
                    outputImage={lineDrawingOutputImage}
                    targetTabInputSetter={setLineDrawingCutoutInputImage}
                    label={"transfer-to-lineDrawing2-tab"}
                    targetLink={"/sections/page-sections/line-drawing-cutout"}
                  />
                  <TransferPanel
                    outputImage={lineDrawingOutputImage}
                    targetTabInputSetter={setNormalMapInputImage}
                    label={"transfer-to-normal-tab"}
                    targetLink={"/sections/page-sections/normal"}
                  />
                  <TransferPanel
                    outputImage={lineDrawingOutputImage}
                    targetTabInputSetter={setAnimeShadowLineDrawingInputImage}
                    label={"transfer-to-anime-shadow-tab"}
                    targetLink={"/sections/page-sections/anime-shadow"}
                  />
                  <TransferPanel
                    outputImage={lineDrawingOutputImage}
                    targetTabInputSetter={setColorSchemeInputImage}
                    label={"transfer-to-color-scheme-tab"}
                    targetLink={"/sections/page-sections/color-scheme"}
                  />
                  <TransferPanel
                    outputImage={lineDrawingOutputImage}
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

export default LineDrawing;
