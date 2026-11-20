import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Services from '../pages/Services'
import ProductDetail from '../pages/ProductDetail'
import Projects from '../pages/Projects'
import News from '../pages/News'
import Contact from '../pages/Contact'
import NotFound from '../pages/NotFound'
import AdminLayout from '../components/admin/AdminLayout'
import AdminLogin from '../pages/admin/AdminLogin'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminProducts from '../pages/admin/AdminProducts'
import AdminAccount from '../pages/admin/AdminAccount'

export default function AppRoutes(){return <Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/a-propos" element={<About/>}/>
  <Route path="/services" element={<Services/>}/>
  <Route path="/produit/:id" element={<ProductDetail/>}/>
  <Route path="/realisations" element={<Projects/>}/>
  <Route path="/actualites" element={<News/>}/>
  <Route path="/contact" element={<Contact/>}/>
  <Route path="/admin/login" element={<AdminLogin/>}/>
  <Route path="/admin" element={<AdminLayout><AdminDashboard/></AdminLayout>}/>
  <Route path="/admin/products" element={<AdminLayout><AdminProducts/></AdminLayout>}/>
  <Route path="/admin/account" element={<AdminLayout><AdminAccount/></AdminLayout>}/>
  <Route path="*" element={<NotFound/>}/>
</Routes>}
