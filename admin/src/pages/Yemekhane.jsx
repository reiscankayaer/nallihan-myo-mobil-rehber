/*
MİMARİ AÇIKLAMA
Yemekhane sayfası, /yemekhane adresindedir. Tek kart, dining
koleksiyonundaki info belgesini tutar. Alanlar aylık menü PDF
linki ve güncel yemek ücretidir. Kayıt setDoc ile belgenin
tamamını yazar. Ücret, personelin yazdığı metindir. Sayfa bir
ücret uydurmaz. Link boş kalabilir. Doluysa http veya https olur.

REAL-TIME VERİ YÖNETİMİ
info belgesi onSnapshot ile dinlenir. Personel yazmaya başlamadan
gelen kayıt forma oturur. Yazarken gelen görüntü taslağı silmez.
Kaydet bitince dinleyici son belgeyi yeniden gösterebilir. Başarı
yazısı bu dosyanın state'idir ve dört saniye durur.
*/
import { useEffect, useRef, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase.js'

const FIELD =
  'h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
const EMPTY = { menuLinki: '', ucret: '' }

function httpUrl(value) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.toString()
  } catch {
    return null
  }
}

function writeError(code) {
  if (code === 'permission-denied') return 'Firestore yazmayı reddetti. Kural, bu oturuma izin vermiyor.'
  if (code === 'unavailable') return 'Bağlantı kurulamadı. Yeniden deneyin.'
  return 'Kayıt tamamlanamadı.'
}

export default function Yemekhane() {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const dirtyRef = useRef(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'dining', 'info'),
      (snapshot) => {
        if (dirtyRef.current) return
        const data = snapshot.data()
        setForm({
          menuLinki: data?.menuLinki || '',
          ucret: data?.ucret || '',
        })
      },
      () => setError('Yemekhane kaydı okunamadı.'),
    )
    return unsubscribe
  }, [])

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
    const ucret = form.ucret.trim()
    const menuLinki = httpUrl(form.menuLinki)
    if (!ucret && !form.menuLinki.trim()) {
      setError('Ücret veya menü linki girin. Boş kayıt eskisinin üstüne yazılmaz.')
      return
    }
    if (menuLinki === null) {
      setError('Menü linki boş kalabilir. Doluysa http veya https adresi olmalıdır.')
      return
    }
    setSaving(true)
    try {
      await setDoc(doc(db, 'dining', 'info'), {
        menuLinki,
        ucret: ucret.slice(0, 40),
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
    <section className="max-w-xl overflow-hidden rounded-lg border border-slate-200 bg-white">
      <h1 className="bg-primary px-4 py-3 text-base font-semibold text-white">Yemekhane</h1>
      <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Aylık menü PDF linki
          <input
            className={FIELD}
            type="url"
            inputMode="url"
            placeholder="https://"
            value={form.menuLinki}
            maxLength={500}
            onChange={(event) => setField('menuLinki', event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Güncel yemek ücreti
          <input
            className={FIELD}
            value={form.ucret}
            maxLength={40}
            onChange={(event) => setField('ucret', event.target.value)}
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
