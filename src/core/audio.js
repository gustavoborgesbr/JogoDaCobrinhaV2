/**
 * Audio System
 * Gerador de efeitos sonoros procedural e Sintetizador de Música Chiptune/RPG em tempo real via Web Audio API
 */

class SoundEffects {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.volume = 0.7;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playShoot() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

        gain.gain.setValueAtTime(0.2 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    playHit() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

        gain.gain.setValueAtTime(0.25 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    playItemCollect() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.12); // G5

        gain.gain.setValueAtTime(0.2 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    playLevelUp() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + i * 0.08;

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.15 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.15);
        });
    }

    playDash() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.18);

        gain.gain.setValueAtTime(0.2 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
    }

    playShield() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(500, now + 0.1);
        osc.frequency.linearRampToValueAtTime(400, now + 0.25);

        gain.gain.setValueAtTime(0.18 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    playBossRoar() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.linearRampToValueAtTime(45, now + 0.4);

        gain.gain.setValueAtTime(0.3 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
    }

    playEat() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);

        gain.gain.setValueAtTime(0.15 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    playBite() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Crunch de mordida feroz (oscilador rápido com distorção rítmica)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(480, now);
        osc1.frequency.exponentialRampToValueAtTime(80, now + 0.16);

        osc2.type = 'square';
        osc2.frequency.setValueAtTime(240, now);
        osc2.frequency.exponentialRampToValueAtTime(60, now + 0.16);

        gain.gain.setValueAtTime(0.35 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.16);
        osc2.stop(now + 0.16);
    }

    playGameOver() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [300, 240, 180, 120];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + i * 0.15;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.2 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.2);
        });
    }
}

/**
 * Procedural Music Synthesizer
 * Gera trilhas sonoras completas para cada fase e menu usando síntese de osciladores,
 * loops automáticos com precisão de tempo Web Audio e transições suaves (cross-fade).
 */
class MusicManager {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.currentTrack = null;
        this.currentTrackName = 'Nenhuma';
        this.isPlaying = false;
        this.enabled = true;
        this.volume = 0.55;
        this.tempo = 110; // BPM
        this.step = 0;
        this.timerId = null;
        this.nextNoteTime = 0;
        this.lookahead = 25.0; // ms
        this.scheduleAheadTime = 0.1; // seg

        // Dicionário de Notas Frequências (Hz)
        this.notes = {
            'C2': 65.41, 'D2': 73.42, 'Eb2': 77.78, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'Ab2': 103.83, 'A2': 110.00, 'Bb2': 116.54, 'B2': 123.47,
            'C3': 130.81, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'Ab3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
            'C4': 261.63, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
            'C5': 523.25, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'Ab5': 830.61, 'A5': 880.00, 'B5': 987.77,
            'REST': 0
        };

