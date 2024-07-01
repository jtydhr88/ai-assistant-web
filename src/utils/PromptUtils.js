function removeDuplicates(basePrompt) {
    if (!basePrompt) {
        return;
    }

    const promptList = basePrompt.split(", ");
    const seen = new Set();
    const uniqueTags = [];

    promptList.forEach(tag => {
        const tagClean = tag.toLowerCase().trim();
        if (!seen.has(tagClean) && tagClean !== "") {
            uniqueTags.push(tag);
            seen.add(tagClean);
        }
    });

    return uniqueTags.join(", ");
}

function removeColor(basePrompt) {
    if (!basePrompt) {
        return;
    }

    const promptList = basePrompt.split(", ");
    const colorList = ["pink", "red", "orange", "brown", "yellow", "green", "blue", "purple", "blonde", "colored skin", "white hair"];

    const cleanedTags = promptList.filter(tag =>
        !colorList.some(color => tag.toLowerCase().includes(color.toLowerCase()))
    );

    return cleanedTags.join(", ");
}

function executePrompt(executeTags, basePrompt) {
    if (!basePrompt) {
        return;
    }

    const promptList = basePrompt.split(", ");
    const filteredTags = promptList.filter(tag =>
        !executeTags.includes(tag)
    );

    return filteredTags.join(", ");
}

function buildControlNetArgs(image, weight, model, guidanceStart, guidanceEnd, module, thresholdA) {
    const unit = {
        "image": image,
        "control_mode": "Balanced",
        "enabled": "True",
        "pixel_perfect": "True",
        "processor_res": 512,
        "resize_mode": "Just Resize",
        "weight": weight,
        "model": model,
        "hr_option": "Both"
    };

    unit["guidance_start"] = 0;

    if (guidanceStart) {
        unit["guidance_start"] = guidanceStart;
    }

    unit["guidance_end"] = 1;

    if (guidanceEnd) {
        unit["guidance_end"] = guidanceEnd;
    }

    if (thresholdA) {
        unit["threshold_a"] = thresholdA;
    }

    if (model) {
        unit["module"] = module;
    }
    return unit;
}

export {removeDuplicates, removeColor, executePrompt, buildControlNetArgs};