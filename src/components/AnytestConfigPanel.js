import React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Slider,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

function AnytestConfigPanel({
  anytestType,
  setAnytestType,
  anytestInputImage,
  setAnytestInputImage,
  anytestFidelity,
  setAnytestFidelity,
}) {
  const intl = useIntl();
  const handleChange = (event) => {
    setAnytestType(event.target.value);
  };

  const handleAnytestImageChange = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setAnytestInputImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box m={2}>
      <FormControl component="fieldset">
        <FormLabel component="legend">
          {intl.formatMessage({ id: "anytest-type", defaultMessage: "Anytest Type" })}
        </FormLabel>
        <RadioGroup value={anytestType} onChange={handleChange}>
          <Box display="flex" flexDirection="row" flexWrap="wrap">
            <FormControlLabel
              value="none"
              control={<Radio />}
              label={intl.formatMessage({ id: "none", defaultMessage: "none" })}
            />
            <FormControlLabel
              value="anytestV3"
              control={<Radio />}
              label={intl.formatMessage({ id: "anytestV3", defaultMessage: "anytestV3" })}
            />
            <FormControlLabel
              value="anytestV4"
              control={<Radio />}
              label={intl.formatMessage({ id: "anytestV4", defaultMessage: "anytestV4" })}
            />
          </Box>
        </RadioGroup>
      </FormControl>
      {anytestType !== "none" && (
        <Box>
          <Typography>
            {intl.formatMessage({ id: "anytest-fidelity", defaultMessage: "Anytest Fidelity" })}
          </Typography>
          <Slider
            value={anytestFidelity}
            onChange={(e, newValue) => setAnytestFidelity(newValue)}
            step={0.01}
            min={0.35}
            max={1.25}
            valueLabelDisplay="auto"
          />
        </Box>
      )}
      {anytestType !== "none" && (
        <input
          type="file"
          onChange={(event) => handleAnytestImageChange(event.target.files[0])}
          style={{ display: "block", marginBottom: 8 }}
        />
      )}
      {anytestType !== "none" && anytestInputImage && (
        <img src={anytestInputImage} alt="Input" style={{ width: "100%", height: "auto" }} />
      )}
    </Box>
  );
}

AnytestConfigPanel.propTypes = {
  anytestType: PropTypes.string.isRequired,
  setAnytestType: PropTypes.func.isRequired,
  anytestInputImage: PropTypes.string,
  setAnytestInputImage: PropTypes.func,
  anytestFidelity: PropTypes.number,
  setAnytestFidelity: PropTypes.func,
};

export default AnytestConfigPanel;
