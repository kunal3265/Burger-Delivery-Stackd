import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useEffect } from 'react'
import { BrowserRouter, HashRouter, Route, Routes, useLocation } from 'react-router'

import { BagDrawer, Footer, Nav } from './components/Layout'
import { ToastProvider } from './components/Overlay'
import { StoreProvider } from './lib/store'
import { BuildPage } from './pages/Build'
import { CateringPage } from './pages/Catering'
import { Checkout } from './pages/Checkout'
import { Home } from './pages/Home'
import { LocationsPage } from './pages/Locations'
import { MenuPage } from './pages/Menu'
import { NotFound } from './pages/NotFound'
import { OrderTracking, Orders } from './pages/Orders'
import { RewardsPage } from './pages/Rewards'
import { Styleguide } from './pages/Styleguide'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

function Pages() {
  const location = useLocation()
  return (
    // No `initial={false}`: it suppressed every entry animation on first load,
    // including the hero letters, so they only played when arriving from another page.
    <AnimatePresence mode="wait">
      <motion.main id="main" tabIndex={-1} key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="min-h-[70vh] outline-none">
        <Routes location={location}>
          <Route index element={<Home />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="build" element={<BuildPage />} />
          <Route path="locations" element={<LocationsPage />} />
          <Route path="rewards" element={<RewardsPage />} />
          <Route path="catering" element={<CateringPage />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:reference" element={<OrderTracking />} />
          <Route path="styleguide" element={<Styleguide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  )
}

// Opened straight from disk, history URLs cannot resolve, so routes become #/menu etc.
const Router = typeof window !== 'undefined' && window.location.protocol === 'file:' ? HashRouter : BrowserRouter

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <StoreProvider>
          <ToastProvider>
            <ScrollToTop />
            <Nav />
            <Pages />
            <Footer />
            <BagDrawer />
          </ToastProvider>
        </StoreProvider>
      </Router>
    </MotionConfig>
  )
}
