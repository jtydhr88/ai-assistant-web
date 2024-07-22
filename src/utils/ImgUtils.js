import { StaticCanvas, Rect } from "fabric";

function prepareImage(image) {
  return image.replace("data:", "").replace(/^.+,/, "");
}

function baseGeneration(size, color) {
  const canvas = new StaticCanvas(null, { width: size[0], height: size[1] });

  let fill;

  if (color.length === 3) {
    fill = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  } else {
    fill = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`;
  }

  const rect = new Rect({
    left: 0,
    top: 0,
    fill: fill,
    width: size[0],
    height: size[1],
  });

  canvas.add(rect);
  canvas.renderAll();

  return canvas.toDataURL();
}

function base64ToBlob(base64, contentType) {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: contentType });
}

function handleImageChange(
  file,
  setImage,
  setWidth,
  setHeight,
  postProcess,
  postProcessSuccess,
  postProcessError
) {
  if (!(file instanceof Blob)) {
    file = base64ToBlob(file, "image/jpeg");
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setImage(reader.result);

    if (postProcess) {
      postProcess(reader.result, postProcessSuccess, postProcessError);
    }

    const img = new Image();

    img.onload = () => {
      console.log("Width:", img.width, "Height:", img.height);
      setWidth(img.width);

      setHeight(img.height);
    };

    img.src = reader.result;
  };

  reader.readAsDataURL(file);
}

function handleMaskChange(file, setMaskImage) {
  if (!(file instanceof Blob)) {
    file = base64ToBlob(file, "image/jpeg");
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setMaskImage(reader.result);
  };

  reader.readAsDataURL(file);
}

export { prepareImage, baseGeneration, handleImageChange, handleMaskChange };
