import { useState, useEffect } from 'react'
import App from './App.jsx'
import AdminApp from './AdminApp.jsx'

// 해시 기반 초간단 라우팅: #/admin → 관리자, 그 외 → 메인
export default function Root() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return hash === '#/admin' ? <AdminApp /> : <App />
}
