// RequestApi.js
function buildPayload(prompt, nega, w, h, unit1, unit2, encodedBase, encodedMask, imageFidelity, mode) {
    if (mode === "i2i") {
        return JSON.stringify({
            'init_images': [encodedBase],
            'denoising_strength': 1- imageFidelity,
            'prompt': prompt,
            'negative_prompt': nega,
            'seed': -1,
            'sampler_name': "Euler a",
            'steps': 20,
            'cfg_scale': 7,
            'width': w,
            'height': h,
            'override_settings': {'CLIP_stop_at_last_layers': 2},
            'override_settings_restore_afterwards': 'False',
            'mask': encodedMask,
            'mask_blur': 4,
            'inpainting_fill': 1,
        });
    } else if (mode === "lineart" || mode === "normalmap") {
        return {
            init_images: [encodedBase],
            denoising_strength: imageFidelity,
            prompt: prompt,
            negative_prompt: nega,
            seed: -1,
            sampler_name: "Euler a",
            steps: 20,
            cfg_scale: 7,
            width: w,
            height: h,
            alwayson_scripts: { "ControlNet": { args: [unit1] } },
        };
    } else if (mode === "anime_shadow") {
        return {
            init_images: [encodedMask], // Note this uses encodedMask
            denoising_strength: imageFidelity,
            prompt: prompt,
            negative_prompt: nega,
            seed: -1,
            sampler_name: "Euler a",
            steps: 20,
            cfg_scale: 7,
            width: w,
            height: h,
            alwayson_scripts: { "ControlNet": { args: [unit1, unit2] } },
        };
    }
}

export { buildPayload };
