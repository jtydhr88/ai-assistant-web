import React from "react";
import { Box, Typography } from "@mui/material";
import MKButton from "./MKButton";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

function OutputPanel({ outputImage }) {
  const intl = useIntl();
  const handleDownloadImage = () => {
    console.log("Downloading image...");

    const link = document.createElement("a");
    link.href = outputImage;
    link.download = "output-image.jpeg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box m={2}>
      <Typography variant="h6">
        {intl.formatMessage({ id: "output-image", defaultMessage: "Output Image" })}
      </Typography>
      <Box>
        {outputImage && (
          <img src={outputImage} alt="Output" style={{ width: "100%", height: "auto" }} />
        )}
      </Box>
      {outputImage && (
        <Box>
          <MKButton color="info" style={{ marginTop: 8 }} onClick={handleDownloadImage}>
            {intl.formatMessage({ id: "download", defaultMessage: "Download" })}
          </MKButton>
        </Box>
      )}
    </Box>
  );
}

OutputPanel.propTypes = {
  outputImage: PropTypes.string,
  targetTabInputSetter: PropTypes.func,
};

export default OutputPanel;
