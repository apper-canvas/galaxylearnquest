import { dailyGoals } from '@/services/mockData/dailyGoals.json'

let goalsData = [...dailyGoals]

const delay = () => new Promise(resolve => setTimeout(resolve, 250))

export const dailyGoalService = {
  async getTodaysGoal(profileId) {
    await delay()
    const today = new Date().toISOString().split('T')[0]
    return goalsData.find(goal => 
      goal.profileId === parseInt(profileId) && 
      goal.date.startsWith(today)
    )
  },

  async updateGoalProgress(profileId, minutesPlayed, gameId, skillsPracticed) {
    await delay()
    const today = new Date().toISOString().split('T')[0]
    let todaysGoal = goalsData.find(goal => 
      goal.profileId === parseInt(profileId) && 
      goal.date.startsWith(today)
    )

    if (!todaysGoal) {
      todaysGoal = {
        Id: Math.max(...goalsData.map(g => g.Id), 0) + 1,
        profileId: parseInt(profileId),
        date: new Date().toISOString(),
        targetMinutes: 20,
        completedMinutes: 0,
        gamesPlayed: [],
        skillsPracticed: []
      }
      goalsData.push(todaysGoal)
    }

    todaysGoal.completedMinutes = Math.min(todaysGoal.completedMinutes + minutesPlayed, todaysGoal.targetMinutes)
    
    if (!todaysGoal.gamesPlayed.includes(gameId)) {
      todaysGoal.gamesPlayed.push(gameId)
    }

    skillsPracticed.forEach(skill => {
      if (!todaysGoal.skillsPracticed.includes(skill)) {
        todaysGoal.skillsPracticed.push(skill)
      }
    })

    return todaysGoal
  }
}