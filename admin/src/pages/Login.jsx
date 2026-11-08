/*
MİMARİ AÇIKLAMA
Login, panelin giriş kapısıdır. AdminLayout'un dışındadır. Sol menü
bu ekranda çizilmez. Form Firebase Auth'a e-posta ve şifre yollar.
Başarılı oturumda adres Dashboard'a döner.

GÜVENLİK NOTU
Şifre state'te durur ve gönderilince Firebase'e gider. Konsola,
adres çubuğuna ve yerel depoya yazılmaz. Hata metni, e-postanın
kayıtlı olup olmadığını ayırmaz. İkisi de "e-posta veya şifre
hatalı"dır. Ham Firebase mesajı ekrana basılmaz.

STATE YÖNETİMİ
E-posta, şifre, hata ve gönderim hali bu dosyanın useState'idir.
Oturumun kendisi AuthContext'tedir. Başarıda navigate adres çubuğunu
değiştirir. Form state'i sayfa değişince kalkar.
*/
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Navigate, useNavigate } from 'react-router-dom'
import { auth } from '../firebase.js'
import { useAuth } from '../context/auth-state.js'

function loginErrorMessage(code) {
  if (code === 'auth/invalid-email') return 'E-posta adresi geçersiz.'
  if (code === 'auth/too-many-requests') return 'Çok fazla deneme yapıldı. Bir süre sonra yeniden deneyin.'
  if (code === 'auth/network-request-failed') return 'Bağlantı kurulamadı. Yeniden deneyin.'
  if (
    code === 'auth/invalid-credential' ||
    code === 'auth/wrong-password' ||
    code === 'auth/user-not-found'
  ) {
    return 'E-posta veya şifre hatalı.'
  }
  return 'Giriş tamamlanamadı.'
}

export default function Login() {
  const navigate = useNavigate()
  const { currentUser, ready } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!ready) {
    return (
      <p className="grid min-h-screen place-items-center bg-primary text-sm text-white" role="status">
        Oturum kontrol ediliyor
      </p>
    )
  }

  if (currentUser) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(loginErrorMessage(err?.code))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-primary p-4">
      <section className="w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="h-1 bg-secondary" />
        <form className="flex flex-col gap-4 p-6" onSubmit={handleSubmit}>
          <div>
            <p className="text-xs font-semibold tracking-wide text-secondary">Ankara Üniversitesi</p>
            <h1 className="mt-1 text-xl font-semibold text-primary">Nallıhan MYO</h1>
            <p className="mt-1 text-sm text-slate-600">Yönetim paneli girişi</p>
          </div>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            E-posta
            <input
              type="email"
              name="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 rounded-md border border-slate-300 px-3 font-normal text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Şifre
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 rounded-md border border-slate-300 px-3 font-normal text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            />
          </label>
          {error ? (
            <p className="text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="h-11 rounded-md bg-primary text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:opacity-60"
          >
            {submitting ? 'Giriş yapılıyor' : 'Giriş Yap'}
          </button>
        </form>
      </section>
    </main>
  )
}
