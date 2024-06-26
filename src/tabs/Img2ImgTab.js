import React, {useState, useEffect} from 'react';
import {Box, Button, TextField, Slider, Typography} from '@mui/material';
import {useImages} from '../ImageContext';
import {buildPayload} from "../utils/RequestApi";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function Img2ImgTab() {
    const [isCVReady, setCVReady] = useState(false);

    const {
        inputImage, setInputImage,
        inputImageBase64, setInputImageBase64,
        maskImage, setMaskImage,
        maskImageBase64, setMaskImageMaskBase64,
        inputAnytestImage, setInputAnytestImage,
        inputAnytestImageBase64, setInputAnytestImageBase64,
        outputImage, setOutputImage
    } = useImages();

    useEffect(() => {
        if (window.isCVReady) {
            setCVReady(true);
        } else {
            const checkCVReady = setInterval(() => {
                if (window.isCVReady) {
                    clearInterval(checkCVReady);
                    setCVReady(true);
                }
            }, 100);
        }
    }, []);

    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('lowres, error, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, blurry');
    const [imageFidelity, setImageFidelity] = useState(0.35);
    const [anytestValue, setAnytestValueValue] = useState('none');
    const [anytestFidelity, setAnytestFidelity] = useState(1);

    const handleAnytestValueChange = (event) => {
        setAnytestValueValue(event.target.value);
    };

    const handleImageChange = (event, setImage, setBase64) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
                setBase64(base64String);
                setImage(reader.result);


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
    };

    const handleMaskImageChange = (event, setMaskImage, setMaskImageMaskBase64) => {

    }

    const handleAnalyzePrompt = () => {
        console.log("Analyzing prompt...");
    };

    const handleCreateMask = () => {
        console.log("Creating mask...");
    };

    const handleDownloadImage = () => {
        console.log("Downloading image...");
    };

    const handleAnytestImageChange = () => {
        console.log("handleAnytestImageChange...");
    };

    const handleGenerate = () => {
        const payload = buildPayload(prompt, negativePrompt, width, height, null, null, inputImageBase64, null, imageFidelity, "i2i");

        console.log(payload);

        fetch('http://127.0.0.1:7861/sdapi/v1/img2img', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: payload
        })
            .then(response => response.json())
            .then(data => {
                console.log("Response from server:", data);
            })
            .catch(error => {
                console.error("Error sending data:", error);
            });
    };


    const handleTransferToLineart = () => {
        console.log("Transferring to Lineart tab...");
    };

    if (!isCVReady) {
        return <div>Loading OpenCV...</div>;
    }

    const cv = window.cv;

    function createMask() {
        if (!inputImage) {
            alert('Please upload an image first.');
            return;
        }

        const imgElement = document.createElement('img');
        imgElement.src = inputImage;

        imgElement.onload = () => {
            processMaskImage(imgElement).then(dataUrl => {
                setMaskImage(dataUrl); // 更新状态以显示图像
            });
        };
    }

    function processMaskImage(imgElement) {
        return new Promise(resolve => {
            let img = cv.imread(imgElement);
            let imgRGBA = new cv.Mat();
            cv.cvtColor(img, imgRGBA, cv.COLOR_BGR2RGBA);

            // 创建白色背景画布
            let canvas = new cv.Mat(imgRGBA.rows, imgRGBA.cols, cv.CV_8UC4, new cv.Scalar(255, 255, 255, 255));
            let imgWithBackground = new cv.Mat();
            cv.bitwise_not(imgRGBA, imgWithBackground);

            // 将背景与图像合并
            cv.bitwise_not(imgWithBackground, imgWithBackground);

            // 转换为灰度图并二值化
            let gray = new cv.Mat();
            cv.cvtColor(imgWithBackground, gray, cv.COLOR_RGBA2GRAY, 0);
            let binary = new cv.Mat();
            cv.threshold(gray, binary, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

            // 找到并绘制轮廓
            let contours = new cv.MatVector();
            let hierarchy = new cv.Mat();
            cv.findContours(binary, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
            let mask = cv.Mat.zeros(img.rows, img.cols, cv.CV_8UC3);
            cv.drawContours(mask, contours, -1, new cv.Scalar(255, 255, 255), cv.FILLED);

            // 将 mask 转换为可用的图像 URL
            let maskCanvas = document.createElement("canvas");
            cv.imshow(maskCanvas, mask);
            resolve(maskCanvas.toDataURL());

            // 释放资源
            img.delete();
            imgRGBA.delete();
            canvas.delete();
            imgWithBackground.delete();
            gray.delete();
            binary.delete();
            contours.delete();
            hierarchy.delete();
            mask.delete();
        });
    }

    return (
        <Box sx={{display: 'flex', gap: 2}}>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
                <Box sx={{display: 'flex', gap: 2}}>
                    <div style={{width: '50%'}}>
                        <Typography variant="h6">Input Image</Typography>
                        <input
                            type="file"
                            onChange={(e) => handleImageChange(e, setInputImage, setInputImageBase64)}
                            style={{display: 'block', marginBottom: 8}}
                        />
                        {inputImage && <img src={inputImage} alt="Input" style={{width: '100%', height: 'auto'}}/>}
                    </div>
                    <div style={{width: '50%'}}>
                        <Typography variant="h6">Mask Image</Typography>
                        <input
                            type="file"
                            onChange={(e) => handleMaskImageChange(e, setMaskImage, setMaskImageMaskBase64)}
                            style={{display: 'block', marginBottom: 8}}
                        />
                        {maskImage && <img src={maskImage} alt="Mask" style={{width: '100%', height: 'auto'}}/>}
                        <Box sx={{display: 'flex', justifyContent: 'space-between', marginTop: 1}}>
                            <Button variant="outlined" onClick={createMask}>Create</Button>
                        </Box>
                    </div>
                </Box>
                <div>
                    <Typography variant="h6">Anytest Image</Typography>
                    <input
                        type="file"
                        onChange={(e) => handleAnytestImageChange(e, setInputAnytestImage, setInputAnytestImageBase64)}
                        style={{display: 'block', marginBottom: 8}}
                    />
                    {inputImage && <img src={inputImage} alt="Input" style={{width: '100%', height: 'auto'}}/>}
                </div>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Anytest</FormLabel>
                    <RadioGroup
                        row
                        aria-label="test module"
                        name="row-radio-buttons-group"
                        value={anytestValue}
                        onChange={handleAnytestValueChange}
                    >
                        <FormControlLabel value="none" control={<Radio/>} label="none"/>
                        <FormControlLabel value="anytestV3" control={<Radio/>} label="anytestV3"/>
                        <FormControlLabel value="anytestV4" control={<Radio/>} label="anytestV4"/>
                    </RadioGroup>
                </FormControl>
                <Button variant="outlined" onClick={handleAnalyzePrompt} style={{marginTop: 8}}>
                    Analyze Prompt
                </Button>
                <TextField
                    label="Prompt"
                    fullWidth
                    multiline
                    maxRows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    variant="outlined"
                />
                <TextField
                    label="Negative Prompt"
                    fullWidth
                    multiline
                    maxRows={4}
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    variant="outlined"
                />
                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <Typography>Image Fidelity</Typography>
                    <Slider
                        value={imageFidelity}
                        onChange={(e, newValue) => setImageFidelity(newValue)}
                        step={0.01}
                        min={0}
                        max={1}
                        valueLabelDisplay="auto"
                    />
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <Typography>Anytest Fidelity</Typography>
                    <Slider
                        value={anytestFidelity}
                        onChange={(e, newValue) => setAnytestFidelity(newValue)}
                        step={0.01}
                        min={0.35}
                        max={1.25}
                        valueLabelDisplay="auto"
                    />
                </Box>
                <Button variant="contained" onClick={handleGenerate}>Generate</Button>
            </Box>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
                <Typography variant="h6">Output Image</Typography>
                {outputImage && <img src={outputImage} alt="Output" style={{width: '300px', height: 'auto'}}/>}
                <Button variant="contained" onClick={handleDownloadImage}>Download</Button>
                <Button variant="contained" onClick={handleTransferToLineart}>Transfer to Lineart Tab</Button>
            </Box>
        </Box>
    );
}

export default Img2ImgTab;
