const state = {
  progressCount: 0,
  progress: 0,
  progressAll: 0,
  updateTime: '',
  mining: true,
  disableMiningBtn: true,
  progressVal: true,
  selectedWallet: ''
}

const mutations = {
  updateProgressAll: (state, progressAll) => {
    state.progressAll = (Number(progressAll) / (1024*1024*1024)).toFixed(2)
  },
  updateProgress: (state) => {
    state.progress = Number(state.progress) + Number(state.progressAll) / 5
  },
  updateProgressCount: (state) => {
    state.progressCount = (state.progress / Number(state.progressAll)) * 100
  },
  setProgressFinish: (state) => {
    state.progressCount = 100
    state.progress = state.progressAll
    state.updateTime = new Date().toString()
    // state.disableMiningBtn = false
  },
  setMiningBtn: (state, isDisable) => {
    state.disableMiningBtn = isDisable
  },
  setMining: (state, isActive) => {
    state.mining = isActive
  },
  setSelectedWallet: (state, walletAddress) => {
    state.selectedWallet = walletAddress
  },
  resetProgressValue: (state) => {
    state.progressCount = 0
    state.progress = 0
    state.progressAll = 0
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

export default {
  state,
  mutations,
  actions
}
