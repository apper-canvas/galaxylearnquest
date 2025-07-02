import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import HomePage from '@/components/pages/HomePage'
import WorldMapPage from '@/components/pages/WorldMapPage'
import GameSelectionPage from '@/components/pages/GameSelectionPage'
import GamePlayPage from '@/components/pages/GamePlayPage'
import ProfilePage from '@/components/pages/ProfilePage'
import ParentDashboard from '@/components/pages/ParentDashboard'
import CreateProfilePage from '@/components/pages/CreateProfilePage'
import StoryBooksPage from '@/components/pages/StoryBooksPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
<Route index element={<HomePage />} />
          <Route path="world-map" element={<WorldMapPage />} />
          <Route path="world/:worldId/games" element={<GameSelectionPage />} />
          <Route path="game/:gameId" element={<GamePlayPage />} />
          <Route path="stories" element={<StoryBooksPage />} />
          <Route path="story/:storyId" element={<GamePlayPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="create-profile" element={<CreateProfilePage />} />
          <Route path="parent-dashboard" element={<ParentDashboard />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App