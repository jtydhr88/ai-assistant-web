import React, {useState, useEffect} from 'react';
import {Box, Button, Slider, Typography} from '@mui/material';
import {useImages} from '../ImageContext';
import ProgressIndicator from '../components/ProgressIndicator';
import PromptAnalyzer from '../components/PromptAnalyzer';
import {buildControlNetArgs, executePrompt, removeColor, removeDuplicates} from "../utils/PromptUtils";
import {baseGeneration, makeBaseImage, prepareImage, resizeImageAspectRatio} from "../utils/ImgUtils";
import InputPanel from "../components/InputPanel";
import OutputPanel from "../components/OutputPanel";
import {sendRequest} from "../utils/RequestApi";

function NormalMapTab() {

    const {
        normalMapInputImage, setNormalMapInputImage,
        normalMapInvertImage, setNormalMapInvertImage,
        normalMapOutputImage,
        setNormalMapOutputImage,
    } = useImages();

    const [isGenerating, setIsGenerating] = useState(false);

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
    const [generateButtonText, setGenerateButtonText] = useState('Generate');

    const [progressData, setProgressData] = useState({
        progress: 0,
        sampling_step: 0,
        sampling_steps: 0
    });

    function processInvert(inputImage) {
        const payload = JSON.stringify({image_base64: prepareImage(inputImage)});

        sendRequest('http://127.0.0.1:7861/ai-assistant/invert_process', 'POST', payload,
            (data) => {
                const base64Image = data["invert_img"];
                const imageSrc = `data:image/jpeg;base64,${base64Image}`;

                setNormalMapInvertImage(imageSrc)
            }, () => {
                postGenerateError();
            })
    }

    function postGenerateSuccess(data) {
        const base64Image = data.images[0];
        const imageSrc = `data:image/jpeg;base64,${base64Image}`;
        setNormalMapOutputImage(imageSrc);

        updateGenerateStatus(false, 'Generate', "Generate success");
    }

    function postGenerateError() {
        updateGenerateStatus(false, 'Generate', "Generate failed");
    }

    function updateGenerateStatus(isGenerating, generateButtonText, consoleMessage) {
        setIsGenerating(isGenerating);
        setGenerateButtonText(generateButtonText);

        console.log(consoleMessage);
    }

    const handleGenerate = async () => {
        if (!normalMapInputImage) {
            alert('Please upload an image first.');
            return;
        }

        updateGenerateStatus(true, 'Generating...', "Generating...");

        let finalPrompt = "masterpiece, best quality, normal map, <lora:sdxl-testlora-normalmap_04b_dim32:1.2>" + prompt;

        const executeTags = ["monochrome", "greyscale", "lineart", "white background", "sketch", "transparent background"]

        finalPrompt = executePrompt(executeTags, finalPrompt);
        finalPrompt = removeDuplicates(finalPrompt);
        finalPrompt = removeColor(finalPrompt);

        let baseImage = await makeBaseImage(normalMapInputImage);

        let resizeBaseImage = await resizeImageAspectRatio(baseImage)

        const maskImage = baseGeneration([width, height], [255, 255, 255]);
        const whiteBaseImage = baseGeneration([width, height], [255, 255, 255, 255]);

        const imageFidelity = 1.0;

        const cn_args = [
            buildControlNetArgs(prepareImage(normalMapInvertImage), linearFidelity, "Kataragi_lineartXL-lora128 [0598262f]")
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

        console.log(payload)

        sendRequest('http://127.0.0.1:7861/sdapi/v1/img2img', 'POST', JSON.stringify(payload), postGenerateSuccess, postGenerateError)
    };

    function makeCNArgs(invertImage, normalMapFidelity) {
        const unit1 = {
            "image": invertImage,
            "control_mode": "Balanced",
            "enabled": "True",
            "guidance_end": 1,
            "guidance_start": 0,
            "pixel_perfect": "True",
            "processor_res": 512,
            "resize_mode": "Just Resize",
            "weight": normalMapFidelity,
            "module": "None",
            "model": "Kataragi_lineartXL-lora128 [0598262f]",
            "hr_option": "Both"
        };

        return [unit1]
    }

    return (
        <Box sx={{display: 'flex', gap: 2}}>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
                <Box sx={{display: 'flex', gap: 2}}>
                    <div style={{width: '50%'}}>
                        <InputPanel inputImage={normalMapInputImage}
                                    setInputImage={setNormalMapInputImage}
                                    setHeight={setHeight} setWidth={setWidth}
                                    postProcess={processInvert} label="Input Image"
                        />
                    </div>
                </Box>

                <PromptAnalyzer
                    inputImage={normalMapInputImage}
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

                <Button variant="outlined" onClick={handleGenerate} style={{marginTop: 8}} disabled={isGenerating}>
                    {generateButtonText}
                </Button>

                <ProgressIndicator
                    progress={progressData.progress}
                    currentStep={progressData.sampling_step}
                    totalSteps={progressData.sampling_steps}
                />
            </Box>

            <OutputPanel outputImage={normalMapOutputImage}/>
        </Box>
    );
}

export default NormalMapTab;
