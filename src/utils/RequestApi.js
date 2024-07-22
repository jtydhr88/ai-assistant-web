import { prepareImage } from "./ImgUtils";

function sendRequest(
  url,
  method,
  payload,
  postSuccess,
  postError,
  setIsGenerating,
  setGenerateButtonText
) {
  console.log(payload);

  try {
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        postSuccess(data, setIsGenerating, setGenerateButtonText);
      })
      .catch((error) => {
        postError(error, setIsGenerating, setGenerateButtonText);
      });
  } catch (error) {
    postError(error, setIsGenerating, setGenerateButtonText);
  }
}

function processInvert(inputImage, postGenerateSuccess, postGenerateError) {
  const payload = { image_base64: prepareImage(inputImage) };

  sendRequest(
    "http://127.0.0.1:7861/ai-assistant/invert_process",
    "POST",
    payload,
    (data) => {
      const base64Image = data["result"];
      const imageSrc = `data:image/jpeg;base64,${base64Image}`;

      postGenerateSuccess(imageSrc);
    },
    () => {
      postGenerateError();
    }
  );
}

function processNoline(inputImage, postGenerateSuccess, postGenerateError) {
  const payload = { image_base64: prepareImage(inputImage) };

  sendRequest(
    "http://127.0.0.1:7861/ai-assistant/noline_process",
    "POST",
    payload,
    (data) => {
      const base64Image = data["result"];
      const imageSrc = `data:image/jpeg;base64,${base64Image}`;

      postGenerateSuccess(imageSrc);
    },
    () => {
      postGenerateError();
    }
  );
}

export { sendRequest, processInvert, processNoline };
