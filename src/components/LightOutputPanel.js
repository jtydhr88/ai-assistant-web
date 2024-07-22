import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import MKButton from "./MKButton";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

function LightOutputPanel({ outputImage, setLightYaw, setLightPitch }) {
  const canvasRef = useRef(null);
  const lightSourceRef = useRef(null);
  const draggingRef = useRef(false);
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

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    const lightSource = lightSourceRef.current;

    const resizeCanvas = () => {
      const image = new Image();
      image.src = outputImage;

      image.onload = () => {
        const aspectRatio = image.width / image.height;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientWidth / aspectRatio;

        if (canvas.height > canvas.clientHeight) {
          canvas.height = canvas.clientHeight;
          canvas.width = canvas.clientHeight * aspectRatio;
        }

        if (parseFloat(lightSource.style.left) > canvas.width - 10) {
          lightSource.style.left = `${canvas.width - 10}px`;
        }

        if (parseFloat(lightSource.style.top) > canvas.height - 10) {
          lightSource.style.top = `${canvas.height - 10}px`;
        }

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function getYawPitch(width, height, lightX, lightY) {
      const thirdWidth = width / 3;
      const thirdHeight = height / 3;

      if (
        lightX >= thirdWidth &&
        lightX <= 2 * thirdWidth &&
        lightY >= thirdHeight &&
        lightY <= 2 * thirdHeight
      ) {
        return { yaw: 0, pitch: 0 }; // 正中
      } else if (lightX >= thirdWidth && lightX <= 2 * thirdWidth && lightY < thirdHeight) {
        return { yaw: 60, pitch: -60 }; // 正上方
      } else if (lightX < thirdWidth && lightY < thirdHeight) {
        return { yaw: 40, pitch: -60 }; // 左上角
      } else if (lightX > 2 * thirdWidth && lightY < thirdHeight) {
        return { yaw: 60, pitch: -40 }; // 右上角
      } else if (lightX < thirdWidth && lightY >= thirdHeight && lightY <= 2 * thirdHeight) {
        return { yaw: 0, pitch: 0 }; // 正左方
      } else if (lightX > 2 * thirdWidth && lightY >= thirdHeight && lightY <= 2 * thirdHeight) {
        return { yaw: 90, pitch: 0 }; // 正右方
      } else if (lightX >= thirdWidth && lightX <= 2 * thirdWidth && lightY > 2 * thirdHeight) {
        return { yaw: 45, pitch: 0 }; // 正下方
      } else if (lightX < thirdWidth && lightY > 2 * thirdHeight) {
        return { yaw: 22.5, pitch: 0 }; // 左下角
      } else if (lightX > 2 * thirdWidth && lightY > 2 * thirdHeight) {
        return { yaw: 67.5, pitch: 0 }; // 右下角
      } else {
        return { yaw: 0, pitch: 0 }; // 默认值
      }
    }

    const onMouseMove = (e) => {
      if (!draggingRef.current) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      let lightX = e.clientX - rect.left;
      let lightY = e.clientY - rect.top;

      lightX = Math.max(10, Math.min(lightX, canvas.width - 10));
      lightY = Math.max(10, Math.min(lightY, canvas.height - 10));

      lightSource.style.left = `${lightX}px`;
      lightSource.style.top = `${lightY}px`;
    };

    const onMouseUp = () => {
      if (draggingRef.current) {
        draggingRef.current = false;

        const lightX = parseFloat(lightSource.style.left);
        const lightY = parseFloat(lightSource.style.top);

        const { yaw, pitch } = getYawPitch(canvas.width, canvas.height, lightX, lightY);
        setLightYaw(yaw);
        setLightPitch(pitch);

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }
    };

    const onMouseDown = () => {
      draggingRef.current = true;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    lightSource.addEventListener("mousedown", onMouseDown);

    return () => {
      lightSource.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [outputImage]);

  return (
    <Box m={2}>
      <Typography variant="h6">
        {intl.formatMessage({ id: "output-image", defaultMessage: "Output Image" })}
      </Typography>
      <Box>
        {outputImage && (
          <div id="canvasContainer" style={{ position: "relative", width: "100%", height: "auto" }}>
            <canvas
              ref={canvasRef}
              id="normalMapCanvas"
              style={{ width: "100%", height: "auto" }}
            />
            <div
              ref={lightSourceRef}
              id="lightSource"
              style={{
                position: "absolute",
                width: "20px",
                height: "20px",
                backgroundColor: "red",
                borderRadius: "50%",
                cursor: "pointer",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
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

LightOutputPanel.propTypes = {
  outputImage: PropTypes.string,
  targetTabInputSetter: PropTypes.func,
  setLightYaw: PropTypes.func,
  setLightPitch: PropTypes.func,
};

export default LightOutputPanel;
