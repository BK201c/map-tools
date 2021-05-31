const state = {
  sidebar: "",
  size: "",
  device: "",
  zipPath: ""
};

const mutations = {
  SET_ZIP_PATH: (state, zipPath) => {
    state.zipPath = zipPath;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
