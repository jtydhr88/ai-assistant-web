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
import { sendRequest } from "../../../../utils/RequestApi";
import { handleImageChange, prepareImage } from "../../../../utils/ImgUtils";
import MKButton from "../../../../components/MKButton";
import LightConfigPanel from "../../../../components/LightConfigPanel";
import { CardContent } from "@mui/material";
import Box from "@mui/material/Box";
import { useCache } from "../../../../ImageContext";
import TransferPanel from "../../../../components/TransferPanel";
import { postGenerateError, updateGenerateStatus } from "../../../../utils/GenerateStatus";
import LightOutputPanel from "../../../../components/LightOutputPanel";
import { useIntl } from "react-intl";

function Light() {
  const {
    lightInputImage,
    setLightInputImage,
    lightOutputImage,
    setLightOutputImage,
    setAnimeShadowShadowInputImage,
    setPositiveNegativeShapeInputImage,
  } = useCache();
  const intl = useIntl();
  // eslint-disable-next-line no-unused-vars
  const [width, setWidth] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [height, setHeight] = useState(null);

  const [lightYaw, setLightYaw] = useState(60);
  const [lightPitch, setLightPitch] = useState(-60);
  const [specularPower, setSpecularPower] = useState(30);
  const [normalDiffuseStrength, setNormalDiffuseStrength] = useState(1);
  const [specularHighlightsStrength, setSpecularHighlightsStrength] = useState(0.8);
  const [totalGain, setTotalGain] = useState(0.6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateButtonText, setGenerateButtonText] = useState("Generate");

  useEffect(() => {
    if (lightInputImage) {
      handleImageChange(lightInputImage, setLightInputImage, setWidth, setHeight);
    }
  }, [lightInputImage]);

  useEffect(() => {
    handleGenerate();
  }, [lightYaw, lightPitch]);

  function postGenerateSuccess(data) {
    const base64Image = data["result"];
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
    setLightOutputImage(imageSrc);

    updateGenerateStatus(
      false,
      setIsGenerating,
      intl.formatMessage({ id: "generate", defaultMessage: "Generate" }),
      setGenerateButtonText,
      "Generate success"
    );
  }

  const handleGenerate = () => {
    if (!lightInputImage) {
      alert("Please upload an image first.");
      return;
    }

    if (isGenerating) {
      console.log("generating, skip");
      return;
    }

    setIsGenerating(true);
    setGenerateButtonText(
      intl.formatMessage({ id: "generating", defaultMessage: "Generating..." })
    );

    console.log("Generating...");

    const payload = {
      image_base64: prepareImage(lightInputImage),
      light_yaw: lightYaw,
      light_pitch: lightPitch,
      specular_power: specularPower,
      normal_diffuse_strength: normalDiffuseStrength,
      specular_highlights_strength: specularHighlightsStrength,
      total_gain: totalGain,
    };

    sendRequest(
      "http://127.0.0.1:7861/ai-assistant/light_process",
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
      title={intl.formatMessage({ id: "lighting", defaultMessage: "Lighting" })}
      breadcrumb={[
        {
          label: intl.formatMessage({ id: "shadow", defaultMessage: "Shadow" }),
          route: "/sections/page-sections/light",
        },
        { label: intl.formatMessage({ id: "lighting", defaultMessage: "Lighting" }) },
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
                      inputImage={lightInputImage}
                      handleImageChange={handleImageChange}
                      setInputImage={setLightInputImage}
                      setHeight={setHeight}
                      setWidth={setWidth}
                      label="normal-mapping"
                    />
                  </Grid>
                  <Grid item xs={6}></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* 其他行 */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <LightConfigPanel
                  lightYaw={lightYaw}
                  setLightYaw={setLightYaw}
                  lightPitch={lightPitch}
                  setLightPitch={setLightPitch}
                  specularPower={specularPower}
                  setSpecularPower={setSpecularPower}
                  normalDiffuseStrength={normalDiffuseStrength}
                  setNormalDiffuseStrength={setNormalDiffuseStrength}
                  specularHighlightsStrength={specularHighlightsStrength}
                  setSpecularHighlightsStrength={setSpecularHighlightsStrength}
                  totalGain={totalGain}
                  setTotalGain={setTotalGain}
                  handleGenerate={handleGenerate}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box m={2}>
                  <MKButton
                    color="info"
                    style={{ marginTop: 8 }}
                    disabled={isGenerating}
                    onClick={handleGenerate}
                  >
                    {generateButtonText}
                  </MKButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <LightOutputPanel
                outputImage={lightOutputImage}
                setLightYaw={setLightYaw}
                setLightPitch={setLightPitch}
              />
              {lightOutputImage && (
                <Box display="flex" flexDirection="row" flexWrap="wrap">
                  <TransferPanel
                    outputImage={lightOutputImage}
                    targetTabInputSetter={setAnimeShadowShadowInputImage}
                    label={"transfer-to-anime-shadow-tab"}
                    targetLink={"/sections/page-sections/anime-shadow"}
                  />
                  <TransferPanel
                    outputImage={lightOutputImage}
                    targetTabInputSetter={setPositiveNegativeShapeInputImage}
                    label={"transfer-to-positive-negative-shape-tab"}
                    targetLink={"/sections/page-sections/positive-negative-shape"}
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

export default Light;
