const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  zipPath: state => state.app.zipPath,
  isMapFullScreen: state => state.app.isMapFullScreen
};
export default getters;
