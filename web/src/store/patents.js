import httpClient from '@/utils/httpClient';
import logger from '@/utils/logger';

const GET_PATENT_COLLECTION_STARTED = 'GET_PATENT_COLLECTION_STARTED';
const GET_PATENT_COLLECTION_COMPLETED = 'GET_PATENT_COLLECTION_COMPLETED';
const GET_PATENT_COLLECTION_FAILED = 'GET_PATENT_COLLECTION_FAILED';

export default {
  namespaced: true,
  state: {
    isRequestPending: false,
    isRequestFailed: false,
    collection: []
  },
  mutations: {
    [GET_PATENT_COLLECTION_STARTED](state) {
      state.isRequestPending = true;
      state.isRequestFailed = false;
      state.collection = [];
    },
    [GET_PATENT_COLLECTION_FAILED](state) {
      state.isRequestPending = false;
      state.isRequestFailed = true;
    },
    [GET_PATENT_COLLECTION_COMPLETED](state, collection) {
      state.collection = collection;
      state.isRequestPending = false;
    }
  },
  actions: {
    async getCollection({ commit }, { keywords }) {
      commit(GET_PATENT_COLLECTION_STARTED);
      try {
        const collection = await httpClient.get(`${process.env.VUE_APP_API_URL}/patents?s=${keywords.join(',')}`);
        commit(GET_PATENT_COLLECTION_COMPLETED, collection);
      } catch (e) {
        logger.error(e);
        commit(GET_PATENT_COLLECTION_FAILED);
      }
    }
  }
};
