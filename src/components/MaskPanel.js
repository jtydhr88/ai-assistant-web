import React from "react";
import { Box, Typography } from "@mui/material";
import MKButton from "./MKButton";
import { prepareImage } from "../utils/ImgUtils";
import { sendRequest } from "../utils/RequestApi";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

// eslint-disable-next-line react/prop-types
function MaskPanel({ inputImage, maskImage, setMaskImage, handleMaskChange, postGenerateError }) {
  const intl = useIntl();

  function processMask(inputImage, setMaskImage, postGenerateError) {
    const payload = { image_base64: prepareImage(inputImage) };

    sendRequest(
      "http://127.0.0.1:7861/ai-assistant/mask_process",
      "POST",
      payload,
      (data) => {
        const base64Image = data["result"];
        const imageSrc = `data:image/jpeg;base64,${base64Image}`;

        setMaskImage(imageSrc);
      },
      () => {
        postGenerateError();
      }
    );
  }

  function createMask(event, inputImage, setMaskImage, postGenerateError) {
    if (!inputImage) {
      alert("Please upload an image first.");
      return;
    }

    processMask(inputImage, setMaskImage, postGenerateError);
  }

  return (
    <Box m={2}>
      <Typography variant="h6">
        {intl.formatMessage({ id: "mask-image", defaultMessage: "Mask Image" })}
      </Typography>
      <input
        type="file"
        onChange={(event) => handleMaskChange(event.target.files[0], setMaskImage)}
        style={{ display: "block", marginBottom: 8 }}
      />
      {maskImage && <img src={maskImage} alt="Mask" style={{ width: "100%", height: "auto" }} />}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 1 }}>
        <MKButton
          color="info"
          onClick={(e) => createMask(e, inputImage, setMaskImage, postGenerateError)}
        >
          {intl.formatMessage({ id: "create", defaultMessage: "Create" })}
        </MKButton>
      </Box>
    </Box>
  );
}

MaskPanel.propTypes = {
  inputImage: PropTypes.string,
  maskImage: PropTypes.string,
  setMaskImage: PropTypes.func,
  handleMaskChange: PropTypes.func,
  postGenerateError: PropTypes.func,
};

export default MaskPanel;
