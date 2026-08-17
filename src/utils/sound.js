// src/utils/sound.js

let audioCtx = null;
let sfxEnabled = true;
let voiceEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSfxEnabled(value) {
  sfxEnabled = value;
}

export function setVoiceEnabled(value) {
  voiceEnabled = value;
  if (!value) {
    window.speechSynthesis?.cancel();
  }
}

/* ---------------- SFX (move / merge / win / lose) ---------------- */

function playNote({ frequency, duration = 0.2, type = 'sine', volume = 0.15, filterFreq = 2500, delay = 0 }) {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  const startTime = ctx.currentTime + delay;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(filterFreq, startTime);
  filter.Q.setValueAtTime(0.7, startTime);

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(volume, startTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.05);
}

export function playMoveSound() {
  playNote({ frequency: 300, duration: 0.05, type: 'sine', volume: 0.06, filterFreq: 1500 });
}

/**
 * Plays a chime for a single merge (used internally).
 */
function playSingleMergeChime(value, delay = 0) {
  const tier = Math.log2(value);
  const baseFreq = 260 + tier * 40;
  playNote({ frequency: baseFreq, duration: 0.2, type: 'triangle', volume: 0.18, filterFreq: 4000, delay });
  playNote({ frequency: baseFreq * 1.5, duration: 0.15, type: 'sine', volume: 0.08, filterFreq: 4000, delay: delay + 0.02 });
}

/**
 * Plays merge sound(s) for a move. Accepts an array of merged tile values
 * (one move can trigger multiple merges on a 5x5 board). Each merge gets
 * its own chime, staggered slightly so multi-merges sound like a satisfying
 * cascade instead of one single flat tone.
 */
export function playMergeSound(mergedValues) {
  const values = Array.isArray(mergedValues) ? mergedValues : [mergedValues];
  values.forEach((value, i) => {
    playSingleMergeChime(value, i * 0.08); // slight stagger between each merge
  });
}

export function playNewGameSound() {
  [392, 494, 587, 784].forEach((freq, i) => {
    playNote({ frequency: freq, duration: 0.2, type: 'triangle', volume: 0.15, filterFreq: 3500, delay: i * 0.08 });
  });
}

export function playWinSound() {
  [523, 659, 784, 1046].forEach((freq, i) => {
    playNote({ frequency: freq, duration: 0.3, type: 'triangle', volume: 0.18, filterFreq: 4000, delay: i * 0.12 });
  });
}

export function playGameOverSound() {
  [440, 392, 349, 330].forEach((freq, i) => {
    playNote({ frequency: freq, duration: 0.3, type: 'sine', volume: 0.12, filterFreq: 1500, delay: i * 0.15 });
  });
}

/* ---------------- Voice praise (Web Speech API) — natural, slow, calm ---------------- */

const PRAISE_WORDS = ['Nice', 'Great', 'Well done', 'Sweet'];
const BIG_PRAISE_WORDS = ['Incredible', 'Amazing', 'Fantastic', 'Wonderful'];

let cachedVoice = null;

function loadVoice() {
  const voices = window.speechSynthesis?.getVoices() || [];
  if (voices.length === 0) return null;
  // Prefer a natural/neural-sounding female English voice if the browser has one
  return (
    voices.find((v) => v.name.includes('Google US English')) ||
    voices.find((v) => v.name.toLowerCase().includes('natural')) ||
    voices.find((v) => v.lang === 'en-US' && v.name.toLowerCase().includes('female')) ||
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang.startsWith('en')) ||
    voices[0]
  );
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = loadVoice();
  };
  cachedVoice = loadVoice();
}

function speak(text) {
  if (!voiceEnabled) return;
  if (!window.speechSynthesis) return;

  if (!cachedVoice) cachedVoice = loadVoice();

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  if (cachedVoice) utterance.voice = cachedVoice;
  // Slight randomization in pitch/rate per call so repeated words don't sound
  // identically robotic every time — mimics natural human variation
  utterance.pitch = 0.95 + Math.random() * 0.15;
  utterance.rate = 0.82 + Math.random() * 0.08;
  utterance.volume = 0.9;
  window.speechSynthesis.speak(utterance);
}

/**
 * Called on every merge. Speaks praise for solid merges, without
 * overlapping/talking on every tiny move.
 */
export function maybePlayPraise(mergedValue) {
  const tier = Math.log2(mergedValue); // 16->4, 32->5, 64->6, 256->8...

  if (tier >= 8) {
    const word = BIG_PRAISE_WORDS[Math.floor(Math.random() * BIG_PRAISE_WORDS.length)];
    speak(word);
  } else if (tier >= 4 && Math.random() < 0.6) {
    const word = PRAISE_WORDS[Math.floor(Math.random() * PRAISE_WORDS.length)];
    speak(word);
  }
}

export function playWinVoice() {
  speak('Incredible, you did it');
}

export function playGameOverVoice() {
  speak('Good game, try again');
}