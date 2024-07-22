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

function PositiveNegativeShapeConfigPanel({
  thresholds,
  setThresholds,
  greyscaleType,
  setGreyscaleType,
  greyscale1Value,
  setGreyscale1Value,
  greyscale2Value,
  setGreyscale2Value,
  handleGenerate,
}) {
  const intl = useIntl();

  const handleChange = (event, newValue) => {
    setThresholds(newValue);
  };

  const handleGreyscale1Change = (event, newValue) => {
    setGreyscale1Value(newValue);
  };

  const handleGreyscale2Change = (event, newValue) => {
    setGreyscale2Value(newValue);
  };

  const handleGreyscaleChange = (event, newValue) => {
    setGreyscaleType(newValue);

    if (newValue === "greyscale1") {
      if (thresholds.length === 4) {
        thresholds.splice(2, 1);
      } else if (thresholds.length === 5) {
        thresholds.splice(2, 2);
      }
    } else if (newValue === "greyscale2") {
      if (thresholds.length === 3) {
        const newValue = (thresholds[1] + thresholds[2]) / 2;
        thresholds.splice(2, 0, newValue);
      } else if (thresholds.length === 5) {
        thresholds.splice(3, 1);
      }
    }
  };

  const handleChangeCommitted = () => {
    handleGenerate();
  };

  return (
    <Box m={2}>
      <FormControl component="fieldset">
        <FormLabel component="legend">
          {intl.formatMessage({ id: "greyscale", defaultMessage: "Greyscale" })}
        </FormLabel>
        <RadioGroup value={greyscaleType} onChange={handleGreyscaleChange}>
          <FormControlLabel
            value="greyscale1"
            control={<Radio />}
            label={intl.formatMessage({ id: "greyscale1", defaultMessage: "greyscale1" })}
          />
          <FormControlLabel
            value="greyscale2"
            control={<Radio />}
            label={intl.formatMessage({ id: "greyscale2", defaultMessage: "greyscale2" })}
          />
        </RadioGroup>
      </FormControl>
      <Typography>
        {intl.formatMessage({ id: "thresholds", defaultMessage: "Thresholds" })}
      </Typography>
      <Slider
        value={thresholds}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        valueLabelDisplay="auto"
        min={1}
        max={255}
      />
      <Typography>
        {intl.formatMessage({ id: "greyscale1-value", defaultMessage: "Greyscale1 Value" })}
      </Typography>
      <Slider
        value={greyscale1Value}
        onChange={handleGreyscale1Change}
        onChangeCommitted={handleChangeCommitted}
        valueLabelDisplay="auto"
        min={1}
        max={255}
      />
      {greyscaleType === "greyscale2" && (
        <Box>
          <Typography>
            {intl.formatMessage({ id: "greyscale2-value", defaultMessage: "Greyscale2 Value" })}
          </Typography>
          <Slider
            value={greyscale2Value}
            onChange={handleGreyscale2Change}
            onChangeCommitted={handleChangeCommitted}
            valueLabelDisplay="auto"
            min={1}
            max={255}
          />
        </Box>
      )}
    </Box>
  );
}

PositiveNegativeShapeConfigPanel.propTypes = {
  thresholds: PropTypes.array,
  setThresholds: PropTypes.func,
  greyscaleType: PropTypes.string,
  setGreyscaleType: PropTypes.func,
  greyscale1Value: PropTypes.number,
  setGreyscale1Value: PropTypes.func,
  greyscale2Value: PropTypes.number,
  setGreyscale2Value: PropTypes.func,
  greyscale3Value: PropTypes.number,
  setGreyscale3Value: PropTypes.func,
  handleGenerate: PropTypes.func,
};

export default PositiveNegativeShapeConfigPanel;
