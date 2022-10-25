const getters = {
  name: state => state.user.name,
  menus: state => state.user.menus,

  sidebar: state => state.user.sidebar,
  // language: state => state.app.language,
  // size: state => state.app.size,
  device: state => state.user.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  // permission_routes: state => state.permission.routes,
  // errorLogs: state => state.errorLog.logs
}
export default getters
