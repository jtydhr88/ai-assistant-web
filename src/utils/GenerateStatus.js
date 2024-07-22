function updateGenerateStatus(
  isGenerating,
  setIsGenerating,
  generateButtonText,
  setGenerateButtonText,
  consoleMessage
) {
  setIsGenerating(isGenerating);
  setGenerateButtonText(generateButtonText);

  console.log(consoleMessage);
}

function postGenerateError(error, setIsGenerating, setGenerateButtonText) {
  updateGenerateStatus(false, setIsGenerating, "Generate", setGenerateButtonText, error);
}

export { updateGenerateStatus, postGenerateError };
