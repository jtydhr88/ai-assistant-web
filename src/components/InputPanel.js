import React from "react";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

function InputPanel({
  inputImage,
  handleImageChange,
  setInputImage,
  setWidth,
  setHeight,
  postProcess,
  postProcessSuccess,
  postProcessError,
  label,
}) {
  const intl = useIntl();

  return (
    <Box m={2}>
      <Typography variant="h6">
        {intl.formatMessage({ id: label, defaultMessage: label })}
      </Typography>
      <input
        type="file"
        onChange={(event) =>
          handleImageChange(
            event.target.files[0],
            setInputImage,
            setWidth,
            setHeight,
            postProcess,
            postProcessSuccess,
            postProcessError
          )
        }
        style={{ display: "block", marginBottom: 8 }}
      />
      {inputImage && <img src={inputImage} alt="Input" style={{ width: "100%", height: "auto" }} />}
    </Box>
  );
}

InputPanel.propTypes = {
  inputImage: PropTypes.string,
  handleImageChange: PropTypes.func,
  setInputImage: PropTypes.func,
  setWidth: PropTypes.func,
  setHeight: PropTypes.func,
  postProcess: PropTypes.func,
  postProcessSuccess: PropTypes.func,
  postProcessError: PropTypes.func,
  label: PropTypes.string,
};

export default InputPanel;
