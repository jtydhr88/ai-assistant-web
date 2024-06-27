import React, {useState, useEffect} from 'react';
import {Box, Button, TextField, Slider, Typography} from '@mui/material';
import {useImages} from '../ImageContext';
import {buildPayload} from "../utils/RequestApi";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ProgressIndicator from './ProgressIndicator';

function Img2ImgTab() {
    const [isCVReady, setCVReady] = useState(false);

    const {
        inputImage, setInputImage,
        inputImageBase64, setInputImageBase64,
        maskImage, setMaskImage,
        maskImageBase64, setMaskImageBase64,
        inputAnytestImage, setInputAnytestImage,
        inputAnytestImageBase64, setInputAnytestImageBase64,
        outputImage, setOutputImage
    } = useImages();

    const [isGenerating, setIsGenerating] = useState(false);

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

    useEffect(() => {
        if (isGenerating) {
            const fetchProgress = () => {
                fetch('http://127.0.0.1:7861/sdapi/v1/progress')
                    .then(response => response.json())
                    .then(data => {
                        setProgressData({
                            progress: data.progress,
                            sampling_step: data.state.sampling_step,
                            sampling_steps: data.state.sampling_steps
                        });
                        if (data.progress >= 1) {
                            setIsGenerating(false);

                            setProgressData({
                                progress: 1,
                                sampling_step: data.state.sampling_steps,
                                sampling_steps: data.state.sampling_steps
                            });
                        }
                    })
                    .catch(error => console.error('Error fetching progress:', error));
            };

            let interval = setInterval(fetchProgress, 500);

            return () => clearInterval(interval);
        }
    }, [isGenerating]);

    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('lowres, error, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, blurry');
    const [imageFidelity, setImageFidelity] = useState(0.35);
    const [anytestValue, setAnytestValueValue] = useState('none');
    const [anytestFidelity, setAnytestFidelity] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzeButtonText, setAnalyzeButtonText] = useState('Analyze Prompt');
    const [generateButtonText, setGenerateButtonText] = useState('Generate');

    const [progressData, setProgressData] = useState({
        progress: 0,
        sampling_step: 0,
        sampling_steps: 0
    });

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

    const handleMaskImageChange = (event, setMaskImage, setMaskImageBase64) => {

    }

    const handleAnalyzePrompt = async () => {
        if (!inputImage) {
            alert('Please upload an image first.');
            return;
        }

        console.log("Analyzing prompt...");

        setIsAnalyzing(true);
        setAnalyzeButtonText('Analyzing...');

        try {
            const response = await fetch('http://127.0.0.1:7861/ai-assistant/prompt_analysis', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({image_base64: inputImageBase64})
            });

            if (response.ok) {
                const data = await response.json();
                setPrompt(data.tags_list);  // 假设 setPrompt 是你的一个状态更新函数
            } else {
                throw new Error('Failed to analyze image');
            }
        } catch (error) {
            console.error(error);
            alert('Error: ' + error.message);  // 显示错误消息
        } finally {
            setIsAnalyzing(false);
            setAnalyzeButtonText('Analyze Prompt');
        }
    };

    const handleDownloadImage = () => {
        console.log("Downloading image...");

        const link = document.createElement('a');
        link.href = outputImage;
        link.download = 'output-image.jpeg';  // 设置下载的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAnytestImageChange = () => {
        console.log("handleAnytestImageChange...");
    };

    const handleGenerate = () => {
        if (!inputImage) {
            alert('Please upload an image first.');
            return;
        }

        setIsGenerating(true);
        setGenerateButtonText('Generating...');

        console.log("Generating...");

        const payload = buildPayload(prompt, negativePrompt, width, height, null, null, inputImageBase64, maskImageBase64, imageFidelity, "i2i");

        try {
            fetch('http://127.0.0.1:7861/sdapi/v1/img2img', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: payload
            })
                .then(response => response.json())
                .then(data => {
                    const base64Image = data.images[0];
                    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
                    setOutputImage(imageSrc);

                    setIsGenerating(false);
                    setGenerateButtonText('Generate');
                })
                .catch(error => {
                    console.error("Error sending data:", error);
                    setIsGenerating(false);
                    setGenerateButtonText('Generate');
                });
        } catch (error) {
            console.error(error);
            alert('Error: ' + error.message);
        }
    };


    const handleTransferToLineart = () => {
        console.log("Transferring to Lineart tab...");
    };

    if (!isCVReady) {
        return <div>Loading OpenCV...</div>;
    }

    const cv = window.cv;

    function createMask(event, setMaskImageBase64) {
        if (!inputImage) {
            alert('Please upload an image first.');
            return;
        }

        const imgElement = document.createElement('img');
        imgElement.src = inputImage;


        imgElement.onload = () => {
            processMaskImage(imgElement).then(dataUrl => {
                const base64String = dataUrl.replace('data:', '').replace(/^.+,/, '');

                setMaskImageBase64(base64String);

                setMaskImage(dataUrl);
            });
        };
    }

    function processMaskImage(imgElement) {
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
            let maxContourIdx = findLargestContour(contours);
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
                            onChange={(e) => handleMaskImageChange(e, setMaskImage, setMaskImageBase64)}
                            style={{display: 'block', marginBottom: 8}}
                        />
                        {maskImage && <img src={maskImage} alt="Mask" style={{width: '100%', height: 'auto'}}/>}
                        <Box sx={{display: 'flex', justifyContent: 'space-between', marginTop: 1}}>
                            <Button variant="outlined"
                                    onClick={(e) => createMask(e, setMaskImageBase64)}>Create</Button>
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
                    {inputAnytestImage &&
                        <img src={inputAnytestImage} alt="Input" style={{width: '100%', height: 'auto'}}/>}
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
                <Button variant="outlined" onClick={handleAnalyzePrompt} style={{marginTop: 8}} disabled={isAnalyzing}>
                    {analyzeButtonText}
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
                <Button variant="outlined" onClick={handleGenerate} style={{marginTop: 8}} disabled={isGenerating}>
                    {generateButtonText}
                </Button>
                <div>
                    <ProgressIndicator
                        progress={progressData.progress}
                        currentStep={progressData.sampling_step}
                        totalSteps={progressData.sampling_steps}
                    />
                </div>
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