        // Trilhas Musicais Procedurais
        this.tracks = {
            'menu': {
                name: 'Templo da Serpente Ancestral',
                bpm: 96,
                leadType: 'triangle',
                bassType: 'sine',
                arpType: 'sine',
                steps: 32,
                lead: [
                    'E4', 'REST', 'G4', 'REST', 'B4', 'REST', 'A4', 'REST',
                    'G4', 'E4', 'REST', 'D4', 'E4', 'REST', 'REST', 'REST',
                    'E4', 'REST', 'B4', 'REST', 'D5', 'REST', 'C5', 'REST',
                    'B4', 'A4', 'G4', 'F4', 'E4', 'REST', 'REST', 'REST'
                ],
                bass: [
                    'E2', 'REST', 'E2', 'REST', 'G2', 'REST', 'A2', 'REST',
                    'E2', 'REST', 'E2', 'REST', 'D2', 'REST', 'E2', 'REST',
                    'C3', 'REST', 'C3', 'REST', 'D3', 'REST', 'D3', 'REST',
                    'E2', 'REST', 'E2', 'REST', 'B2', 'REST', 'E2', 'REST'
                ],
                arp: [
                    'E4', 'G4', 'B4', 'E5', 'B4', 'G4', 'A4', 'C5',
                    'E4', 'G4', 'B4', 'E5', 'D4', 'F4', 'A4', 'D5',
                    'C4', 'E4', 'G4', 'C5', 'D4', 'F#4', 'A4', 'D5',
                    'E4', 'G4', 'B4', 'E5', 'G4', 'B4', 'E4', 'REST'
                ],
                drums: [
                    1, 0, 0, 0, 2, 0, 0, 0,
                    1, 0, 0, 0, 2, 0, 1, 0,
                    1, 0, 0, 0, 2, 0, 0, 0,
                    1, 0, 1, 0, 2, 0, 2, 0
                ]
            },

            'stage1': {
                name: 'A Floresta Sombria',
                bpm: 118,
                leadType: 'square',
                bassType: 'triangle',
                arpType: 'triangle',
                steps: 32,
                lead: [
                    'A4', 'REST', 'C5', 'REST', 'E5', 'D5', 'C5', 'B4',
                    'A4', 'REST', 'E4', 'REST', 'G4', 'REST', 'A4', 'REST',
                    'C5', 'D5', 'E5', 'REST', 'G5', 'E5', 'D5', 'C5',
                    'D5', 'REST', 'B4', 'REST', 'A4', 'REST', 'REST', 'REST'
                ],
                bass: [
                    'A2', 'A2', 'REST', 'A2', 'C3', 'REST', 'D3', 'REST',
                    'A2', 'A2', 'REST', 'A2', 'G2', 'REST', 'A2', 'REST',
                    'F2', 'F2', 'REST', 'F2', 'G2', 'REST', 'G2', 'REST',
                    'A2', 'A2', 'REST', 'A2', 'E2', 'REST', 'A2', 'REST'
                ],
                arp: [
                    'A3', 'C4', 'E4', 'A4', 'A3', 'C4', 'E4', 'A4',
                    'G3', 'B3', 'D4', 'G4', 'A3', 'C4', 'E4', 'A4',
                    'F3', 'A3', 'C4', 'F4', 'G3', 'B3', 'D4', 'G4',
                    'A3', 'C4', 'E4', 'A4', 'E3', 'G3', 'B3', 'E4'
                ],
                drums: [
                    1, 0, 2, 0, 1, 0, 2, 0,
                    1, 0, 2, 0, 1, 1, 2, 0,
                    1, 0, 2, 0, 1, 0, 2, 0,
                    1, 1, 2, 0, 1, 0, 2, 2
                ]
            },

            'stage2': {
                name: 'As Cavernas de Cristal',
                bpm: 128,
                leadType: 'sawtooth',
                bassType: 'sawtooth',
                arpType: 'sine',
                steps: 32,
                lead: [
                    'D4', 'REST', 'F4', 'REST', 'A4', 'REST', 'G#4', 'REST',
                    'A4', 'D5', 'C5', 'REST', 'A4', 'F4', 'E4', 'REST',
                    'D4', 'F4', 'A4', 'C5', 'D5', 'REST', 'C5', 'REST',
                    'Bb4', 'A4', 'G4', 'F4', 'E4', 'REST', 'D4', 'REST'
                ],
                bass: [
                    'D2', 'D2', 'D2', 'F2', 'G2', 'REST', 'G#2', 'A2',
                    'D2', 'D2', 'D2', 'F2', 'C3', 'REST', 'Bb2', 'A2',
                    'Bb2', 'Bb2', 'REST', 'Bb2', 'C3', 'C3', 'REST', 'C3',
                    'D2', 'D2', 'REST', 'D2', 'A1', 'REST', 'D2', 'REST'
                ],
                arp: [
                    'D4', 'F4', 'A4', 'D5', 'D4', 'F4', 'G#4', 'D5',
                    'D4', 'F4', 'A4', 'D5', 'C4', 'E4', 'G4', 'C5',
                    'Bb3', 'D4', 'F4', 'Bb4', 'C4', 'E4', 'G4', 'C5',
                    'D4', 'F4', 'A4', 'D5', 'A3', 'C#4', 'E4', 'A4'
                ],
                drums: [
                    1, 2, 0, 2, 1, 0, 2, 1,
                    1, 2, 0, 2, 1, 1, 2, 2,
                    1, 2, 0, 2, 1, 0, 2, 1,
                    1, 1, 2, 2, 1, 2, 2, 2
                ]
            },

            'boss': {
                name: 'O Despertar do Grande Dragão',
                bpm: 142,
                leadType: 'sawtooth',
                bassType: 'sawtooth',
                arpType: 'square',
                steps: 32,
                lead: [
                    'B4', 'REST', 'D5', 'REST', 'F#5', 'F5', 'E5', 'D5',
                    'B4', 'REST', 'F#4', 'REST', 'A4', 'REST', 'B4', 'REST',
                    'D5', 'E5', 'F#5', 'REST', 'A5', 'F#5', 'E5', 'D5',
                    'E5', 'F#5', 'E5', 'D5', 'C#5', 'REST', 'B4', 'REST'
                ],
                bass: [
                    'B1', 'B1', 'B2', 'B1', 'D2', 'REST', 'E2', 'F#2',
                    'B1', 'B1', 'B2', 'B1', 'A1', 'REST', 'B1', 'REST',
                    'G1', 'G1', 'G2', 'G1', 'A1', 'A1', 'A2', 'A1',
                    'B1', 'B1', 'B2', 'B1', 'F#1', 'REST', 'B1', 'REST'
                ],
                arp: [
                    'B3', 'D4', 'F#4', 'B4', 'B3', 'D4', 'F#4', 'B4',
                    'A3', 'C#4', 'E4', 'A4', 'B3', 'D4', 'F#4', 'B4',
                    'G3', 'B3', 'D4', 'G4', 'A3', 'C#4', 'E4', 'A4',
                    'B3', 'D4', 'F#4', 'B4', 'F#3', 'A#3', 'C#4', 'F#4'
                ],
                drums: [
                    1, 1, 2, 0, 1, 1, 2, 1,
                    1, 1, 2, 0, 1, 2, 2, 2,
                    1, 1, 2, 0, 1, 1, 2, 1,
                    1, 2, 1, 2, 2, 2, 2, 2
                ]
            },

            'victory': {
                name: 'Triunfo dos Campeões',
                bpm: 120,
                leadType: 'triangle',
                bassType: 'sine',
                arpType: 'sine',
                steps: 16,
                lead: [
                    'C5', 'E5', 'G5', 'C6', 'REST', 'G5', 'REST', 'C6',
                    'A5', 'REST', 'B5', 'REST', 'C6', 'REST', 'REST', 'REST'
                ],
                bass: [
                    'C3', 'REST', 'E3', 'REST', 'F3', 'REST', 'G3', 'REST',
                    'F3', 'REST', 'G3', 'REST', 'C3', 'REST', 'C3', 'REST'
                ],
                arp: [
                    'C4', 'E4', 'G4', 'C5', 'F4', 'A4', 'C5', 'F5',
                    'G4', 'B4', 'D5', 'G5', 'C4', 'E4', 'G4', 'C5'
                ],
                drums: [
                    1, 0, 2, 0, 1, 0, 2, 0,
                    1, 0, 2, 0, 1, 1, 2, 2
                ]
            },

            'gameover': {
                name: 'Elegia da Serpente',
                bpm: 80,
                leadType: 'sawtooth',
                bassType: 'sine',
                arpType: 'sine',
                steps: 16,
                lead: [
                    'E4', 'REST', 'D4', 'REST', 'C4', 'REST', 'B3', 'REST',
                    'A3', 'REST', 'G3', 'REST', 'E3', 'REST', 'REST', 'REST'
                ],
                bass: [
                    'A2', 'REST', 'REST', 'REST', 'F2', 'REST', 'REST', 'REST',
                    'D2', 'REST', 'REST', 'REST', 'E2', 'REST', 'A1', 'REST'
                ],
                arp: [
                    'A3', 'C4', 'E4', 'A4', 'F3', 'A3', 'C4', 'F4',
                    'D3', 'F3', 'A3', 'D4', 'E3', 'G#3', 'B3', 'E4'
                ],
                drums: [
                    1, 0, 0, 0, 2, 0, 0, 0,
                    1, 0, 0, 0, 2, 0, 0, 0
                ]
            }
        };
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
                this.masterGain.connect(this.ctx.destination);
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTheme(trackKey) {
        if (!this.tracks[trackKey]) return;
        this.init();

        // Se já está tocando essa mesma trilha, não reiniciar
        if (this.currentTrack === trackKey && this.isPlaying) return;

        this.currentTrack = trackKey;
        this.currentTrackName = this.tracks[trackKey].name;
        this.tempo = this.tracks[trackKey].bpm;
        this.step = 0;
        this.isPlaying = true;

        if (this.ctx) {
            this.nextNoteTime = this.ctx.currentTime + 0.05;
        }

        // Suave Crossfade In
        if (this.masterGain && this.ctx) {
            const now = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
            this.masterGain.gain.linearRampToValueAtTime(this.enabled ? this.volume : 0, now + 0.4);
        }

        if (!this.timerId) {
            this.timerId = setInterval(() => this.scheduler(), this.lookahead);
        }

        this.notifyUI();
    }

