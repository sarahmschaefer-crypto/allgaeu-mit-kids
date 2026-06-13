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

  if (status === 'sent') {
    return (
      <div className="lofi-card p-10 text-center space-y-4">
        <p className="text-4xl">✉️</p>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
          Nachricht gesendet!
        </h2>
        <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-soft)' }}>
          Danke — wir melden uns so schnell wie möglich.
        </p>
        <button
          onClick={() => { setStatus('idle'); setForm({ name: '', email: '', subject: '', message: '' }) }}
          className="btn btn--ghost mt-4"
        >
          Neue Nachricht
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="lofi-card p-8 space-y-5">
      <p className="label mb-2">Nachricht schreiben</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label field-label">Name *</label>
          <input required type="text" placeholder="Dein Name" className="field" {...field('name')} />
        </div>
        <div>
          <label className="label field-label">E-Mail *</label>
          <input required type="email" placeholder="deine@mail.de" className="field" {...field('email')} />
        </div>
      </div>

      <div>
        <label className="label field-label">Betreff</label>
        <select className="field" {...field('subject')}>
          <option value="">Bitte wählen …</option>
          <option value="tipp">Ausflugsziel vorschlagen</option>
          <option value="fehler">Fehler melden</option>
          <option value="kooperation">Kooperation</option>
          <option value="sonstiges">Sonstiges</option>
        </select>
      </div>

      <div>
        <label className="label field-label">Nachricht *</label>
        <textarea required rows={6} placeholder="Was möchtest du uns sagen?" className="field" {...field('message')} />
      </div>

      <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>
        Nachricht senden →
      </button>
    </form>
  )
}
