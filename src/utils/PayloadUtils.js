function getDefaultImg2ImgPayload() {
  return {
    seed: -1,
    sampler_name: "Euler a",
    steps: 20,
    cfg_scale: 7,
    override_settings: { CLIP_stop_at_last_layers: 2 },
    override_settings_restore_afterwards: "False",
  };
}

function getDefaultControlUnitPayload() {
  return {
    enabled: "True",
    pixel_perfect: "True",
    hr_option: "Both",
    processor_res: 512,
    resize_mode: "Just Resize",
    control_mode: "Balanced",
    guidance_start: 0,
    guidance_end: 1,
  };
}

export { getDefaultImg2ImgPayload, getDefaultControlUnitPayload };