    stopTheme() {
        this.isPlaying = false;
        if (this.masterGain && this.ctx) {
            const now = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
            this.masterGain.gain.linearRampToValueAtTime(0, now + 0.3);
        }
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        this.notifyUI();
    }

    scheduler() {
        if (!this.isPlaying || !this.ctx) return;

        while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
            this.scheduleStep(this.step, this.nextNoteTime);
            this.advanceStep();
        }
    }

    advanceStep() {
        const track = this.tracks[this.currentTrack];
        if (!track) return;

        // 16th note duration = (60 / BPM) / 4
        const secondsPerBeat = 60.0 / track.bpm;
        const stepTime = 0.25 * secondsPerBeat;
        this.nextNoteTime += stepTime;

        this.step = (this.step + 1) % track.steps;
    }

    scheduleStep(stepIndex, time) {
        const track = this.tracks[this.currentTrack];
        if (!track || !this.enabled) return;

        const secondsPerBeat = 60.0 / track.bpm;
        const stepDuration = 0.25 * secondsPerBeat;

        // 1. Lead Melody
        if (track.lead && track.lead[stepIndex]) {
            const note = track.lead[stepIndex];
            if (note !== 'REST' && this.notes[note]) {
                this.playSynthNote(this.notes[note], time, stepDuration * 0.9, track.leadType, 0.18);
            }
        }

        // 2. Bassline
        if (track.bass && track.bass[stepIndex]) {
            const note = track.bass[stepIndex];
            if (note !== 'REST' && this.notes[note]) {
                this.playSynthNote(this.notes[note], time, stepDuration * 1.2, track.bassType, 0.22);
            }
        }

        // 3. Arpeggio
        if (track.arp && track.arp[stepIndex]) {
            const note = track.arp[stepIndex];
            if (note !== 'REST' && this.notes[note]) {
                this.playSynthNote(this.notes[note], time, stepDuration * 0.6, track.arpType, 0.09);
            }
        }

        // 4. Percussão Chiptune
        if (track.drums && track.drums[stepIndex] !== undefined) {
            const drumType = track.drums[stepIndex];
            if (drumType === 1) {
                // Kick drum
                this.playKick(time);
            } else if (drumType === 2) {
                // Snare / Hi-hat
                this.playSnare(time);
            }
        }
    }

    playSynthNote(freq, time, duration, waveType = 'sine', noteGainVal = 0.15) {
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = waveType;
        osc.frequency.setValueAtTime(freq, time);

        noteGain.gain.setValueAtTime(0.001, time);
        noteGain.gain.linearRampToValueAtTime(noteGainVal, time + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(time);
        osc.stop(time + duration);
    }

    playKick(time) {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, time);
        osc.frequency.exponentialRampToValueAtTime(35, time + 0.08);

        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(time);
        osc.stop(time + 0.08);
    }

    playSnare(time) {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, time);
        osc.frequency.exponentialRampToValueAtTime(90, time + 0.05);

        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(time);
        osc.stop(time + 0.05);
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.enabled ? this.volume : 0, this.ctx.currentTime);
        }
        this.notifyUI();
    }

    toggleMusic() {
        this.enabled = !this.enabled;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.enabled ? this.volume : 0, this.ctx.currentTime);
        }
        if (this.enabled && !this.isPlaying && this.currentTrack) {
            this.playTheme(this.currentTrack);
        }
        this.notifyUI();
        return this.enabled;
    }

    notifyUI() {
        const musicIndicator = document.getElementById('hud-music-badge');
        if (musicIndicator) {
            musicIndicator.innerHTML = `
                <span class="music-icon ${this.enabled && this.isPlaying ? 'playing' : 'muted'}">🎵</span>
                <span class="music-name">${this.enabled ? this.currentTrackName : 'Mudo'}</span>
            `;
        }
    }
}

const sfx = new SoundEffects();
const musicManager = new MusicManager();

