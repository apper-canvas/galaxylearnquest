import { profiles } from '@/services/mockData/profiles.json'

let profilesData = [...profiles]

const delay = () => new Promise(resolve => setTimeout(resolve, 300))

export const profileService = {
  async getAll() {
    await delay()
    return [...profilesData]
  },

  async getById(id) {
    await delay()
    return profilesData.find(profile => profile.Id === parseInt(id))
  },

  async create(profileData) {
    await delay()
    const newId = Math.max(...profilesData.map(p => p.Id), 0) + 1
    const newProfile = {
      Id: newId,
      ...profileData,
      totalStars: 0,
      totalCoins: 0,
      dailyGoalProgress: 0,
      achievements: [],
      createdAt: new Date().toISOString()
    }
    profilesData.push(newProfile)
    return newProfile
  },

  async update(id, updates) {
    await delay()
    const index = profilesData.findIndex(profile => profile.Id === parseInt(id))
    if (index !== -1) {
      profilesData[index] = { ...profilesData[index], ...updates }
      return profilesData[index]
    }
    throw new Error('Profile not found')
  },

  async delete(id) {
    await delay()
    const index = profilesData.findIndex(profile => profile.Id === parseInt(id))
    if (index !== -1) {
      const deleted = profilesData.splice(index, 1)[0]
      return deleted
    }
    throw new Error('Profile not found')
  }
}