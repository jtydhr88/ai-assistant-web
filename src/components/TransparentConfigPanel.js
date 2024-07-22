import React from "react";
import { Box, Slider, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

function TransparentConfigPanel({ transparentThreshold, setTransparentThreshold, handleGenerate }) {
  const intl = useIntl();
  const handleChange = (e, newValue) => {
    setTransparentThreshold(newValue);
  };

  const handleChangeCommitted = () => {
    handleGenerate();
  };

  return (
    <Box m={2}>
      <Typography>
        {intl.formatMessage({
          id: "transparent-threshold",
          defaultMessage: "Transparent Threshold",
        })}
      </Typography>
      <Slider
        value={transparentThreshold}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        step={1}
        min={1}
        max={99}
        valueLabelDisplay="auto"
      />
    </Box>
  );
}

TransparentConfigPanel.propTypes = {
  transparentThreshold: PropTypes.number.isRequired,
  setTransparentThreshold: PropTypes.func.isRequired,
  handleGenerate: PropTypes.func.isRequired,
};

export default TransparentConfigPanel;
