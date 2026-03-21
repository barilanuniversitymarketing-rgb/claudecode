import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import WalletPage from './pages/WalletPage'
import AddCardPage from './pages/AddCardPage'
import CardDetailPage from './pages/CardDetailPage'
import ActivityPage from './pages/ActivityPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<WalletPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="add" element={<AddCardPage />} />
        <Route path="card/:id" element={<CardDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
