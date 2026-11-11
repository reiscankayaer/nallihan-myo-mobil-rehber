/*
MİMARİ AÇIKLAMA
Ulaşım sayfası, /ulasim adresindedir. EGO 677 ve ÖTA 577-3 için
iki ayrı kart vardır. Kayıt, transportation koleksiyonundaki
ego677 ve ota577 belgelerinin tamamını setDoc ile yazar. Eski
alanlar belgede kalmaz. Fiyat ve saat personelin girdiği metindir.
Bu sayfa tarife uydurmaz.

REAL-TIME VERİ YÖNETİMİ
Her belge onSnapshot ile dinlenir. Başka bir oturum kaydı değiştirirse
form, personel yazmaya başlamamışsa yeni metni alır. Yazmaya
başlayınca gelen görüntü taslağın üstüne yazılmaz. Kaydet bitince
taslak temiz sayılır ve dinleyici son hali gösterir. Başarı yazısı
kartın kendi state'idir.
*/
import { useEffect, useRef, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase.js'

const FIELD =
  'h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500'

const LINES = [
  { id: 'ego677', title: 'EGO 677' },
  { id: 'ota577', title: 'ÖTA 577-3' },
]

function todayInput() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function emptyLine() {
  return { fiyat: '', saatler: '', sonGuncelleme: todayInput() }
}

function fromDocument(data) {
  if (!data) return emptyLine()
  return {
    fiyat: data.fiyat || '',
    saatler: data.saatler || '',
    sonGuncelleme: data.sonGuncelleme || todayInput(),
  }
}

function writeError(code) {
  if (code === 'permission-denied') return 'Firestore yazmayı reddetti. Kural, bu oturuma izin vermiyor.'
  if (code === 'unavailable') return 'Bağlantı kurulamadı. Yeniden deneyin.'
  return 'Kayıt tamamlanamadı.'
}

function LineCard({ id, title }) {
  const [form, setForm] = useState(emptyLine)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const dirtyRef = useRef(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'transportation', id),
      (snapshot) => {
        if (dirtyRef.current) return
        setForm(fromDocument(snapshot.data()))
      },
      () => setError('Hat kaydı okunamadı.'),
    )
    return unsubscribe
  }, [id])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 4000)
    return () => window.clearTimeout(timer)
  }, [notice])

  function setField(key, value) {
    dirtyRef.current = true
    setError('')
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const fiyat = form.fiyat.trim()
    const saatler = form.saatler.trim()
    const sonGuncelleme = form.sonGuncelleme
    if (!fiyat && !saatler) {
      setError('Fiyat veya kalkış saati girin. Boş kayıt eskisinin üstüne yazılmaz.')
      return
    }
    if (!sonGuncelleme) {
      setError('Son güncelleme tarihi zorunludur.')
      return
    }
    const kalkisSaatleri = saatler
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
    setSaving(true)
    try {
      await setDoc(doc(db, 'transportation', id), {
        hat: title,
        fiyat: fiyat.slice(0, 40),
        saatler: saatler.slice(0, 300),
        kalkisSaatleri,
        sonGuncelleme,
      })
      dirtyRef.current = false
      setNotice('Başarıyla Güncellendi')
      setError('')
    } catch (err) {
      setError(writeError(err?.code))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <h2 className="bg-primary px-4 py-3 text-base font-semibold text-white">{title}</h2>
      <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Güncel bilet fiyatı
          <input
            className={FIELD}
            value={form.fiyat}
            maxLength={40}
            onChange={(event) => setField('fiyat', event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Kalkış saatleri (virgülle ayrılmış)
          <input
            className={FIELD}
            value={form.saatler}
            maxLength={300}
            placeholder="07:30, 12:00, 17:30"
            onChange={(event) => setField('saatler', event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Son güncelleme tarihi
          <input
            className={FIELD}
            type="date"
            value={form.sonGuncelleme}
            required
            onChange={(event) => setField('sonGuncelleme', event.target.value)}
          />
        </label>
        {error ? (
          <p className="text-sm font-medium text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-800" role="status">
            {notice}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={saving}
          className="h-11 rounded-md bg-primary text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
        >
          {saving ? 'Kaydediliyor' : 'Kaydet / Güncelle'}
        </button>
      </form>
    </section>
  )
}

export default function Ulasim() {
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold text-primary">Ulaşım ve fiyatlar</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        {LINES.map((line) => (
          <LineCard key={line.id} id={line.id} title={line.title} />
        ))}
      </div>
    </div>
  )
}
