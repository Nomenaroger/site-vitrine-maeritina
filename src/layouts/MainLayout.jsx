import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import { MessageCircle } from 'lucide-react'
import { buildWhatsAppUrl } from '../config/urlConfig'

export default function MainLayout({ children }) {
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin')) return <>{children}</>
  return <>
    <ScrollToTop />
    <Navbar />
    <main>{children}</main>
    <Footer />
    <a className="whatsapp-float" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer" aria-label="Contacter Maeritina sur WhatsApp"><MessageCircle size={25}/></a>
  </>
}
