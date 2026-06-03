// components/KontaktForm.tsx
'use client'
import { useState } from 'react'

type Status = 'idle' | 'sent'

export default function KontaktForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value })),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Placeholder: in production wire up to email service / form backend
    setStatus('sent')
  }

  const inputClass = "w-full border-2 border-ink bg-paper px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
  const labelClass = "label text-ink/60 text-[9px] block mb-1"

  if (status === 'sent') {
    return (
      <div className="lofi-card p-10 text-center space-y-4" style={{ boxShadow: '5px 5px 0 #B49139' }}>
        <p className="text-4xl">✉️</p>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-courier)' }}>
          Nachricht gesendet!
        </h2>
        <p className="text-sm" style={{ fontFamily: 'var(--font-lora)' }}>
          Danke — wir melden uns so schnell wie möglich.
        </p>
        <button
          onClick={() => { setStatus('idle'); setForm({ name: '', email: '', subject: '', message: '' }) }}
          className="lofi-btn lofi-btn-outline mt-4"
        >
          Neue Nachricht
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="lofi-card p-8 space-y-5"
    >
      <p className="label mb-2">Nachricht schreiben</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name *</label>
          <input
            required
            type="text"
            placeholder="Dein Name"
            className={inputClass}
            style={{ fontFamily: 'var(--font-lora)', boxShadow: '2px 2px 0 #1a1a1a' }}
            {...field('name')}
          />
        </div>
        <div>
          <label className={labelClass}>E-Mail *</label>
          <input
            required
            type="email"
            placeholder="deine@mail.de"
            className={inputClass}
            style={{ fontFamily: 'var(--font-lora)', boxShadow: '2px 2px 0 #1a1a1a' }}
            {...field('email')}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Betreff</label>
        <select
          className={inputClass}
          style={{ fontFamily: 'var(--font-source-code)', fontSize: '11px', boxShadow: '2px 2px 0 #1a1a1a' }}
          {...field('subject')}
        >
          <option value="">Bitte wählen …</option>
          <option value="tipp">Ausflugsziel vorschlagen</option>
          <option value="fehler">Fehler melden</option>
          <option value="kooperation">Kooperation</option>
          <option value="sonstiges">Sonstiges</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Nachricht *</label>
        <textarea
          required
          rows={6}
          placeholder="Was möchtest du uns sagen?"
          className={`${inputClass} resize-none`}
          style={{ fontFamily: 'var(--font-lora)', boxShadow: '2px 2px 0 #1a1a1a' }}
          {...field('message')}
        />
      </div>

      <button type="submit" className="lofi-btn w-full justify-center">
        Nachricht senden →
      </button>
    </form>
  )
}
