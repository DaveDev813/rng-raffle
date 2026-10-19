import { onBeforeUnmount, ref } from 'vue';

export function useRaffleAudio() {
  const soundEnabled = ref(true);
  let context: AudioContext | undefined;
  const voices = new Set<OscillatorNode>();

  function stop() {
    for (const voice of voices) voice.stop();
    voices.clear();
  }

  // Called directly from the Draw gesture so browsers can unlock playback.
  function unlock() {
    if (!soundEnabled.value) return;
    try {
      context ??= new AudioContext();
      if (context.state === 'suspended') void context.resume().catch(() => {});
    } catch {
      // Audio is optional; unsupported browsers can still run the raffle.
    }
  }

  function tone(
    frequency: number,
    offset: number,
    duration: number,
    volume: number,
  ) {
    if (!soundEnabled.value || context?.state !== 'running') return;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const start = context.currentTime + offset;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(volume, start + 0.005);
    envelope.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(context.destination);
    voices.add(oscillator);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
      voices.delete(oscillator);
    };
    oscillator.start(start);
    oscillator.stop(start + duration + 0.01);
  }

  function tick() {
    tone(880, 0, 0.035, 0.12);
  }

  function celebrate() {
    stop();
    [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
      tone(frequency, index * 0.14, index === 3 ? 1.1 : 0.24, 0.16);
    });
    [523.25, 659.25, 783.99].forEach((frequency) => {
      tone(frequency, 0.56, 1, 0.07);
    });
  }

  function toggle() {
    soundEnabled.value = !soundEnabled.value;
    if (!soundEnabled.value) stop();
    else unlock();
  }

  onBeforeUnmount(() => {
    stop();
    if (context) void context.close().catch(() => {});
  });

  return { soundEnabled, unlock, tick, celebrate, stop, toggle };
}
