import httpClient from '@/utils/httpClient';
import logger from '@/utils/logger';

const GET_PATENT_BY_ID_STARTED = 'GET_PATENT_BY_ID_STARTED';
const GET_PATENT_BY_ID_COMPLETED = 'GET_PATENT_BY_ID_COMPLETED';
const GET_PATENT_BY_ID_FAILED = 'GET_PATENT_BY_ID_FAILED';

export default {
  namespaced: true,
  state: {
    id: null,
    title: null,
    text: null,
    images: null,

    isRequestPending: false,
    isRequestFailed: false
  },

  mutations: {
    [GET_PATENT_BY_ID_STARTED](state) {
      state.id = null;
      state.title = null;
      state.text = null;
      state.images = null;

      state.isRequestPending = true;
      state.isRequestFailed = false;
    },
    [GET_PATENT_BY_ID_FAILED](state) {
      state.isRequestPending = false;
      state.isRequestFailed = true;
    },
    [GET_PATENT_BY_ID_COMPLETED](state, patent) {
      state.isRequestPending = false;
      state.id = patent.id;
      state.title = patent.title;
      state.text = patent.text;
      state.images = patent.images;
    }
  },
  actions: {
    async getById({ commit }, { id }) {
      commit(GET_PATENT_BY_ID_STARTED);
      try {
        const patent = await httpClient.get(`${process.env.VUE_APP_API_URL}/patents/${id}`);

        commit(GET_PATENT_BY_ID_COMPLETED, patent);
      } catch (e) {
        logger.error(e);
        commit(GET_PATENT_BY_ID_FAILED);
      }
    }
  }
};
