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

function NormalConfigPanel({ imageFidelity, setImageFidelity, coloringType, setColoringType }) {
  const handleChange = (event) => {
    setColoringType(event.target.value);
  };
  const intl = useIntl();

  return (
    <Box m={2}>
      <FormControl component="fieldset">
        <FormLabel component="legend">
          {intl.formatMessage({ id: "coloring-type", defaultMessage: "Coloring Type" })}
        </FormLabel>
        <RadioGroup value={coloringType} onChange={handleChange}>
          <Box display="flex" flexDirection="row" flexWrap="wrap">
            <FormControlLabel
              value="watercolor"
              control={<Radio />}
              label={intl.formatMessage({ id: "watercolor", defaultMessage: "Watercolor" })}
            />
            <FormControlLabel
              value="thick-coating"
              control={<Radio />}
              label={intl.formatMessage({ id: "thick-coating", defaultMessage: "Thick Coating" })}
            />
            <FormControlLabel
              value="anime-coloring"
              control={<Radio />}
              label={intl.formatMessage({ id: "anime-coloring", defaultMessage: "Anime Coloring" })}
            />
          </Box>
        </RadioGroup>
      </FormControl>
      <Typography>
        {intl.formatMessage({ id: "image-fidelity", defaultMessage: "Image Fidelity" })}
      </Typography>
      <Slider
        value={imageFidelity}
        onChange={(e, newValue) => setImageFidelity(newValue)}
        step={0.01}
        min={0.1}
        max={0.5}
        valueLabelDisplay="auto"
      />
    </Box>
  );
}

NormalConfigPanel.propTypes = {
  imageFidelity: PropTypes.number.isRequired,
  setImageFidelity: PropTypes.func.isRequired,
  coloringType: PropTypes.string.isRequired,
  setColoringType: PropTypes.func.isRequired,
};

export default NormalConfigPanel;
