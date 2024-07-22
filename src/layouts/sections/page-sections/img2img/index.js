import BaseLayout from "layouts/sections/components/BaseLayout";
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import InputPanel from "../../../../components/InputPanel";
import MaskPanel from "../../../../components/MaskPanel";
import Card from "@mui/material/Card";
import PromptAnalyzer from "../../../../components/PromptAnalyzer";
import Img2ImgConfigPanel from "../../../../components/Img2ImgConfigPanel";
import OutputPanel from "../../../../components/OutputPanel";
import ProgressIndicator from "../../../../components/ProgressIndicator";
import { sendRequest } from "../../../../utils/RequestApi";
import { prepareImage, handleImageChange } from "../../../../utils/ImgUtils";
import { CardContent } from "@mui/material";
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
import AnytestConfigPanel from "../../../../components/AnytestConfigPanel";

function Img2Img() {
  const [width, setWidth] = useState(null);
  const {
    img2imgInputImage,
    setImg2imgInputImage,
    maskImage,
    setMaskImage,
    img2imgOutputImage,
    setImg2imgOutputImage,
    setLineDrawingInputImage,
    img2imgPrompt,
    setImg2imgPrompt,
    setLineDrawingPrompt,
    setLineDrawingCutoutPrompt,
    setNormalMapPrompt,
    setAnimeShadowPrompt,
    setColorSchemePrompt,
  } = useCache();
  const intl = useIntl();
  const [height, setHeight] = useState(null);
  const [anytestType, setAnytestType] = useState("none");
  const [anytestFidelity, setAnytestFidelity] = useState(1);
  const [anytestInputImage, setAnytestInputImage] = useState(null);
  const [negativePrompt, setNegativePrompt] = useState(
    "lowres, error, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, blurry"
  );
  const [imageFidelity, setImageFidelity] = useState(0.35);

  const {
    isGenerating,
    setIsGenerating,
    generateButtonText,
    setGenerateButtonText,
    progressData,
    isInterruptable,
    setIsInterruptable,
  } = useGenerateProgress();

  function postGenerateSuccess(data) {
    const base64Image = data.images[0];
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
    setImg2imgOutputImage(imageSrc);

    updateGenerateStatus(
      false,
      setIsGenerating,
      intl.formatMessage({ id: "generate", defaultMessage: "Generate" }),
      setGenerateButtonText,
      "Generate success"
    );
  }

  const handleGenerate = () => {
    if (!img2imgInputImage) {
      alert("Please upload an image first.");
      return;
    }

    setIsGenerating(true);
    setGenerateButtonText(
      intl.formatMessage({ id: "generating", defaultMessage: "Generating..." })
    );

    console.log("Generating...");

    const payload = getDefaultImg2ImgPayload();

    payload["init_images"] = [prepareImage(img2imgInputImage)];
    payload["prompt"] = img2imgPrompt;
    payload["negative_prompt"] = negativePrompt;
    payload["width"] = width;
    payload["height"] = height;
    payload["denoising_strength"] = 1 - imageFidelity;
    payload["mask"] = prepareImage(maskImage);
    payload["mask_blur"] = 4;
    payload["inpainting_fill"] = 1;

    if (anytestType !== "none") {
      let model = "CN-anytest_v4-marged_am_dim256 [49b6c950]";

      if (anytestType === "anytestV3") {
        model = "CN-anytest_v3-50000_am_dim256 [dbecc0f9]";
      }

      const cn_args = getDefaultControlUnitPayload();

      cn_args["image"] = prepareImage(anytestInputImage);
      cn_args["model"] = model;
      cn_args["weight"] = anytestFidelity;

      payload["alwayson_scripts"] = { ControlNet: { args: [cn_args] } };
    }

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
      title={intl.formatMessage({ id: "img2img", defaultMessage: "Img2img" })}
      breadcrumb={[{ label: intl.formatMessage({ id: "img2img", defaultMessage: "Img2img" }) }]}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <InputPanel
                      inputImage={img2imgInputImage}
                      handleImageChange={handleImageChange}
                      setInputImage={setImg2imgInputImage}
                      setHeight={setHeight}
                      setWidth={setWidth}
                      label="input-image"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <MaskPanel
                      maskImage={maskImage}
                      inputImage={img2imgInputImage}
                      setMaskImage={setMaskImage}
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
                  inputImage={img2imgInputImage}
                  prompt={img2imgPrompt}
                  setPrompt={setImg2imgPrompt}
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
                <AnytestConfigPanel
                  anytestType={anytestType}
                  setAnytestType={setAnytestType}
                  anytestInputImage={anytestInputImage}
                  setAnytestInputImage={setAnytestInputImage}
                  anytestFidelity={anytestFidelity}
                  setAnytestFidelity={setAnytestFidelity}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Img2ImgConfigPanel
                  imageFidelity={imageFidelity}
                  setImageFidelity={setImageFidelity}
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
              <OutputPanel outputImage={img2imgOutputImage} />
              {img2imgOutputImage && (
                <TransferPanel
                  outputImage={img2imgOutputImage}
                  targetTabInputSetter={setLineDrawingInputImage}
                  label={"transfer-to-lineart-tab"}
                  targetLink={"/sections/page-sections/line-drawing"}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </BaseLayout>
  );
}

export default Img2Img;
