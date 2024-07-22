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
import ProgressIndicator from "../../../../components/ProgressIndicator";
import { sendRequest } from "../../../../utils/RequestApi";
import { handleImageChange, prepareImage } from "../../../../utils/ImgUtils";
import { CardContent } from "@mui/material";
import { useCache } from "../../../../ImageContext";
import { postGenerateError, updateGenerateStatus } from "../../../../utils/GenerateStatus";
import useGenerateProgress from "../../../../components/useGenerateProgress";
import TransparentConfigPanel from "../../../../components/TransparentConfigPanel";
import TransparentBackgroundOutputPanel from "../../../../components/TransparentBackgroundOutputPanel";
import { useIntl } from "react-intl";
import GenerateButtonsPanel from "../../../../components/GenerateButtonsPanel";

function LineDrawingTransparent() {
  const {
    lineDrawingTransparentInputImage,
    setLineDrawingTransparentInputImage,
    lineDrawingTransparentOutputImage,
    setLineDrawingTransparentOutputImage,
  } = useCache();
  const intl = useIntl();
  // eslint-disable-next-line no-unused-vars
  const [width, setWidth] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [height, setHeight] = useState(null);

  const [transparentThreshold, setTransparentThreshold] = useState(70);
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
    if (lineDrawingTransparentInputImage) {
      handleImageChange(
        lineDrawingTransparentInputImage,
        setLineDrawingTransparentInputImage,
        setWidth,
        setHeight
      );
    }
  }, [lineDrawingTransparentInputImage]);

  function postGenerateSuccess(data) {
    const base64Image = data["result"];
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
    setLineDrawingTransparentOutputImage(imageSrc);

    updateGenerateStatus(
      false,
      setIsGenerating,
      intl.formatMessage({ id: "generate", defaultMessage: "Generate" }),
      setGenerateButtonText,
      "Generate success"
    );
  }

  const handleGenerate = () => {
    if (!lineDrawingTransparentInputImage) {
      alert("Please upload an image first.");
      return;
    }

    setIsGenerating(true);
    setGenerateButtonText(
      intl.formatMessage({ id: "generating", defaultMessage: "Generating..." })
    );

    console.log("Generating...");

    const payload = {
      image_base64: prepareImage(lineDrawingTransparentInputImage),
      transparent_threshold: transparentThreshold,
    };

    sendRequest(
      "http://127.0.0.1:7861/ai-assistant/transparent_process",
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
        id: "lineDrawing-transparent",
        defaultMessage: "LineDrawing Transparent",
      })}
      breadcrumb={[
        {
          label: intl.formatMessage({ id: "tools", defaultMessage: "Tools" }),
          route: "/sections/page-sections/lineDrawing-transparent",
        },
        {
          label: intl.formatMessage({
            id: "lineDrawing-transparent",
            defaultMessage: "LineDrawing Transparent",
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
                      inputImage={lineDrawingTransparentInputImage}
                      handleImageChange={handleImageChange}
                      setInputImage={setLineDrawingTransparentInputImage}
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
                <TransparentConfigPanel
                  transparentThreshold={transparentThreshold}
                  setTransparentThreshold={setTransparentThreshold}
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
              <TransparentBackgroundOutputPanel outputImage={lineDrawingTransparentOutputImage} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </BaseLayout>
  );
}

export default LineDrawingTransparent;
