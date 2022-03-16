const state = {
  isMapFullScreen: false
};

const mutations = {
  SET_MAP_FULL: (state, isMapFullScreen) => {
    state.isMapFullScreen = isMapFullScreen;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
