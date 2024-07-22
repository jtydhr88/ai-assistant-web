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
import { useCache } from "../../../../ImageContext";
import { postGenerateError, updateGenerateStatus } from "../../../../utils/GenerateStatus";
import useGenerateProgress from "../../../../components/useGenerateProgress";
import TransferPanel from "../../../../components/TransferPanel";
import { useIntl } from "react-intl";
import {
  getDefaultControlUnitPayload,
  getDefaultImg2ImgPayload,
} from "../../../../utils/PayloadUtils";
import GenerateButtonsPanel from "../../../../components/GenerateButtonsPanel";

function ColorScheme() {
  const {
    colorSchemeInputImage,
    setColorSchemeInputImage,
    colorSchemeInvertImage,
    setColorSchemeInvertImage,
    colorSchemeOutputImage,
    setColorSchemeOutputImage,
    setColoringInputImage,
    colorSchemePrompt,
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
    if (colorSchemeInputImage) {
      handleImageChange(
        colorSchemeInputImage,
        setColorSchemeInputImage,
        setWidth,
        setHeight,
        processInvert,
        setColorSchemeInvertImage,
        postGenerateError
      );
    }
  }, [colorSchemeInputImage]);

  function postGenerateSuccess(data) {
    const base64Image = data.images[0];
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
    setColorSchemeOutputImage(imageSrc);

    updateGenerateStatus(
      false,
      setIsGenerating,
      intl.formatMessage({ id: "generate", defaultMessage: "Generate" }),
      setGenerateButtonText,
      "Generate success"
    );
  }

  const handleGenerate = () => {
    if (!colorSchemeInputImage) {
      alert("Please upload an image first.");
      return;
    }

    setIsGenerating(true);
    setGenerateButtonText(
      intl.formatMessage({ id: "generating", defaultMessage: "Generating..." })
    );

    console.log("Generating...");

    let finalPrompt =
      "masterpiece, best quality, (flat color:1.4), <lora:SDXL_baketu2:1>, " + colorSchemePrompt;

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

    cn_args["image"] = prepareImage(colorSchemeInvertImage);
    cn_args["weight"] = 1.25;
    cn_args["model"] = "control-lora-canny-rank256 [ec2dbbe4]";

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
      title={intl.formatMessage({ id: "color-scheme", defaultMessage: "Color Scheme" })}
      breadcrumb={[
        {
          label: intl.formatMessage({ id: "color", defaultMessage: "Color" }),
          route: "/sections/page-sections/color-scheme",
        },
        { label: intl.formatMessage({ id: "color-scheme", defaultMessage: "Color Scheme" }) },
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
                      inputImage={colorSchemeInputImage}
                      handleImageChange={handleImageChange}
                      setInputImage={setColorSchemeInputImage}
                      setHeight={setHeight}
                      setWidth={setWidth}
                      postProcess={processInvert}
                      postProcessSuccess={setColorSchemeInvertImage}
                      postProcessError={postGenerateError}
                      label="lineart-input-image"
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
                  inputImage={colorSchemeInputImage}
                  prompt={colorSchemePrompt}
                  setPrompt={setColorSchemePrompt}
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
              <OutputPanel outputImage={colorSchemeOutputImage} />
              {colorSchemeOutputImage && (
                <TransferPanel
                  outputImage={colorSchemeOutputImage}
                  targetTabInputSetter={setColoringInputImage}
                  label={"transfer-to-coloring-tab"}
                  targetLink={"/sections/page-sections/coloring"}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </BaseLayout>
  );
}

export default ColorScheme;
