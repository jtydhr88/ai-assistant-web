import React, {useState, useEffect} from 'react';
import {Box, Button, Typography} from '@mui/material';
import {useImages} from '../ImageContext';
import {buildPayload, sendRequest} from "../utils/RequestApi";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ProgressIndicator from '../components/ProgressIndicator';
import PromptAnalyzer from '../components/PromptAnalyzer';
import {prepareImage} from "../utils/ImgUtils";
import OutputPanel from "../components/OutputPanel";
import InputPanel from "../components/InputPanel";
import MaskPanel from "../components/MaskPanel";
import Img2ImgConfigPanel from "../components/Img2ImgConfigPanel";

function Img2ImgTab() {
    const [isCVReady, setCVReady] = useState(false);

    const {
        img2imgInputImage, setImg2imgInputImage,
        maskImage, setMaskImage,
        inputAnytestImage, setInputAnytestImage,
        img2imgOutputImage, setImg2imgOutputImage
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
                        if (data.progress >= 1 || data.state.sampling_step === data.state.sampling_steps) {
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
    const [imageFidelity, setImageFidelity] = useState(0.35);
    const [anytestValue, setAnytestValueValue] = useState('none');
    const [anytestFidelity, setAnytestFidelity] = useState(1);
    const [generateButtonText, setGenerateButtonText] = useState('Generate');

    const [progressData, setProgressData] = useState({
        progress: 0,
        sampling_step: 0,
        sampling_steps: 0
    });

    const handleAnytestValueChange = (event) => {
        setAnytestValueValue(event.target.value);
    };


    const handleMaskImageChange = (event, setMaskImage, setMaskImageBase64) => {

    }

    function updateGenerateStatus(isGenerating, generateButtonText, consoleMessage) {
        setIsGenerating(isGenerating);
        setGenerateButtonText(generateButtonText);

        console.log(consoleMessage);
    }

    const handleAnytestImageChange = () => {
        console.log("handleAnytestImageChange...");
    };

    function postGenerateSuccess(data) {
        const base64Image = data.images[0];
        const imageSrc = `data:image/jpeg;base64,${base64Image}`;
        setImg2imgOutputImage(imageSrc);

        updateGenerateStatus(false, 'Generate', 'Generate success')
    }

    function postGenerateError() {
        updateGenerateStatus(false, 'Generate', 'Generate failed')
    }

    const handleGenerate = () => {
        if (!img2imgInputImage) {
            alert('Please upload an image first.');
            return;
        }

        setIsGenerating(true);
        setGenerateButtonText('Generating...');

        console.log("Generating...");

        const payload = buildPayload(prompt, negativePrompt, width, height, null, null, prepareImage(img2imgInputImage), prepareImage(maskImage), imageFidelity, "i2i");

        sendRequest('http://127.0.0.1:7861/sdapi/v1/img2img', 'POST', payload, postGenerateSuccess, postGenerateError)
    };

    if (!isCVReady) {
        return <div>Loading OpenCV...</div>;
    }

    const cv = window.cv;

    return (
        <Box sx={{display: 'flex', gap: 2}}>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
                <Box sx={{display: 'flex', gap: 2}}>
                    <div style={{width: '50%'}}>
                        <InputPanel inputImage={img2imgInputImage} setInputImage={setImg2imgInputImage}
                                    setHeight={setHeight} setWidth={setWidth} label="Input Image"/>
                    </div>
                    <div style={{width: '50%'}}>
                        <MaskPanel maskImage={maskImage} inputImage={img2imgInputImage} setMaskImage={setMaskImage}
                                   cv={cv} handleMaskImageChange={handleMaskImageChange}/>
                    </div>
                </Box>
                <div>
                    <Typography variant="h6">Anytest Image</Typography>
                    <input
                        type="file"
                        onChange={(e) => handleAnytestImageChange(e, setInputAnytestImage)}
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

                <PromptAnalyzer inputImage={img2imgInputImage}
                                prompt={prompt} setPrompt={setPrompt} negativePrompt={negativePrompt}
                                setNegativePrompt={setNegativePrompt}/>

                <Img2ImgConfigPanel imageFidelity={imageFidelity} setImageFidelity={setImageFidelity}
                                    anytestFidelity={anytestFidelity} setAnytestFidelity={setAnytestFidelity}/>

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
            <OutputPanel outputImage={img2imgOutputImage}/>
        </Box>
    );
}

export default Img2ImgTab;
