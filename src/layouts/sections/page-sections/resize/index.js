import BaseLayout from "layouts/sections/components/BaseLayout";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import InputPanel from "../../../../components/InputPanel";
import Card from "@mui/material/Card";
import PromptAnalyzer from "../../../../components/PromptAnalyzer";
import OutputPanel from "../../../../components/OutputPanel";
import ProgressIndicator from "../../../../components/ProgressIndicator";
import { sendRequest } from "../../../../utils/RequestApi";
import { handleImageChange, prepareImage } from "../../../../utils/ImgUtils";
import { executePrompt, removeDuplicates } from "../../../../utils/PromptUtils";
import { CardContent } from "@mui/material";
import { useCache } from "../../../../ImageContext";
import { postGenerateError, updateGenerateStatus } from "../../../../utils/GenerateStatus";
import useGenerateProgress from "../../../../components/useGenerateProgress";
import ResizeConfigPanel from "../../../../components/ResizeConfigPanel";
import { useIntl } from "react-intl";
import {
  getDefaultControlUnitPayload,
  getDefaultImg2ImgPayload,
} from "../../../../utils/PayloadUtils";
import GenerateButtonsPanel from "../../../../components/GenerateButtonsPanel";

function Resize() {
  const {
    resizeInputImage,
    setResizeInputImage,
    resizeOutputImage,
    setResizeOutputImage,
    resizePrompt,
    setResizePrompt,
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

  const [maxLengthScale, setMaxLengthScale] = useState(1600);
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
    if (resizeInputImage) {
      handleImageChange(resizeInputImage, setResizeInputImage, setWidth, setHeight);
    }
  }, [resizeInputImage]);

  function postGenerateSuccess(data) {
    const base64Image = data.images[0];
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
    setResizeOutputImage(imageSrc);

    updateGenerateStatus(
      false,
      setIsGenerating,
      intl.formatMessage({ id: "generate", defaultMessage: "Generate" }),
      setGenerateButtonText,
      "Generate success"
    );
  }

  const handleGenerate = () => {
    if (!resizeInputImage) {
      alert("Please upload an image first.");
      return;
    }

    setIsGenerating(true);
    setGenerateButtonText(
      intl.formatMessage({ id: "generating", defaultMessage: "Generating..." })
    );

    console.log("Generating...");

    let finalPrompt = "masterpiece, best quality," + prompt;

    const executeTags = ["transparent background"];

    finalPrompt = executePrompt(executeTags, finalPrompt);
    finalPrompt = removeDuplicates(finalPrompt);

    const aspectRatio = width / height;

    let newWidth;
    let newHeight;

    if (width > height) {
      newWidth = maxLengthScale;
      newHeight = Math.round(maxLengthScale / aspectRatio);
    } else {
      newHeight = maxLengthScale;
      newWidth = Math.round(maxLengthScale * aspectRatio);
    }

    console.log("newWidth, newHeight", [newWidth, newHeight]);

    const unit1 = getDefaultControlUnitPayload();

    unit1["image"] = prepareImage(resizeInputImage);
    unit1["weight"] = 0.8;
    unit1["model"] = "controlnet852AClone_v10 [808807b2]";
    unit1["control_mode"] = "ControlNet is more important";

    const unit2 = getDefaultControlUnitPayload();

    unit2["image"] = prepareImage(resizeInputImage);
    unit2["weight"] = 0.8;
    unit2["model"] = "Kataragi_lineartXL-lora128 [0598262f]";
    unit2["module"] = "lineart_realistic";
    unit2["control_mode"] = "ControlNet is more important";

    const encoded_base = prepareImage(resizeInputImage);

    const payload = getDefaultImg2ImgPayload();

    payload["init_images"] = [encoded_base];
    payload["denoising_strength"] = 0.45;
    payload["prompt"] = finalPrompt;
    payload["negative_prompt"] = negativePrompt;
    payload["width"] = newWidth;
    payload["height"] = newHeight;
    payload["step"] = 30;

    payload["alwayson_scripts"] = { ControlNet: { args: [unit1, unit2] } };

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
      title={intl.formatMessage({ id: "resize", defaultMessage: "Resize" })}
      breadcrumb={[
        {
          label: intl.formatMessage({ id: "tools", defaultMessage: "Tools" }),
          route: "/sections/page-sections/resize",
        },
        { label: intl.formatMessage({ id: "resize", defaultMessage: "Resize" }) },
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
                      inputImage={resizeInputImage}
                      handleImageChange={handleImageChange}
                      setInputImage={setResizeInputImage}
                      setHeight={setHeight}
                      setWidth={setWidth}
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
                  inputImage={resizeInputImage}
                  prompt={resizePrompt}
                  setPrompt={setResizePrompt}
                  negativePrompt={negativePrompt}
                  setNegativePrompt={setNegativePrompt}
                  allPromptSetters={[
                    setResizePrompt,
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
                <ResizeConfigPanel
                  maxLengthScale={maxLengthScale}
                  setMaxLengthScale={setMaxLengthScale}
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
              <OutputPanel outputImage={resizeOutputImage} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </BaseLayout>
  );
}

export default Resize;
