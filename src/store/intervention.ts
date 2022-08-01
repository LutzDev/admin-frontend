import { acceptHMRUpdate, defineStore } from 'pinia'

export const useInterventionStore = defineStore('intervention', {
  state: () => ({
    counter: 0,
    name: 'Lutz',
  }),
  getters: {
    doubleCount: (state) => {
      state.counter++
    },
  },
  actions: {
    reset() {
      this.counter = 0
    },
    addOne() {
      this.counter++
    },
  },
})

