import React, { useState } from "react";
import { prepareImage } from "../utils/ImgUtils";
import MKInput from "./MKInput";
import Box from "@mui/material/Box";
import MKButton from "./MKButton";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";

function PromptAnalyzer({
  inputImage,
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  allPromptSetters,
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const intl = useIntl();

  const sharePrompt = () => {
    allPromptSetters.forEach((promptSetter) => {
      promptSetter(prompt);
    });
  };

  const handleAnalyzePrompt = async () => {
    if (!inputImage) {
      alert(
        intl.formatMessage({
          id: "please-upload-an-image-first",
          defaultMessage: "Please upload an image first.",
        })
      );
      return;
    }

    console.log("Analyzing prompt...");

    setIsAnalyzing(true);

    try {
      const response = await fetch("http://127.0.0.1:7861/ai-assistant/prompt_analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: prepareImage(inputImage) }),
      });

      if (response.ok) {
        const data = await response.json();
        setPrompt(data["result"]);
      } else {
        throw new Error("Failed to analyze image");
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Box m={2}>
      <MKInput
        variant="standard"
        fullWidth
        multiline
        maxRows={5}
        label={intl.formatMessage({ id: "prompt", defaultMessage: "Prompt" })}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <MKInput
        variant="standard"
        fullWidth
        multiline
        maxRows={5}
        label={intl.formatMessage({ id: "negative-prompt", defaultMessage: "Negative Prompt" })}
        value={negativePrompt}
        onChange={(e) => setNegativePrompt(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <Box m={2} display="flex" flexDirection="row" justifyContent="space-between">
        <MKButton color="info" disabled={isAnalyzing} onClick={handleAnalyzePrompt}>
          {isAnalyzing ? (
            <FormattedMessage id="analyzing" defaultMessage="Analyzing" />
          ) : (
            <FormattedMessage id="analyze-prompt" defaultMessage="Analyze Prompt" />
          )}
        </MKButton>
        <MKButton color="info" onClick={sharePrompt}>
          <FormattedMessage id="share-prompt" defaultMessage="Share Prompt" />
        </MKButton>
      </Box>
    </Box>
  );
}

PromptAnalyzer.propTypes = {
  inputImage: PropTypes.string,
  prompt: PropTypes.string,
  setPrompt: PropTypes.func.isRequired,
  negativePrompt: PropTypes.string,
  setNegativePrompt: PropTypes.func.isRequired,
  allPromptSetters: PropTypes.array,
};

export default PromptAnalyzer;
