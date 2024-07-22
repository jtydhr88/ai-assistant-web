import React from "react";
import { Box, Slider, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

function NormalConfigPanel({ linearFidelity, setLinearFidelity }) {
  const intl = useIntl();
  return (
    <Box m={2}>
      <Typography>
        {intl.formatMessage({ id: "lineart-fidelity", defaultMessage: "Linear Fidelity" })}
      </Typography>
      <Slider
        value={linearFidelity}
        onChange={(e, newValue) => setLinearFidelity(newValue)}
        step={0.01}
        min={0.5}
        max={1.25}
        valueLabelDisplay="auto"
      />
    </Box>
  );
}

NormalConfigPanel.propTypes = {
  linearFidelity: PropTypes.number.isRequired,
  setLinearFidelity: PropTypes.func.isRequired,
};

export default NormalConfigPanel;
