import React, {useState, useEffect} from 'react';
import {Box, Button, InputLabel, MenuItem, Select} from '@mui/material';
import {useImages} from '../ImageContext';
import ProgressIndicator from '../components/ProgressIndicator';
import PromptAnalyzer from '../components/PromptAnalyzer';
import {buildControlNetArgs, executePrompt, removeColor, removeDuplicates} from "../utils/PromptUtils";
import {baseGeneration, prepareImage} from "../utils/ImgUtils";
import InputPanel from "../components/InputPanel";
import OutputPanel from "../components/OutputPanel";
import FormControl from "@mui/material/FormControl";
import {sendRequest} from "../utils/RequestApi";

function AnimeShadowTab() {

    const {
        animeShadowLineartInputImage, setAnimeShadowLineartInputImage,
        animeShadowShadowInputImage, setAnimeShadowShadowInputImage,
        animeShadowInvertImage, setAnimeShadowInvertImage,
        animeShadowOutputImage, setAnimeShadowOutputImage,
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
    const [animeShadowType, setAnimeShadowType] = useState("anime01");
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

                setAnimeShadowInvertImage(imageSrc)
            }, () => {
                postGenerateError();
            })
    }

    function postGenerateError() {
        updateGenerateStatus(false, 'Generate', "Generate failed");
    }

    function updateGenerateStatus(isGenerating, generateButtonText, consoleMessage) {
        setIsGenerating(isGenerating);
        setGenerateButtonText(generateButtonText);

        console.log(consoleMessage);
    }

    function postGenerateSuccess(data) {
        const shadow_line_image = data["result"];

        const image_fidelity = 1.0
        const lineart_fidelity = 1.0

        const unit1 = buildControlNetArgs(
            prepareImage(animeShadowLineartInputImage), 0.5, "controlnet852AClone_v10 [808807b2]",
            0, 0.35, "blur_gaussian", 9.0)

        const unit2 = buildControlNetArgs(
            prepareImage(animeShadowInvertImage), lineart_fidelity, "Kataragi_lineartXL-lora128 [0598262f]")

        const cn_args = [
            unit1, unit2
        ]

        const maskImage = baseGeneration([width, height], [255, 255, 255]);
        const whiteBaseImage = baseGeneration([width, height], [255, 255, 255, 255]);

        const imageFidelity = 1.0;

        const encoded_base = prepareImage(animeShadowShadowInputImage);
        const encoded_mask = prepareImage(maskImage);

        let finalPrompt = "masterpiece, best quality, <lora:" + animeShadowType + ":1>, monochrome, greyscale, " + prompt;

        const executeTags = ["lineart", "sketch", "transparent background"]

        finalPrompt = executePrompt(executeTags, finalPrompt);
        finalPrompt = removeDuplicates(finalPrompt);
        finalPrompt = removeColor(finalPrompt);

        const override_settings = {};
        override_settings["CLIP_stop_at_last_layers"] = 2

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

        sendRequest('http://127.0.0.1:7861/sdapi/v1/img2img', 'POST', JSON.stringify(payload), postGenerateSuccess2, postGenerateError)
    }

    function postGenerateSuccess2(data) {
        const base64Image = data.images[0];
        const imageSrc = `data:image/jpeg;base64,${base64Image}`;

        setAnimeShadowOutputImage(imageSrc);

        updateGenerateStatus(false, 'Generate', "Generate success");
    }

    const handleGenerate = async () => {
        if (!animeShadowLineartInputImage) {
            alert('Please upload an linear image first.');
            return;
        }

        if (!animeShadowShadowInputImage) {
            alert('Please upload an shadow image first.');
            return;
        }

        updateGenerateStatus(true, 'Generating...', "Generating...");

        const payload = JSON.stringify({
            line_image_base64: prepareImage(animeShadowLineartInputImage),
            shadow_image_base64: prepareImage(animeShadowShadowInputImage),
        });

        sendRequest('http://127.0.0.1:7861/ai-assistant/multiply_images', 'POST', payload, postGenerateSuccess, postGenerateError)
    };

    function makeCNArgs(inputImage, invertImage, lineartFidelity) {
        const unit1 = buildControlNetArgs(
            prepareImage(inputImage), 0.5, "controlnet852AClone_v10 [808807b2]",
            0, 0.35, "blur_gaussian", 9.0)

        const unit2 = buildControlNetArgs(
            prepareImage(invertImage), lineartFidelity, "Kataragi_lineartXL-lora128 [0598262f]")

        return [unit1, unit2]
    }

    return (
        <Box sx={{display: 'flex', gap: 2}}>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
                <Box sx={{display: 'flex', gap: 2}}>
                    <div style={{width: '50%'}}>
                        <InputPanel inputImage={animeShadowLineartInputImage}
                                    setInputImage={setAnimeShadowLineartInputImage}
                                    setHeight={setHeight} setWidth={setWidth} label="Lineart Input Image"
                                    postProcess={processInvert}
                        />
                    </div>
                    <div style={{width: '50%'}}>
                        <InputPanel inputImage={animeShadowShadowInputImage}
                                    setInputImage={setAnimeShadowShadowInputImage}
                                    setHeight={setHeight} setWidth={setWidth} label="Shadow Input Image"
                        />
                    </div>
                </Box>

                <PromptAnalyzer
                    inputImage={animeShadowLineartInputImage}
                    prompt={prompt} setPrompt={setPrompt} negativePrompt={negativePrompt}
                    setNegativePrompt={setNegativePrompt}/>

                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Anime Share Type</InputLabel>
                    <Select
                        value={animeShadowType}
                        label="Age"
                        onChange={(event) => setAnimeShadowType(event.target.value)}
                    >
                        <MenuItem value={"anime01"}>anime01</MenuItem>
                        <MenuItem value={"anime02"}>anime02</MenuItem>
                        <MenuItem value={"anime03"}>anime03</MenuItem>
                    </Select>
                </FormControl>


                <Button variant="outlined" onClick={handleGenerate} style={{marginTop: 8}} disabled={isGenerating}>
                    {generateButtonText}
                </Button>

                <ProgressIndicator
                    progress={progressData.progress}
                    currentStep={progressData.sampling_step}
                    totalSteps={progressData.sampling_steps}
                />
            </Box>

            <OutputPanel outputImage={animeShadowOutputImage}/>
        </Box>
    );
}

export default AnimeShadowTab;
