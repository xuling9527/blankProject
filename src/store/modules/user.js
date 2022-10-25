import Cookies from "js-cookie";
import { login, logout, getUserInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false,
  },
  logourl: "https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png", // 显示菜单栏上logo地址
  sidebartitle: "Vue Element Admin", // logo旁的文字
  sidebarLogo: true, // 显示菜单栏上logo
  device: 'desktop', // 窗口大小适应
  size: Cookies.get('size') || 'medium', // 窗口大小适应
  token: getToken(),
  name: "",
  avatar: "",
  introduction: "",
  roles: [],
  fixedHeader: true, // tag固定顶部
  tagsView: true, // 显示tag
};

const mutations = {
  // 用户基本信息
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    // 用户名
    state.name = name;
  },
  SET_USERID: (state, userId) => {
    // 用户id
    state.userId = userId;
  },
  SET_MENUS: (state, menus) => {
    // 用户展示的菜单
    state.menus = menus;
  },
  // 用户基本信息end
  // 菜单栏上logo
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set("sidebarStatus", 1);
    } else {
      Cookies.set("sidebarStatus", 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set("sidebarStatus", 0);
    state.sidebar.opened = false;
    console.log(withoutAnimation)
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  // 菜单栏上logo end
  SET_SIZE: (state, size) => { // 窗口大小适应
    state.size = size
    Cookies.set('size', size)
  },
  TOGGLE_DEVICE: (state, device) => { // 窗口大小适应
    state.device = device
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) { // 登录
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          const { data } = response;
          commit("SET_TOKEN", data.taken);
          setToken(data.taken);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getUserInfo({ commit, state }) { // 获取用户信息
    return new Promise((resolve, reject) => {
      getUserInfo()
        .then((response) => {
          const { data } = response;
          commit("SET_NAME", data.username);
          commit("SET_USERID", data.userid);
          commit("SET_MENUS", data.menus);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state, dispatch }) { // 退出登录
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          removeToken();
          resetRouter();
          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch("tagsView/delAllViews", null, { root: true });
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },

  toggleSideBar({ commit }) { // SideBar不同窗口展示样式
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) { // SideBar不同窗口展示样式
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  setSize({ commit }, size) { // 窗口大小适应
    commit('SET_SIZE', size)
  },
  toggleDevice({ commit }, device) { // 窗口大小适应
    commit('TOGGLE_DEVICE', device)
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
