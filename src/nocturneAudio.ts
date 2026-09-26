type AudioNodes = {
  context: AudioContext;
  master: GainNode;
  base: OscillatorNode;
  harmonic: OscillatorNode;
  air: BiquadFilterNode;
  noise: AudioBufferSourceNode;
  noiseGain: GainNode;
};

let nodes: AudioNodes | null = null;

const getAudioContext = () => {
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) return null;

  if (!nodes) {
    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.value = 0.0001;
    master.connect(context.destination);

    const base = context.createOscillator();
    base.type = "sine";
    base.frequency.value = 108;
    base.connect(master);

    const harmonic = context.createOscillator();
    harmonic.type = "sine";
    harmonic.frequency.value = 216;
    harmonic.connect(master);

    const air = context.createBiquadFilter();
    air.type = "lowpass";
    air.frequency.value = 900;
    air.Q.value = 0.7;

    const noise = context.createBufferSource();
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;
    noise.loop = true;
    noise.connect(air);

    const noiseGain = context.createGain();
    noiseGain.gain.value = 0.0001;
    air.connect(noiseGain);
    noiseGain.connect(master);

    base.start();
    harmonic.start();
    noise.start();

    nodes = { context, master, base, harmonic, air, noise, noiseGain };
  }

  return nodes;
};

export const startListeningSound = async (intensity = 0) => {
  const audio = getAudioContext();
  if (!audio) return;

  if (audio.context.state === "suspended") {
    try {
      await audio.context.resume();
    } catch {
      return;
    }
  }

  const now = audio.context.currentTime;
  const level = Math.min(0.075, 0.035 + intensity * 0.006);

  audio.master.gain.cancelScheduledValues(now);
  audio.master.gain.setTargetAtTime(level, now, 0.12);

  audio.base.frequency.cancelScheduledValues(now);
  audio.base.frequency.setTargetAtTime(108 + intensity * 4, now, 0.4);

  audio.harmonic.frequency.cancelScheduledValues(now);
  audio.harmonic.frequency.setTargetAtTime(216 + intensity * 8, now, 0.45);

  audio.harmonic.detune.setTargetAtTime(intensity > 4 ? 3 : 0, now, 0.6);

  audio.noiseGain.gain.cancelScheduledValues(now);
  audio.noiseGain.gain.setTargetAtTime(
    Math.min(0.015, intensity >= 6 ? 0.01 : 0.004 + intensity * 0.0008),
    now,
    0.6,
  );

  audio.air.frequency.setTargetAtTime(700 + intensity * 70, now, 0.7);
};

export const stopListeningSound = () => {
  if (!nodes) return;

  const now = nodes.context.currentTime;
  nodes.master.gain.cancelScheduledValues(now);
  nodes.master.gain.setTargetAtTime(0.0001, now, 0.35);
  nodes.noiseGain.gain.cancelScheduledValues(now);
  nodes.noiseGain.gain.setTargetAtTime(0.0001, now, 0.3);
};

export const isAudioSupported = () => {
  return Boolean(
    window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext,
  );
};
