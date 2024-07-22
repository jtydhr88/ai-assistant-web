import React from "react";
import { Box, Slider, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

function LineDrawingConfigPanel({
  lineDrawingFidelity,
  setLineDrawingFidelity,
  lineDrawingBold,
  setLineDrawingBold,
}) {
  const intl = useIntl();
  return (
    <Box m={2}>
      <Typography>
        {intl.formatMessage({
          id: "line-drawing-fidelity",
          defaultMessage: "Line Drawing Fidelity",
        })}
      </Typography>
      <Slider
        value={lineDrawingFidelity}
        onChange={(e, newValue) => setLineDrawingFidelity(newValue)}
        step={0.01}
        min={0.5}
        max={1.25}
        valueLabelDisplay="auto"
      />
      <Typography>
        {intl.formatMessage({
          id: "line-drawing-boldness",
          defaultMessage: "Line Drawing Boldness",
        })}
      </Typography>
      <Slider
        value={lineDrawingBold}
        onChange={(e, newValue) => setLineDrawingBold(newValue)}
        step={0.01}
        min={0}
        max={1}
        valueLabelDisplay="auto"
      />
    </Box>
  );
}

LineDrawingConfigPanel.propTypes = {
  lineDrawingFidelity: PropTypes.number.isRequired,
  setLineDrawingFidelity: PropTypes.func.isRequired,
  lineDrawingBold: PropTypes.number.isRequired,
  setLineDrawingBold: PropTypes.func.isRequired,
};

export default LineDrawingConfigPanel;
