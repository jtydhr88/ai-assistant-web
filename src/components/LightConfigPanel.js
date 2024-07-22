import React from "react";
import { Box, Slider, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

function LightConfigPanel({
  lightYaw,
  setLightYaw,
  lightPitch,
  setLightPitch,
  specularPower,
  setSpecularPower,
  normalDiffuseStrength,
  setNormalDiffuseStrength,
  specularHighlightsStrength,
  setSpecularHighlightsStrength,
  totalGain,
  setTotalGain,
  handleGenerate,
}) {
  const intl = useIntl();
  const handleChangeCommitted = () => {
    handleGenerate();
  };

  return (
    <Box m={2}>
      <Typography>
        {intl.formatMessage({ id: "light-yaw", defaultMessage: "Light Yaw" })}
      </Typography>
      <Slider
        value={lightYaw}
        onChange={(e, newValue) => setLightYaw(newValue)}
        onChangeCommitted={handleChangeCommitted}
        step={0.1}
        min={-180}
        max={180}
        valueLabelDisplay="auto"
      />
      <Typography>
        {intl.formatMessage({ id: "light-pitch", defaultMessage: "Light Pitch" })}
      </Typography>
      <Slider
        value={lightPitch}
        onChange={(e, newValue) => setLightPitch(newValue)}
        onChangeCommitted={handleChangeCommitted}
        step={0.1}
        min={-90}
        max={90}
        valueLabelDisplay="auto"
      />
      <Typography>
        {intl.formatMessage({ id: "specular-power", defaultMessage: "Specular Power" })}
      </Typography>
      <Slider
        value={specularPower}
        onChange={(e, newValue) => setSpecularPower(newValue)}
        onChangeCommitted={handleChangeCommitted}
        step={0.1}
        min={10}
        max={100}
        valueLabelDisplay="auto"
      />
      <Typography>
        {intl.formatMessage({
          id: "normal-diffuse-strength",
          defaultMessage: "Normal Diffuse Strength",
        })}
      </Typography>
      <Slider
        value={normalDiffuseStrength}
        onChange={(e, newValue) => setNormalDiffuseStrength(newValue)}
        onChangeCommitted={handleChangeCommitted}
        step={0.1}
        min={0}
        max={5}
        valueLabelDisplay="auto"
      />
      <Typography>
        {intl.formatMessage({
          id: "specular-highlights-strength",
          defaultMessage: "Specular Highlights Strength",
        })}
      </Typography>
      <Slider
        value={specularHighlightsStrength}
        onChange={(e, newValue) => setSpecularHighlightsStrength(newValue)}
        onChangeCommitted={handleChangeCommitted}
        step={0.1}
        min={0}
        max={5}
        valueLabelDisplay="auto"
      />
      <Typography>
        {intl.formatMessage({ id: "total-gain", defaultMessage: "Total Gain" })}
      </Typography>
      <Slider
        value={totalGain}
        onChange={(e, newValue) => setTotalGain(newValue)}
        onChangeCommitted={handleChangeCommitted}
        step={0.01}
        min={0}
        max={1}
        valueLabelDisplay="auto"
      />
    </Box>
  );
}

LightConfigPanel.propTypes = {
  lightYaw: PropTypes.number.isRequired,
  setLightYaw: PropTypes.func.isRequired,
  lightPitch: PropTypes.number.isRequired,
  setLightPitch: PropTypes.func.isRequired,
  specularPower: PropTypes.number.isRequired,
  setSpecularPower: PropTypes.func.isRequired,
  normalDiffuseStrength: PropTypes.number.isRequired,
  setNormalDiffuseStrength: PropTypes.func.isRequired,
  specularHighlightsStrength: PropTypes.number.isRequired,
  setSpecularHighlightsStrength: PropTypes.func.isRequired,
  totalGain: PropTypes.number.isRequired,
  setTotalGain: PropTypes.func.isRequired,
  handleGenerate: PropTypes.func.isRequired,
};

export default LightConfigPanel;
