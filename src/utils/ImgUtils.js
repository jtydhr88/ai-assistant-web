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

async function resizeImageAspectRatio(imageURL) {
    return new Promise(resolve => {
        fabric.Image.fromURL(imageURL, function (img) {
            const originalWidth = img.width;
            const originalHeight = img.height;
            const aspectRatio = originalWidth / originalHeight;


            const closestAspectRatio = Object.keys(sizes).reduce((prev, curr) =>
                Math.abs(curr - aspectRatio) < Math.abs(prev - aspectRatio) ? curr : prev
            );

            const [targetWidth, targetHeight] = sizes[closestAspectRatio];
            img.scaleToWidth(targetWidth);
            img.scaleToHeight(targetHeight);

            const canvas = new fabric.Canvas();
            canvas.add(img);

            resolve(canvas.toDataURL());
        })
    });
}

function prepareImage(image) {
    return image.replace('data:', '').replace(/^.+,/, '');
}

function baseGeneration(size, color) {
    const canvas = new fabric.StaticCanvas(null, {width: size[0], height: size[1]});

    let fill;

    if (color.length === 3) {
        fill = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    } else {
        fill = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`;
    }

    const rect = new fabric.Rect({
        left: 0,
        top: 0,
        fill: fill,
        width: size[0],
        height: size[1]
    });

    canvas.add(rect);
    canvas.renderAll();

    return canvas.toDataURL();
}

function findClosestAspectRatio(aspectRatio) {
    let closestKey = Object.keys(sizes).reduce((a, b) => {
        return Math.abs(b - aspectRatio) < Math.abs(a - aspectRatio) ? b : a;
    });

    return sizes[closestKey];
}

async function makeBaseImage(imageURL) {
    return new Promise(resolve => {
        fabric.Image.fromURL(imageURL, function (img) {
            // Calculate aspect ratio
            const originalWidth = img.width;
            const originalHeight = img.height;
            const aspectRatio = originalWidth / originalHeight;

            // Find closest aspect ratio and resize
            const [targetWidth, targetHeight] = findClosestAspectRatio(aspectRatio);

            // Resize image
            img.scaleToWidth(targetWidth);
            img.scaleToHeight(targetHeight);

            const canvas = new fabric.StaticCanvas(null, {width: targetWidth, height: targetHeight});
            canvas.add(img);
            canvas.renderAll();

            // Output as data URL
            resolve(canvas.toDataURL());
        });
    });
}


export {resizeImageAspectRatio, makeBaseImage, baseGeneration, prepareImage};