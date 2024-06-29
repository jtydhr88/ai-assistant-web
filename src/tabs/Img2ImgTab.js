import React, {useState, useEffect} from 'react';
import {Box, Button, TextField, Slider, Typography} from '@mui/material';
import {useImages} from '../ImageContext';
import {buildPayload} from "../utils/RequestApi";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ProgressIndicator from '../components/ProgressIndicator';
import PromptAnalyzer from '../components/PromptAnalyzer';
import {processMaskImage} from "../utils/OpenCVUtils";
import {prepareImage} from "../utils/ImgUtils";
import OutputPanel from "../components/OutputPanel";
import InputPanel from "../components/InputPanel";

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

    const handleAnytestImageChange = () => {
        console.log("handleAnytestImageChange...");
    };

    const handleGenerate = () => {
        if (!img2imgInputImage) {
            alert('Please upload an image first.');
            return;
        }

        setIsGenerating(true);
        setGenerateButtonText('Generating...');

        console.log("Generating...");

        const payload = buildPayload(prompt, negativePrompt, width, height, null, null, prepareImage(img2imgInputImage), prepareImage(maskImage), imageFidelity, "i2i");

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
                    setImg2imgOutputImage(imageSrc);

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

    if (!isCVReady) {
        return <div>Loading OpenCV...</div>;
    }

    const cv = window.cv;

    function createMask(event, setMaskImageBase64) {
        if (!img2imgInputImage) {
            alert('Please upload an image first.');
            return;
        }

        const imgElement = document.createElement('img');
        imgElement.src = img2imgInputImage;

        imgElement.onload = () => {
            processMaskImage(cv, imgElement).then(dataUrl => {
                setMaskImage(dataUrl);
            });
        };
    }

    return (
        <Box sx={{display: 'flex', gap: 2}}>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
                <Box sx={{display: 'flex', gap: 2}}>
                    <div style={{width: '50%'}}>
                        <InputPanel inputImage={img2imgInputImage} setInputImage={setImg2imgInputImage}
                                    setHeight={setHeight} setWidth={setWidth}/>
                    </div>
                    <div style={{width: '50%'}}>
                        <Typography variant="h6">Mask Image</Typography>
                        <input
                            type="file"
                            onChange={(e) => handleMaskImageChange(e, setMaskImage)}
                            style={{display: 'block', marginBottom: 8}}
                        />
                        {maskImage && <img src={maskImage} alt="Mask" style={{width: '100%', height: 'auto'}}/>}
                        <Box sx={{display: 'flex', justifyContent: 'space-between', marginTop: 1}}>
                            <Button variant="outlined"
                                    onClick={(e) => createMask(e, setMaskImage)}>Create</Button>
                        </Box>
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
            <OutputPanel outputImage={img2imgOutputImage}/>
        </Box>
    );
}

export default Img2ImgTab;
