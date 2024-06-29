import React, {useState, useEffect} from 'react';
import {Box, Button, TextField, Slider, Typography} from '@mui/material';
import {useImages} from '../ImageContext';
import {buildPayload} from "../utils/RequestApi";
import ProgressIndicator from '../components/ProgressIndicator';
import PromptAnalyzer from '../components/PromptAnalyzer';
import {processCannyImage} from "../utils/OpenCVUtils";
import {executePrompt, removeColor, removeDuplicates} from "../utils/PromptUtils";
import {baseGeneration, makeBaseImage, prepareImage, resizeImageAspectRatio} from "../utils/ImgUtils";
import OutputPanel from "../components/OutputPanel";
import InputPanel from "../components/InputPanel";

function LineartTab() {
    const [isCVReady, setCVReady] = useState(false);

    const {
        lineartInputImage, setLineartInputImage,
        cannyImage, setCannyImage,
        lineartOutputImage,
        setLineartOutputImage,
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

    const [prompt, setPrompt] = useState(null);
    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    const [negativePrompt, setNegativePrompt] = useState('lowres, error, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, blurry');
    const [cannyThreshold1, setCannyThreshold1] = useState(20);
    const [cannyThreshold2, setCannyThreshold2] = useState(120);
    const [linearFidelity, setLinearFidelity] = useState(1);
    const [linearBold, setLinearBold] = useState(0);
    const [generateButtonText, setGenerateButtonText] = useState('Generate');

    const [progressData, setProgressData] = useState({
        progress: 0,
        sampling_step: 0,
        sampling_steps: 0
    });

    const handleImageChange = (event, setLineartImage, setLineartImageBase64) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
                setLineartImageBase64(base64String);
                setLineartImage(reader.result);

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

    const handleGenerate = async () => {
        if (!lineartInputImage) {
            alert('Please upload an image first.');
            return;
        }

        setIsGenerating(true);
        setGenerateButtonText('Generating...');

        console.log("Generating...");

        const lineart = 1 - linearBold;

        let finalPrompt = "masterpiece, best quality, <lora:sdxl_BWLine:" + lineart + ">, <lora:sdxl_BW_bold_Line:" + linearBold + ">, monochrome, lineart, white background, " + prompt;

        const executeTags = ["sketch", "transparent background"]

        finalPrompt = executePrompt(executeTags, finalPrompt);
        finalPrompt = removeDuplicates(finalPrompt);
        finalPrompt = removeColor(finalPrompt);

        let baseImage = await makeBaseImage(lineartInputImage);

        let resizeBaseImage = await resizeImageAspectRatio(baseImage)

        const maskImage = baseGeneration([width, height], [255, 255, 255]);
        const whiteBaseImage = baseGeneration([width, height], [255, 255, 255, 255]);

        const imageFidelity = 1.0;

        const cn_args = makeCNArgs(prepareImage(cannyImage), linearFidelity);

        const override_settings = {};
        override_settings["CLIP_stop_at_last_layers"] = 2

        const encoded_base = prepareImage(whiteBaseImage);
        const encoded_mask = prepareImage(maskImage);

        const payload = {
            "init_images": [encoded_base],
            "denoising_strength": imageFidelity,
            "prompt": finalPrompt,
            "negative_prompt": negativePrompt,
            "seed": -1,
            "sampler_name": "Euler a",
            "steps": 20,
            "cfg_scale": 7,
            "width": width,
            "height": height,
            "override_settings": override_settings,
            "override_settings_restore_afterwards": "False"
        }
        if (cn_args) {
            payload["alwayson_scripts"] = {"ControlNet": {"args": cn_args}}
        }

        try {
            fetch('http://127.0.0.1:7861/sdapi/v1/img2img', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(response => response.json())
                .then(data => {
                    const base64Image = data.images[0];
                    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
                    setLineartOutputImage(imageSrc);

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

    function makeCNArgs(cannyImage, lineartFidelity) {
        const unit1 = {
            "image": cannyImage,
            "control_mode": "Balanced",
            "enabled": "True",
            "guidance_end": 1,
            "guidance_start": 0,
            "pixel_perfect": "True",
            "processor_res": 512,
            "resize_mode": "Just Resize",
            "weight": lineartFidelity,
            "module": "None",
            "model": "control-lora-canny-rank256 [ec2dbbe4]",
            "hr_option": "Both"
        };

        return [unit1]
    }

    if (!isCVReady) {
        return <div>Loading OpenCV...</div>;
    }

    const cv = window.cv;

    function createCanny(event, cannyThreshold1, cannyThreshold2, setCannyImageBase64) {
        if (!lineartInputImage) {
            alert('Please upload an image first.');
            return;
        }

        const imgElement = document.createElement('img');
        imgElement.src = lineartInputImage;

        imgElement.onload = () => {
            processCannyImage(cv, imgElement, cannyThreshold1, cannyThreshold2).then(dataUrl => {
                const base64String = dataUrl.replace('data:', '').replace(/^.+,/, '');

                setCannyImageBase64(base64String);

                setCannyImage(dataUrl);
            });
        };
    }

    return (
        <Box sx={{display: 'flex', gap: 2}}>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
                <Box sx={{display: 'flex', gap: 2}}>
                    <div style={{width: '50%'}}>
                        <InputPanel inputImage={lineartInputImage} setInputImage={setLineartInputImage}
                                    setHeight={setHeight} setWidth={setWidth}/>
                    </div>
                    <div style={{width: '50%'}}>
                        <Typography variant="h6">Canny Image</Typography>
                        {cannyImage && <img src={cannyImage} alt="Canny" style={{width: '100%', height: 'auto'}}/>}
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                            <Typography>Canny Threshold1</Typography>
                            <Slider
                                value={cannyThreshold1}
                                onChange={(e, newValue) => setCannyThreshold1(newValue)}
                                step={1}
                                min={0}
                                max={253}
                                valueLabelDisplay="auto"
                            />
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                            <Typography>Canny Threshold2</Typography>
                            <Slider
                                value={cannyThreshold2}
                                onChange={(e, newValue) => setCannyThreshold2(newValue)}
                                step={1}
                                min={0}
                                max={254}
                                valueLabelDisplay="auto"
                            />
                        </Box>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', marginTop: 1}}>
                            <Button variant="outlined"
                                    onClick={(e) => createCanny(e, cannyThreshold1, cannyThreshold2)}>Create</Button>
                        </Box>
                    </div>
                </Box>

                <PromptAnalyzer inputImage={lineartInputImage}
                                prompt={prompt} setPrompt={setPrompt} negativePrompt={negativePrompt}
                                setNegativePrompt={setNegativePrompt}/>

                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <Typography>Linear Fidelity</Typography>
                    <Slider
                        value={linearFidelity}
                        onChange={(e, newValue) => setLinearFidelity(newValue)}
                        step={0.01}
                        min={0.5}
                        max={1.25}
                        valueLabelDisplay="auto"
                    />
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <Typography>Linear Bold</Typography>
                    <Slider
                        value={linearBold}
                        onChange={(e, newValue) => setLinearBold(newValue)}
                        step={0.01}
                        min={0}
                        max={1}
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
            <OutputPanel outputImage={lineartOutputImage} />
        </Box>
    );
}

export default LineartTab;
