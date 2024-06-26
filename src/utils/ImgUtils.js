import {fabric} from 'fabric';

function loadImage(url) {
    return new Promise(resolve => {
        fabric.Image.fromURL(url, (img) => {
            resolve(img);
        });
    });
}

async function invertProcess(imageURL) {
    const img = await loadImage(imageURL);

    const canvas = new fabric.Canvas();

    img.set({
        left: 0,
        top: 0,
    });
    canvas.add(img);

    canvas.renderAll();

    img.filters.push(new fabric.Image.filters.Invert());
    img.applyFilters();

    canvas.renderAll();

    return canvas.toDataURL();
}

async function maskProcess(imageSrc) {
    const imgElement = document.createElement('img');
    imgElement.src = imageSrc;
    await imgElement.decode();  // 确保图像加载完成

    const mat = cv.imread(imgElement);
    const matRGBA = new cv.Mat();
    cv.cvtColor(mat, matRGBA, cv.COLOR_BGR2RGBA);

    // 创建一个全白的背景
    const whiteBackground = new cv.Mat(matRGBA.rows, matRGBA.cols, cv.CV_8UC4, new cv.Scalar(255, 255, 255, 255));
    const imgWithBackground = new cv.Mat();
    cv.bitwise_not(matRGBA, imgWithBackground); // 应用反色，以模拟 alpha_composite 的效果

    // 转换为灰度并二值化
    const gray = new cv.Mat();
    cv.cvtColor(imgWithBackground, gray, cv.COLOR_RGBA2GRAY, 0);
    const binary = new cv.Mat();
    cv.threshold(gray, binary, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

    // 查找轮廓
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(binary, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    // 绘制最大轮廓
    const mask = new cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
    const largestContourIdx = findLargestContour(contours);
    const color = new cv.Scalar(255, 255, 255);
    cv.drawContours(mask, contours, largestContourIdx, color, cv.FILLED);

    // 清理
    mat.delete();
    matRGBA.delete();
    whiteBackground.delete();
    imgWithBackground.delete();
    gray.delete();
    binary.delete();
    contours.delete();
    hierarchy.delete();

    return mask;
}

function findLargestContour(contours) {
    let largestArea = 0;
    let largestContourIdx = -1;
    for (let i = 0; i < contours.size(); ++i) {
        const contourArea = cv.contourArea(contours.get(i));
        if (contourArea > largestArea) {
            largestArea = contourArea;
            largestContourIdx = i;
        }
    }
    return largestContourIdx;
}


async function resizeImageAspectRatio(imageURL) {
    const img = await loadImage(imageURL);
    const originalWidth = img.width;
    const originalHeight = img.height;
    const aspectRatio = originalWidth / originalHeight;

    const sizes = {
        1: [1024, 1024],
        1.3333: [1152, 896],  // 4/3
        1.5: [1216, 832],     // 3/2
        1.7777: [1344, 768],  // 16/9
        2.3333: [1568, 672],  // 21/9
        3: [1728, 576],       // 3/1
        0.25: [512, 2048],    // 1/4
        0.3333: [576, 1728],  // 1/3
        0.5625: [768, 1344],  // 9/16
        0.6667: [832, 1216],  // 2/3
        0.75: [896, 1152]     // 3/4
    };

    const closestAspectRatio = Object.keys(sizes).reduce((prev, curr) =>
        Math.abs(curr - aspectRatio) < Math.abs(prev - aspectRatio) ? curr : prev
    );

    const [targetWidth, targetHeight] = sizes[closestAspectRatio];
    img.scaleToWidth(targetWidth);
    img.scaleToHeight(targetHeight);

    const canvas = new fabric.Canvas();
    canvas.add(img);
    return canvas.toDataURL();
}

function baseGeneration(size, color) {
    const canvas = new fabric.StaticCanvas(null, {width: size[0], height: size[1]});

    const rect = new fabric.Rect({
        left: 0,
        top: 0,
        fill: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`,
        width: size[0],
        height: size[1]
    });

    canvas.add(rect);
    canvas.renderAll();

    return canvas.toDataURL();
}

export {cannyProcess, resizeImageAspectRatio};