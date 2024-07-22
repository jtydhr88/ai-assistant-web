import React from "react";
import { Box } from "@mui/material";
import MKButton from "./MKButton";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";

function TransferPanel({ outputImage, targetTabInputSetter, label, targetLink }) {
  const navigate = useNavigate();
  const intl = useIntl();

  const transfer = () => {
    targetTabInputSetter(outputImage);

    navigate(targetLink);
  };

  return (
    <Box m={2}>
      <MKButton color="info" onClick={transfer}>
        {intl.formatMessage({ id: label, defaultMessage: label })}
      </MKButton>
    </Box>
  );
}

TransferPanel.propTypes = {
  outputImage: PropTypes.string,
  targetTabInputSetter: PropTypes.func,
  label: PropTypes.string,
  targetLink: PropTypes.string.isRequired,
};

export default TransferPanel;
