import React from "react";
import { Box, Slider, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

function Img2ImgConfigPanel({ imageFidelity, setImageFidelity }) {
  const intl = useIntl();
  return (
    <Box m={2}>
      <Typography>
        {intl.formatMessage({ id: "image-fidelity", defaultMessage: "Image Fidelity" })}
      </Typography>
      <Slider
        value={imageFidelity}
        onChange={(e, newValue) => setImageFidelity(newValue)}
        step={0.01}
        min={0}
        max={1}
        valueLabelDisplay="auto"
      />
    </Box>
  );
}

Img2ImgConfigPanel.propTypes = {
  imageFidelity: PropTypes.number.isRequired,
  setImageFidelity: PropTypes.func.isRequired,
};

export default Img2ImgConfigPanel;
