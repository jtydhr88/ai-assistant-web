import React from "react";
import { Box, Typography } from "@mui/material";
import MKProgress from "./MKProgress";
import PropTypes from "prop-types";

function ProgressIndicator({ progress, currentStep, totalSteps }) {
  const normalizedProgress = progress * 100;

  return (
    <Box m={2} sx={{ width: "100%", mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {`Step ${currentStep} of ${totalSteps}`}
      </Typography>
      <Box>
        <MKProgress color="primary" value={normalizedProgress} />
      </Box>
    </Box>
  );
}

ProgressIndicator.propTypes = {
  progress: PropTypes.number.isRequired,
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
};

export default ProgressIndicator;
