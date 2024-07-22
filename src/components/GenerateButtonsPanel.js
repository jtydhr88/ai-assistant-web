import React from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import MKButton from "./MKButton";
import { useIntl } from "react-intl";

function GenerateButtonsPanel({
  isGenerating,
  setIsGenerating,
  handleGenerate,
  generateButtonText,
  isInterruptable,
  setIsInterruptable,
}) {
  const intl = useIntl();
  function handleCancel() {
    fetch("http://127.0.0.1:7861/sdapi/v1/interrupt", {
      method: "POST",
    }).then((data) => console.log(data));

    setIsGenerating(false);
    setIsInterruptable(false);
  }
  return (
    <Box m={2} display="flex" flexDirection="row" justifyContent="space-between">
      <MKButton color="info" disabled={isGenerating} onClick={handleGenerate}>
        {generateButtonText}
      </MKButton>
      <MKButton color="info" diabled={!isInterruptable} onClick={handleCancel}>
        {intl.formatMessage({ id: "interrupt", defaultMessage: "Interrupt" })}
      </MKButton>
    </Box>
  );
}

GenerateButtonsPanel.propTypes = {
  isGenerating: PropTypes.bool.isRequired,
  setIsGenerating: PropTypes.func.isRequired,
  handleGenerate: PropTypes.func.isRequired,
  generateButtonText: PropTypes.string.isRequired,
  isInterruptable: PropTypes.bool.isRequired,
  setIsInterruptable: PropTypes.func,
};

export default GenerateButtonsPanel;
