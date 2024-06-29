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

export {removeDuplicates, removeColor, executePrompt};