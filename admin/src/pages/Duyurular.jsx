/*
MİMARİ AÇIKLAMA
Duyurular sayfası, /duyurular adresindedir. Sol kart yeni kayıt
yazar. Sağ kart duyurular koleksiyonunu listeler. Alanlar başlık,
özet ve okul linkidir. Belge açılınca yayında sayılır ve hedefi
herkestir. Link boş kalabilir. Doluysa yalnızca http veya https
adresi yazılır.

REAL-TIME VERİ YÖNETİMİ
Liste onSnapshot ile dinlenir. Ekleme ve silme, sayfa yenilenmeden
sağ karta düşer. Dinleyici kalkınca abonelik bırakılır. Kayıt
addDoc ile eklenir. Silme deleteDoc ile tek belgeyi kaldırır.
Başarı yazısı bu dosyanın state'idir. Dört saniye sonra kalkar.
*/
import { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase.js'

const FIELD =
  'h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
const EMPTY = { baslik: '', ozet: '', link: '' }

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

function whenLabel(item) {
  if (item.yayinTarihi?.toDate) return item.yayinTarihi.toDate().toLocaleString('tr-TR')
  if (typeof item.createdAtMs === 'number') return new Date(item.createdAtMs).toLocaleString('tr-TR')
  return ''
}

export default function Duyurular() {
  const [form, setForm] = useState(EMPTY)
  const [items, setItems] = useState([])
  const [loadError, setLoadError] = useState('')
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState('')

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'duyurular'),
      (snapshot) => {
        const next = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
        next.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0))
        setItems(next)
        setLoadError('')
      },
      () => setLoadError('Duyuru listesi okunamadı.'),
    )
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 4000)
    return () => window.clearTimeout(timer)
  }, [notice])

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const baslik = form.baslik.trim()
    const ozet = form.ozet.trim()
    const link = httpUrl(form.link)
    if (!baslik || !ozet) {
      setFormError('Başlık ve içerik özeti zorunludur.')
      return
    }
    if (link === null) {
      setFormError('Link boş kalabilir. Doluysa http veya https adresi olmalıdır.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      await addDoc(collection(db, 'duyurular'), {
        baslik: baslik.slice(0, 140),
        ozet: ozet.slice(0, 600),
        govde: ozet.slice(0, 600),
        link,
        hedef: 'herkes',
        yayinda: true,
        yayinTarihi: new Date(),
        createdAtMs: Date.now(),
      })
      setForm(EMPTY)
      setNotice('Başarıyla Güncellendi')
    } catch (error) {
      setFormError(writeError(error?.code))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (pendingDelete !== id) {
      setPendingDelete(id)
      return
    }
    setPendingDelete('')
    try {
      await deleteDoc(doc(db, 'duyurular', id))
      setNotice('Duyuru silindi')
    } catch (error) {
      setFormError(writeError(error?.code))
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <h1 className="bg-primary px-4 py-3 text-base font-semibold text-white">Yeni duyuru ekle</h1>
        <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Başlık
            <input
              className={FIELD}
              value={form.baslik}
              maxLength={140}
              required
              onChange={(event) => setField('baslik', event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            İçerik özeti
            <textarea
              className={`${FIELD} min-h-28 py-2`}
              value={form.ozet}
              maxLength={600}
              required
              onChange={(event) => setField('ozet', event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Orijinal okul linki
            <input
              className={FIELD}
              type="url"
              inputMode="url"
              placeholder="https://nallihanmyo.ankara.edu.tr/"
              value={form.link}
              maxLength={500}
              onChange={(event) => setField('link', event.target.value)}
            />
          </label>
          {formError ? (
            <p className="text-sm font-medium text-red-700" role="alert">
              {formError}
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
            {saving ? 'Kaydediliyor' : 'Duyuruyu kaydet'}
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <h2 className="bg-primary px-4 py-3 text-base font-semibold text-white">Aktif duyurular</h2>
        <div className="flex flex-col gap-3 p-4">
          {loadError ? (
            <p className="text-sm font-medium text-red-700" role="alert">
              {loadError}
            </p>
          ) : null}
          {items.length === 0 && !loadError ? (
            <p className="text-sm text-slate-600">Henüz duyuru yok.</p>
          ) : null}
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-primary">{item.baslik}</p>
                    <p className="mt-1 text-sm text-slate-700">{item.ozet || item.govde}</p>
                    {httpUrl(item.link || '') ? (
                      <a
                        className="mt-2 block truncate text-sm text-primary underline"
                        href={httpUrl(item.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.link}
                      </a>
                    ) : null}
                    {whenLabel(item) ? (
                      <p className="mt-2 text-xs text-slate-500">{whenLabel(item)}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="h-11 shrink-0 rounded-md bg-red-700 px-3 text-sm font-semibold text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => handleDelete(item.id)}
                  >
                    {pendingDelete === item.id ? 'Silmeyi onayla' : 'Sil'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
