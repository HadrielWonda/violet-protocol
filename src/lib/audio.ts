/**
 * Procedural audio engine — no binary assets required.
 * -----------------------------------------------------------------------------
 * A soft ambient pad (slowly-evolving detuned oscillators through a low-pass
 * filter) plus a handful of synthesised UI sound effects. Everything is
 * generated with the Web Audio API so the whole experience stays self-contained
 * and loads instantly. Safe to call before the context is unlocked — it simply
 * no-ops until the first user gesture resumes audio.
 */

type Sfx = 'decrypt' | 'type' | 'beep' | 'unlock' | 'success' | 'crack'

class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private padGain: GainNode | null = null
  private padVoices: OscillatorNode[] = []
  private started = false
  private muted = false
  private emotional = false

  private ensure(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      if (!Ctor) return null
      try {
        this.ctx = new Ctor()
        this.master = this.ctx.createGain()
        this.master.gain.value = this.muted ? 0 : 0.9
        this.master.connect(this.ctx.destination)
      } catch {
        return null
      }
    }
    return this.ctx
  }

  /** Call from a user gesture. Resumes the context and starts the ambient pad. */
  async start() {
    const ctx = this.ensure()
    if (!ctx || !this.master) return
    try {
      if (ctx.state === 'suspended') await ctx.resume()
    } catch {
      /* ignore */
    }
    if (this.started) return
    this.started = true

    const pad = ctx.createGain()
    pad.gain.value = 0
    pad.connect(this.master)
    this.padGain = pad

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 700
    filter.Q.value = 0.6
    filter.connect(pad)

    // Slow filter sweep for a breathing texture.
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.05
    lfoGain.gain.value = 260
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)
    lfo.start()

    // A gentle A-minor-ish pad.
    const freqs = [110, 164.81, 220, 329.63]
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator()
      osc.type = i % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.value = f
      osc.detune.value = (i - 1.5) * 6
      const g = ctx.createGain()
      g.gain.value = i === 0 ? 0.5 : 0.22
      osc.connect(g)
      g.connect(filter)
      osc.start()
      this.padVoices.push(osc)
    })

    // Fade the pad in very gently.
    const now = ctx.currentTime
    pad.gain.cancelScheduledValues(now)
    pad.gain.setValueAtTime(0, now)
    pad.gain.linearRampToValueAtTime(this.muted ? 0 : 0.12, now + 4)
  }

  setMuted(muted: boolean) {
    this.muted = muted
    const ctx = this.ctx
    if (!ctx || !this.master) return
    const now = ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.linearRampToValueAtTime(muted ? 0 : 0.9, now + 0.4)
  }

  /** Toward the ending, open the pad up so it feels warmer and fuller. */
  setEmotional(on: boolean) {
    if (this.emotional === on) return
    this.emotional = on
    const ctx = this.ctx
    if (!ctx || !this.padGain) return
    const now = ctx.currentTime
    this.padGain.gain.cancelScheduledValues(now)
    this.padGain.gain.linearRampToValueAtTime(
      this.muted ? 0 : on ? 0.2 : 0.12,
      now + 3
    )
  }

  private blip(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gain = 0.15,
    slideTo?: number
  ) {
    const ctx = this.ctx
    if (!ctx || !this.master || this.muted) return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = type
    const now = ctx.currentTime
    osc.frequency.setValueAtTime(freq, now)
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(gain, now + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    osc.connect(g)
    g.connect(this.master)
    osc.start(now)
    osc.stop(now + duration + 0.02)
  }

  private noise(duration: number, gain = 0.08, hp = 800) {
    const ctx = this.ctx
    if (!ctx || !this.master || this.muted) return
    const frames = Math.floor(ctx.sampleRate * duration)
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames)
    const src = ctx.createBufferSource()
    src.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = hp
    const g = ctx.createGain()
    g.gain.value = gain
    src.connect(filter)
    filter.connect(g)
    g.connect(this.master)
    src.start()
  }

  play(sfx: Sfx) {
    if (this.muted) return
    void this.ensure()
    switch (sfx) {
      case 'type':
        this.blip(420 + Math.random() * 220, 0.03, 'square', 0.04)
        break
      case 'beep':
        this.blip(880, 0.09, 'sine', 0.09)
        break
      case 'decrypt':
        this.noise(0.18, 0.05, 1200)
        this.blip(300, 0.18, 'sawtooth', 0.05, 620)
        break
      case 'crack':
        this.noise(0.35, 0.14, 500)
        this.blip(160, 0.4, 'sawtooth', 0.12, 60)
        break
      case 'unlock':
        this.blip(523.25, 0.12, 'sine', 0.12)
        window.setTimeout(() => this.blip(783.99, 0.18, 'sine', 0.12), 90)
        break
      case 'success':
        ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
          window.setTimeout(() => this.blip(f, 0.35, 'sine', 0.11), i * 110)
        )
        break
    }
  }
}

export const audio = new AudioEngine()
