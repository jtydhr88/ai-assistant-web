import React, {useState} from 'react';
import {Box, Button} from '@mui/material';
import {useImages} from '../ImageContext';
import InputPanel from "../components/InputPanel";
import OutputPanel from "../components/OutputPanel";
import LightConfigPanel from "../components/LightConfigPanel";
import {prepareImage} from "../utils/ImgUtils";
import {sendRequest} from "../utils/RequestApi";

function LightTab() {

    const {
        lightInputImage, setLightInputImage,
        lightOutputImage, setLightOutputImage,
    } = useImages();

    const [isGenerating, setIsGenerating] = useState(false);

    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    const [lightYaw, setLightYaw] = useState(60);
    const [lightPitch, setLightPitch] = useState(-60);
    const [specularPower, setSpecularPower] = useState(30);
    const [normalDiffuseStrength, setNormalDiffuseStrength] = useState(1);
    const [specularHighlightsStrength, setSpecularHighlightsStrength] = useState(0.8);
    const [totalGain, setTotalGain] = useState(0.6);
    const [generateButtonText, setGenerateButtonText] = useState('Generate');

    function postGenerateSuccess(data) {
        const base64Image = data["light_img"];
        const imageSrc = `data:image/jpeg;base64,${base64Image}`;
        setLightOutputImage(imageSrc);

        setIsGenerating(false);
        setGenerateButtonText('Generate');
    }

    function postGenerateError() {
        setIsGenerating(false);
        setGenerateButtonText('Generate');
    }

    const handleGenerate = async () => {
        if (!lightInputImage) {
            alert('Please upload an image first.');
            return;
        }

        setIsGenerating(true);
        setGenerateButtonText('Generating...');

        console.log("Generating...");

        const payload = JSON.stringify({
            image_base64: prepareImage(lightInputImage),
            light_yaw: lightYaw,
            light_pitch: lightPitch,
            specular_power: specularPower,
            normal_diffuse_strength: normalDiffuseStrength,
            specular_highlights_strength: specularHighlightsStrength,
            total_gain: totalGain
        });

        sendRequest('http://127.0.0.1:7861/ai-assistant/light_process', 'POST', payload, postGenerateSuccess, postGenerateError)
    };

    return (
        <Box sx={{display: 'flex', gap: 2}}>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
                <Box sx={{display: 'flex', gap: 2}}>
                    <div style={{width: '50%'}}>
                        <InputPanel inputImage={lightInputImage}
                                    setInputImage={setLightInputImage}
                                    setHeight={setHeight} setWidth={setWidth} label="Input Image"
                        />
                    </div>
                </Box>

                <LightConfigPanel lightYaw={lightYaw} setLightYaw={setLightYaw}
                                  lightPitch={lightPitch} setLightPitch={setLightPitch}
                                  specularPower={specularPower} setSpecularPower={setSpecularPower}
                                  normalDiffuseStrength={normalDiffuseStrength}
                                  setNormalDiffuseStrength={setNormalDiffuseStrength}
                                  specularHighlightsStrength={specularHighlightsStrength}
                                  setSpecularHighlightsStrength={setSpecularHighlightsStrength}
                                  totalGain={totalGain} setTotalGain={setTotalGain}/>


                <Button variant="outlined" onClick={handleGenerate} style={{marginTop: 8}} disabled={isGenerating}>
                    {generateButtonText}
                </Button>
            </Box>

            <OutputPanel outputImage={lightOutputImage}/>
        </Box>
    );
}

export default LightTab;
