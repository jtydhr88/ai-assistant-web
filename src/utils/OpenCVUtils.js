function processMaskImage(cv, imgElement) {
    return new Promise(resolve => {
        let src = cv.imread(imgElement);
        let srcRGBA = new cv.Mat();
        cv.cvtColor(src, srcRGBA, cv.COLOR_BGR2RGBA);

        // 创建白色背景
        let whiteBackground = new cv.Mat(srcRGBA.rows, srcRGBA.cols, cv.CV_8UC4, new cv.Scalar(255, 255, 255, 255));
        let dst = new cv.Mat();
        cv.bitwise_not(srcRGBA, dst);  // 应用反色以模拟 alpha 合成

        // 转换到灰度并二值化
        let gray = new cv.Mat();
        cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
        let binary = new cv.Mat();
        cv.threshold(gray, binary, 0, 255, cv.THRESH_BINARY);

        // 寻找轮廓
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(binary, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

        // 寻找最大轮廓并绘制遮罩
        let mask = new cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
        let maxContourIdx = findLargestContour(cv, contours);
        cv.drawContours(mask, contours, maxContourIdx, new cv.Scalar(255, 255, 255), cv.FILLED);

        // 创建遮罩的画布展示
        let canvas = document.createElement('canvas');
        cv.imshow(canvas, mask);
        resolve(canvas.toDataURL('image/png'));

        // 释放内存
        src.delete();
        srcRGBA.delete();
        whiteBackground.delete();
        dst.delete();
        gray.delete();
        binary.delete();
        contours.delete();
        hierarchy.delete();
        mask.delete();
    });
}

function findLargestContour(cv, contours) {
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

function processCannyImage(cv, imgElement, threshold1, threshold2) {
    return new Promise(resolve => {
        let src = cv.imread(imgElement);
        let dst = new cv.Mat();
        let gray = new cv.Mat();

        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

        cv.Canny(gray, dst, threshold1, threshold2, 3, false);


        let canvas = document.createElement('canvas');
        cv.imshow(canvas, dst);

        // 将 canvas 转换为 data URL
        let dataUrl = canvas.toDataURL();

        src.delete();
        dst.delete();
        gray.delete();

        resolve(dataUrl);
    });
}

export {processMaskImage, processCannyImage}