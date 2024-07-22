import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import MKButton from "./MKButton";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

function TransparentBackgroundOutputPanel({ outputImage }) {
  const intl = useIntl();

  const canvasRef = useRef(null);

  const handleDownloadImage = () => {
    console.log("Downloading image...");

    const link = document.createElement("a");
    link.href = outputImage;
    link.download = "output-image.jpeg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    const drawPatternBackground = () => {
      // Draw pattern background
      const patternCanvas = document.createElement("canvas");
      patternCanvas.width = 10;
      patternCanvas.height = 10;
      const pctx = patternCanvas.getContext("2d");

      // Draw white dot pattern
      pctx.fillStyle = "#efefef";
      pctx.beginPath();
      pctx.arc(5, 5, 2, 0, 2 * Math.PI);
      pctx.fill();

      // Create pattern and set as background
      const pattern = ctx.createPattern(patternCanvas, "repeat");
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const resizeCanvas = () => {
      const image = new Image();
      image.src = outputImage;

      image.onload = () => {
        const aspectRatio = image.width / image.height;
        const containerWidth = canvas.clientWidth;
        const containerHeight = containerWidth / aspectRatio;

        canvas.width = containerWidth;
        canvas.height = containerHeight;

        drawPatternBackground();
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
    };

    drawPatternBackground();

    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [outputImage]);

  return (
    <Box m={2}>
      <Typography variant="h6">
        {intl.formatMessage({ id: "output-image", defaultMessage: "Output Image" })}
      </Typography>
      <Box>
        <div id="canvasContainer" style={{ position: "relative", width: "100%", height: "auto" }}>
          <canvas
            ref={canvasRef}
            id="transparentBackgroundCanvas"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
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

TransparentBackgroundOutputPanel.propTypes = {
  outputImage: PropTypes.string,
  targetTabInputSetter: PropTypes.func,
};

export default TransparentBackgroundOutputPanel;
