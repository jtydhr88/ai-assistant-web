import React, {useState} from 'react';
import {Button, TextField} from "@mui/material";
import {prepareImage} from "../utils/ImgUtils";

function PromptAnalyzer({inputImage, prompt, setPrompt, negativePrompt, setNegativePrompt}) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzeButtonText, setAnalyzeButtonText] = useState('Analyze Prompt');

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
                body: JSON.stringify({image_base64: prepareImage(inputImage)})
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

    return (
        <div>

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
            <Button variant="outlined" onClick={handleAnalyzePrompt} style={{marginTop: 8}} disabled={isAnalyzing}>
                {analyzeButtonText}
            </Button>
        </div>
    );
}

export default PromptAnalyzer;