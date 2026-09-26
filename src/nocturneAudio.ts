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
    base.frequency.value = 220;
    base.connect(master);

    const harmonic = context.createOscillator();
    harmonic.type = "sine";
    harmonic.frequency.value = 330;
    harmonic.connect(master);

    const air = context.createBiquadFilter();
    air.type = "lowpass";
    air.frequency.value = 1200;
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

const playWakeTone = (audio: AudioNodes) => {
  const now = audio.context.currentTime;
  const oscillator = audio.context.createOscillator();
  const gain = audio.context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(440, now);
  oscillator.frequency.exponentialRampToValueAtTime(330, now + 0.16);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.055, now + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

  oscillator.connect(gain);
  gain.connect(audio.context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.24);
};

export const startListeningSound = async (intensity = 0) => {
  const audio = getAudioContext();
  if (!audio) return;

  const resumePromise =
    audio.context.state === "suspended" ? audio.context.resume() : Promise.resolve();

  const now = audio.context.currentTime;
  const level = Math.min(0.085, 0.055 + intensity * 0.006);

  audio.master.gain.cancelScheduledValues(now);
  audio.master.gain.setTargetAtTime(level, now, 0.1);

  audio.base.frequency.cancelScheduledValues(now);
  audio.base.frequency.setTargetAtTime(220 + intensity * 5, now, 0.35);

  audio.harmonic.frequency.cancelScheduledValues(now);
  audio.harmonic.frequency.setTargetAtTime(330 + intensity * 9, now, 0.4);

  audio.harmonic.detune.setTargetAtTime(intensity > 4 ? 4 : 0, now, 0.55);

  audio.noiseGain.gain.cancelScheduledValues(now);
  audio.noiseGain.gain.setTargetAtTime(
    Math.min(0.018, intensity >= 6 ? 0.012 : 0.005 + intensity * 0.0009),
    now,
    0.55,
  );

  audio.air.frequency.setTargetAtTime(1000 + intensity * 90, now, 0.65);

  if (intensity === 0) {
    playWakeTone(audio);
  }

  try {
    await resumePromise;
  } catch {
    // The browser may deny audio until another user gesture.
  }
};

export const stopListeningSound = () => {
  if (!nodes) return;

  const now = nodes.context.currentTime;
  nodes.master.gain.cancelScheduledValues(now);
  nodes.master.gain.setTargetAtTime(0.0001, now, 0.3);
  nodes.noiseGain.gain.cancelScheduledValues(now);
  nodes.noiseGain.gain.setTargetAtTime(0.0001, now, 0.25);
};

export const isAudioSupported = () => {
  return Boolean(
    window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext,
  );
};
