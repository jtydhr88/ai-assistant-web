import React from "react";
import { Box, Slider, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

function ResizeConfigPanel({ maxLengthScale, setMaxLengthScale }) {
  const intl = useIntl();
  return (
    <Box m={2}>
      <Typography>
        {intl.formatMessage({ id: "max-length-scale", defaultMessage: "Max Length Scale" })}
      </Typography>
      <Slider
        value={maxLengthScale}
        onChange={(e, newValue) => setMaxLengthScale(newValue)}
        step={1}
        min={1600}
        max={2880}
        valueLabelDisplay="auto"
      />
    </Box>
  );
}

ResizeConfigPanel.propTypes = {
  maxLengthScale: PropTypes.number.isRequired,
  setMaxLengthScale: PropTypes.func.isRequired,
};

export default ResizeConfigPanel;
