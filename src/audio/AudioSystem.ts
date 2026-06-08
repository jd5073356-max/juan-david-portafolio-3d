export class AudioSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private isMuted: boolean = true;
  private isInitialized: boolean = false;

  constructor() {
    // Audio starts uninitialized due to browser autoplay policies
  }

  public init() {
    if (this.isInitialized) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.startDrone();
      this.isInitialized = true;
      this.isMuted = false;
      
      // Smooth fade-in
      this.masterGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 2.5);
    } catch (e) {
      console.warn('Web Audio API not supported in this browser.', e);
    }
  }

  private startDrone() {
    if (!this.ctx || !this.masterGain) return;

    // Deep cosmic drone
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneFilter = this.ctx.createBiquadFilter();

    this.droneOsc1.type = 'sawtooth';
    this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(55.4, this.ctx.currentTime); // Beating detune

    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.setValueAtTime(140, this.ctx.currentTime);
    this.droneFilter.Q.setValueAtTime(5, this.ctx.currentTime);

    // Filter LFO to create a breathing, nebula-like swell
    const filterLFO = this.ctx.createOscillator();
    const filterLFOGain = this.ctx.createGain();
    filterLFO.frequency.setValueAtTime(0.08, this.ctx.currentTime); // Ultra slow 0.08Hz
    filterLFOGain.gain.setValueAtTime(60, this.ctx.currentTime); // Oscillate filter cutoff by +/- 60Hz

    filterLFO.connect(filterLFOGain);
    filterLFOGain.connect(this.droneFilter.frequency);

    // Mix Drone Oscillators
    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    this.droneOsc1.connect(this.droneFilter);
    this.droneOsc2.connect(this.droneFilter);
    this.droneFilter.connect(droneGain);
    droneGain.connect(this.masterGain);

    this.droneOsc1.start();
    this.droneOsc2.start();
    filterLFO.start();
  }

  public toggleMute(): boolean {
    if (!this.isInitialized) {
      this.init();
      return false; 
    }

    if (!this.ctx || !this.masterGain) return true;

    if (this.isMuted) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.masterGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.5);
      this.isMuted = false;
    } else {
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
      this.isMuted = true;
    }

    return this.isMuted;
  }

  public getMutedStatus(): boolean {
    return this.isMuted;
  }

  // Trigger cosmic chime on Hover
  public playChime(freq: number = 600, duration: number = 0.8) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const delay = this.ctx.createDelay();
    const delayGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    // Subtle glide
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

    gainNode.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    // Space Echo Delay
    delay.delayTime.setValueAtTime(0.25, this.ctx.currentTime);
    delayGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    osc.connect(gainNode);
    gainNode.connect(this.masterGain);

    // Feedback Loop for Echo
    gainNode.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(this.masterGain);
    delayGain.connect(delay); // loop back

    osc.start();
    osc.stop(this.ctx.currentTime + duration + 1.0);
  }

  // Trigger Gravity Bend effect (pitch sweep down)
  public playGravityBend(downward: boolean = true) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle';
    const startFreq = downward ? 180 : 80;
    const endFreq = downward ? 70 : 250;
    const duration = downward ? 0.6 : 0.4;

    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);

    gainNode.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Trigger Wormhole transmission sound (on successful submit)
  public playWormhole() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const noise = this.ctx.createOscillator(); // we'll use a detuned sawtooth for high energy
    const gainNode = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(40, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 1.0);

    noise.type = 'square';
    noise.frequency.setValueAtTime(100, this.ctx.currentTime);
    noise.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 1.2);

    gainNode.gain.setValueAtTime(0.0, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.4);

    osc.connect(gainNode);
    noise.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc.start();
    noise.start();
    osc.stop(this.ctx.currentTime + 1.5);
    noise.stop(this.ctx.currentTime + 1.5);
  }
}
