import React from "react";
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

function AnimeShadowConfigPanel({ animeShadowType, setAnimeShadowType }) {
  const intl = useIntl();

  const handleChange = (event) => {
    setAnimeShadowType(event.target.value);
  };

  return (
    <Box m={2}>
      <FormControl component="fieldset">
        <FormLabel component="legend">
          {intl.formatMessage({ id: "anime-shadow-type", defaultMessage: "Anime Shadow Type" })}
        </FormLabel>
        <RadioGroup value={animeShadowType} onChange={handleChange}>
          <Box display="flex" flexDirection="row" flexWrap="wrap">
            <FormControlLabel
              value="anime01"
              control={<Radio />}
              label={intl.formatMessage({ id: "anime01", defaultMessage: "anime01" })}
            />
            <FormControlLabel
              value="anime02"
              control={<Radio />}
              label={intl.formatMessage({ id: "anime02", defaultMessage: "anime02" })}
            />
            <FormControlLabel
              value="anime03"
              control={<Radio />}
              label={intl.formatMessage({ id: "anime03", defaultMessage: "anime03" })}
            />
          </Box>
        </RadioGroup>
      </FormControl>
    </Box>
  );
}

AnimeShadowConfigPanel.propTypes = {
  animeShadowType: PropTypes.string.isRequired,
  setAnimeShadowType: PropTypes.func.isRequired,
};

export default AnimeShadowConfigPanel;
