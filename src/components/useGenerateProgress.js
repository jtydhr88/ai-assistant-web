import { useState, useEffect } from "react";
import { useIntl } from "react-intl";

const useGenerateProgress = () => {
  const intl = useIntl();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isInterruptable, setIsInterruptable] = useState(false);
  const [generateButtonText, setGenerateButtonText] = useState(
    intl.formatMessage({ id: "generate", defaultMessage: "Generate" })
  );
  const [progressData, setProgressData] = useState({
    progress: 0,
    sampling_step: 0,
    sampling_steps: 0,
  });

  useEffect(() => {
    if (isGenerating) {
      const fetchProgress = () => {
        fetch("http://127.0.0.1:7861/sdapi/v1/progress")
          .then((response) => response.json())
          .then((data) => {
            if (data.state.job_timestamp === "0") {
              return;
            }

            setIsInterruptable(true);

            setProgressData({
              progress: data.progress,
              sampling_step: data.state.sampling_step,
              sampling_steps: data.state.sampling_steps,
            });
            if (data.progress >= 1 || data.state.sampling_step === data.state.sampling_steps) {
              setProgressData({
                progress: 1,
                sampling_step: data.state.sampling_steps,
                sampling_steps: data.state.sampling_steps,
              });

              setIsGenerating(false);
              setIsInterruptable(false);
            }
          })
          .catch((error) => console.error("Error fetching progress:", error));
      };

      let interval = setInterval(fetchProgress, 500);

      return () => clearInterval(interval);
    } else {
      setGenerateButtonText(intl.formatMessage({ id: "generate", defaultMessage: "Generate" }));
      setIsInterruptable(false);
      setProgressData({
        progress: 1,
        sampling_step: 0,
        sampling_steps: 0,
      });
    }
  }, [isGenerating]);

  return {
    isGenerating,
    setIsGenerating,
    generateButtonText,
    setGenerateButtonText,
    progressData,
    setProgressData,
    isInterruptable,
    setIsInterruptable,
  };
};

export default useGenerateProgress;
