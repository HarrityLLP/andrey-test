import Vue from 'vue';
import Vuex from 'vuex';
import patents from './patents';
import patent from './patent';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { patents, patent },
  state: {},
  mutations: {},
  actions: {}
});
