// Sections components
import BaseLayout from "layouts/sections/components/BaseLayout";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import InputPanel from "../../../../components/InputPanel";
import Card from "@mui/material/Card";
import ProgressIndicator from "../../../../components/ProgressIndicator";
import { sendRequest } from "../../../../utils/RequestApi";
import { handleImageChange, prepareImage } from "../../../../utils/ImgUtils";
import { CardContent } from "@mui/material";
import { useCache } from "../../../../ImageContext";
import { postGenerateError, updateGenerateStatus } from "../../../../utils/GenerateStatus";
import useGenerateProgress from "../../../../components/useGenerateProgress";
import PositiveNegativeShapeConfigPanel from "../../../../components/PositiveNegativeShapeConfigPanel";
import TransparentBackgroundOutputPanel from "../../../../components/TransparentBackgroundOutputPanel";
import { useIntl } from "react-intl";
import GenerateButtonsPanel from "../../../../components/GenerateButtonsPanel";

function LineartTransparent() {
  const {
    positiveNegativeShapeInputImage,
    setPositiveNegativeShapeInputImage,
    positiveNegativeShapeOutputImage,
    setPositiveNegativeShaeOutputImage,
  } = useCache();
  const intl = useIntl();
  // eslint-disable-next-line no-unused-vars
  const [width, setWidth] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [height, setHeight] = useState(null);

  const [thresholds, setThresholds] = useState([1, 100, 140, 254]);

  const [greyscaleType, setGreyscaleType] = useState("greyscale2");

  const [greyscale1Value, setGreyscale1Value] = useState(120);
  const [greyscale2Value, setGreyscale2Value] = useState(100);

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
    if (positiveNegativeShapeInputImage) {
      handleImageChange(
        positiveNegativeShapeInputImage,
        setPositiveNegativeShapeInputImage,
        setWidth,
        setHeight
      );
    }
  }, [positiveNegativeShapeInputImage]);

  function postGenerateSuccess(data) {
    const base64Image = data["result"];
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
    setPositiveNegativeShaeOutputImage(imageSrc);

    updateGenerateStatus(
      false,
      setIsGenerating,
      intl.formatMessage({ id: "generate", defaultMessage: "Generate" }),
      setGenerateButtonText,
      "Generate success"
    );
  }

  const handleGenerate = () => {
    if (!positiveNegativeShapeInputImage) {
      alert("Please upload an image first.");
      return;
    }

    setIsGenerating(true);
    setGenerateButtonText(
      intl.formatMessage({ id: "generating", defaultMessage: "Generating..." })
    );

    console.log("Generating...");

    let colors = [];

    if (greyscaleType === "greyscale1") {
      colors = [255 - greyscale1Value];
    } else if (greyscaleType === "greyscale2") {
      colors = [255 - greyscale1Value, 255 - greyscale2Value];
    }

    const payload = {
      image_base64: prepareImage(positiveNegativeShapeInputImage),
      thresholds: thresholds,
      colors: colors,
    };

    sendRequest(
      "http://127.0.0.1:7861/ai-assistant/positive_negative_shape_process",
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
      title={intl.formatMessage({
        id: "positive-negative-shape",
        defaultMessage: "Positive Negative Shape",
      })}
      breadcrumb={[
        {
          label: intl.formatMessage({ id: "tools", defaultMessage: "Tools" }),
          route: "/sections/page-sections/positive-negative-shape",
        },
        {
          label: intl.formatMessage({
            id: "positive-negative-shape",
            defaultMessage: "Positive Negative Shape",
          }),
        },
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
                      inputImage={positiveNegativeShapeInputImage}
                      handleImageChange={handleImageChange}
                      setInputImage={setPositiveNegativeShapeInputImage}
                      setHeight={setHeight}
                      setWidth={setWidth}
                      label="shadow-input-image"
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
                <PositiveNegativeShapeConfigPanel
                  thresholds={thresholds}
                  setThresholds={setThresholds}
                  greyscaleType={greyscaleType}
                  setGreyscaleType={setGreyscaleType}
                  greyscale1Value={greyscale1Value}
                  setGreyscale1Value={setGreyscale1Value}
                  greyscale2Value={greyscale2Value}
                  setGreyscale2Value={setGreyscale2Value}
                  handleGenerate={handleGenerate}
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
              <TransparentBackgroundOutputPanel outputImage={positiveNegativeShapeOutputImage} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </BaseLayout>
  );
}

export default LineartTransparent;
