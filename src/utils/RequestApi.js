// RequestApi.js
function buildPayload(prompt, nega, w, h, unit1, unit2, encodedBase, encodedMask, imageFidelity, mode) {
    if (mode === "i2i") {
        return {
            init_images: [encodedBase],
            //mask: encodedMask,
            mask_blur: 4,
            inpainting_fill: 1,
            denoising_strength: imageFidelity,
            prompt: prompt,
            negative_prompt: nega,
            seed: -1,
            sampler_name: "Euler a",
            steps: 20,
            cfg_scale: 7,
            width: w,
            height: h,
        };
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
