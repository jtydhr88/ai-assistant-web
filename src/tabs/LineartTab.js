import React, {useState, useEffect} from 'react';
import {Box, Button, TextField, Slider, Typography} from '@mui/material';
import {useImages} from '../ImageContext';
import {buildPayload, sendRequest} from "../utils/RequestApi";
import ProgressIndicator from '../components/ProgressIndicator';
import PromptAnalyzer from '../components/PromptAnalyzer';
import {processCannyImage} from "../utils/OpenCVUtils";
import {buildControlNetArgs, executePrompt, removeColor, removeDuplicates} from "../utils/PromptUtils";
import {baseGeneration, makeBaseImage, prepareImage, resizeImageAspectRatio} from "../utils/ImgUtils";
import OutputPanel from "../components/OutputPanel";
import InputPanel from "../components/InputPanel";
import CannyPanel from "../components/CannyPanel";
import LineartConfigPanel from "../components/LineartConfigPanel";

function LineartTab() {
    const [isCVReady, setCVReady] = useState(false);

    const {
        lineartInputImage, setLineartInputImage, cannyImage, setCannyImage, lineartOutputImage, setLineartOutputImage,
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

    const [linearFidelity, setLinearFidelity] = useState(1);
    const [linearBold, setLinearBold] = useState(0);
    const [generateButtonText, setGenerateButtonText] = useState('Generate');

    const [progressData, setProgressData] = useState({
        progress: 0, sampling_step: 0, sampling_steps: 0
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

    function postGenerateSuccess(data) {
        const base64Image = data.images[0];
        const imageSrc = `data:image/jpeg;base64,${base64Image}`;
        setLineartOutputImage(imageSrc);

        setIsGenerating(false);
        setGenerateButtonText('Generate');
    }

    function postGenerateError() {
        setIsGenerating(false);
        setGenerateButtonText('Generate');
    }

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

        const cn_args = [
            buildControlNetArgs(prepareImage(cannyImage), linearFidelity, "control-lora-canny-rank256 [ec2dbbe4]")
        ]

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

        sendRequest('http://127.0.0.1:7861/sdapi/v1/img2img', 'POST', JSON.stringify(payload), postGenerateSuccess, postGenerateError)
    };

    if (!isCVReady) {
        return <div>Loading OpenCV...</div>;
    }

    const cv = window.cv;

    return (<Box sx={{display: 'flex', gap: 2}}>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
                <Box sx={{display: 'flex', gap: 2}}>
                    <div style={{width: '50%'}}>
                        <InputPanel inputImage={lineartInputImage} setInputImage={setLineartInputImage}
                                    setHeight={setHeight} setWidth={setWidth} label="Input Image"/>
                    </div>
                    <div style={{width: '50%'}}>
                        <CannyPanel cv={cv} inputImage={lineartInputImage} cannyImage={cannyImage}
                                    setCannyImage={setCannyImage}/>
                    </div>
                </Box>

                <PromptAnalyzer inputImage={lineartInputImage}
                                prompt={prompt} setPrompt={setPrompt} negativePrompt={negativePrompt}
                                setNegativePrompt={setNegativePrompt}/>

                <LineartConfigPanel linearBold={linearBold} setLinearBold={setLinearBold}
                                    linearFidelity={linearFidelity} setLinearFidelity={setLinearFidelity}/>

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
            <OutputPanel outputImage={lineartOutputImage}/>
        </Box>);
}

export default LineartTab;
