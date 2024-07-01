import React, {useState, useEffect} from 'react';
import {Box, Button, Slider, Typography} from '@mui/material';
import {useImages} from '../ImageContext';
import ProgressIndicator from '../components/ProgressIndicator';
import PromptAnalyzer from '../components/PromptAnalyzer';
import {buildControlNetArgs, executePrompt, removeColor, removeDuplicates} from "../utils/PromptUtils";
import {baseGeneration, makeBaseImage, prepareImage, resizeImageAspectRatio} from "../utils/ImgUtils";
import OutputPanel from "../components/OutputPanel";
import InputPanel from "../components/InputPanel";
import LineartConfigPanel from "../components/LineartConfigPanel";
import {sendRequest} from "../utils/RequestApi";

function LineDrawingCutoutTab() {

    const {
        lineDrawingCutoutInputImage, setLineDrawingCutoutInputImage,
        flatLineImage, setFlatLineImage,
        lineDrawingCutoutOutputImage, setLineDrawingCutoutOutputImage,
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
    const [linearBold, setLinearBold] = useState(0);
    const [generateButtonText, setGenerateButtonText] = useState('Generate');

    const [progressData, setProgressData] = useState({
        progress: 0,
        sampling_step: 0,
        sampling_steps: 0
    });

    function processFlatLine(inputImage) {
        try {
            fetch('http://127.0.0.1:7861/ai-assistant/flatline_process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({image_base64: prepareImage(inputImage)})
            })
                .then(response => response.json())
                .then(data => {
                    const base64Image = data["flatLine_img"];
                    const imageSrc = `data:image/jpeg;base64,${base64Image}`;

                    setFlatLineImage(imageSrc)
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
    }

    function postGenerateSuccess(data) {
        const base64Image = data.images[0];
        const imageSrc = `data:image/jpeg;base64,${base64Image}`;
        setLineDrawingCutoutOutputImage(imageSrc);

        setIsGenerating(false);
        setGenerateButtonText('Generate');
    }

    function postGenerateError() {
        setIsGenerating(false);
        setGenerateButtonText('Generate');
    }

    const handleGenerate = async () => {
        if (!lineDrawingCutoutInputImage) {
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

        let baseImage = await makeBaseImage(lineDrawingCutoutInputImage);

        let resizeBaseImage = await resizeImageAspectRatio(baseImage)

        const maskImage = baseGeneration([width, height], [255, 255, 255]);
        const whiteBaseImage = baseGeneration([width, height], [255, 255, 255, 255]);

        const imageFidelity = 1.0;

        const cn_args = [
            buildControlNetArgs(prepareImage(flatLineImage), linearFidelity, "controlnet852A_veryhard [8a1dc920]")
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

    return (
        <Box sx={{display: 'flex', gap: 2}}>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
                <Box sx={{display: 'flex', gap: 2}}>
                    <div style={{width: '50%'}}>
                        <InputPanel inputImage={lineDrawingCutoutInputImage}
                                    setInputImage={setLineDrawingCutoutInputImage}
                                    setHeight={setHeight} setWidth={setWidth}
                                    postProcess={processFlatLine} label="Input Image"
                        />
                    </div>
                </Box>

                <PromptAnalyzer
                    inputImage={lineDrawingCutoutInputImage}
                    prompt={prompt} setPrompt={setPrompt} negativePrompt={negativePrompt}
                    setNegativePrompt={setNegativePrompt}/>

                <LineartConfigPanel linearBold={linearBold} setLinearBold={setLinearBold}
                                    linearFidelity={linearFidelity} setLinearFidelity={setLinearFidelity}/>

                <Button variant="outlined" onClick={handleGenerate} style={{marginTop: 8}} disabled={isGenerating}>
                    {generateButtonText}
                </Button>

                <ProgressIndicator
                    progress={progressData.progress}
                    currentStep={progressData.sampling_step}
                    totalSteps={progressData.sampling_steps}
                />
            </Box>

            <OutputPanel outputImage={lineDrawingCutoutOutputImage}/>
        </Box>
    );
}

export default LineDrawingCutoutTab;
