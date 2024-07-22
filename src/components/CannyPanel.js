import React, { useState } from "react";
import { Box, Slider, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { prepareImage } from "../utils/ImgUtils";
import { sendRequest } from "../utils/RequestApi";
import MKButton from "./MKButton";
import { postGenerateError } from "../utils/GenerateStatus";
import { useIntl } from "react-intl";

function CannyPanel({ inputImage, cannyImage, setCannyImage }) {
  const intl = useIntl();

  const [cannyThreshold1, setCannyThreshold1] = useState(20);
  const [cannyThreshold2, setCannyThreshold2] = useState(120);

  function processCanny() {
    if (!inputImage) {
      alert("Please upload an image first.");
      return;
    }

    const payload = {
      image_base64: prepareImage(inputImage),
      canny_threshold1: cannyThreshold1,
      canny_threshold2: cannyThreshold2,
    };

    sendRequest(
      "http://127.0.0.1:7861/ai-assistant/canny_process",
      "POST",
      payload,
      (data) => {
        const base64Image = data["result"];
        const imageSrc = `data:image/jpeg;base64,${base64Image}`;

        setCannyImage(imageSrc);
      },
      () => {
        postGenerateError();
      }
    );
  }

  return (
    <Box m={2}>
      <Typography variant="h6">
        {intl.formatMessage({ id: "canny-image", defaultMessage: "Canny Image" })}
      </Typography>
      {cannyImage && <img src={cannyImage} alt="Canny" style={{ width: "100%", height: "auto" }} />}
      <Typography>
        {intl.formatMessage({ id: "canny-threshold1", defaultMessage: "Canny Threshold1" })}
      </Typography>
      <Slider
        value={cannyThreshold1}
        onChange={(e, newValue) => setCannyThreshold1(newValue)}
        onChangeCommitted={processCanny}
        step={1}
        min={0}
        max={253}
        valueLabelDisplay="auto"
      />
      <Typography>
        {intl.formatMessage({ id: "canny-threshold2", defaultMessage: "Canny Threshold2" })}
      </Typography>
      <Slider
        value={cannyThreshold2}
        onChange={(e, newValue) => setCannyThreshold2(newValue)}
        onChangeCommitted={processCanny}
        step={1}
        min={0}
        max={254}
        valueLabelDisplay="auto"
      />
      <MKButton color="info" onClick={processCanny}>
        {intl.formatMessage({ id: "create", defaultMessage: "Create" })}
      </MKButton>
    </Box>
  );
}

CannyPanel.propTypes = {
  inputImage: PropTypes.string.isRequired,
  cannyImage: PropTypes.string,
  setCannyImage: PropTypes.func,
};

export default CannyPanel;
