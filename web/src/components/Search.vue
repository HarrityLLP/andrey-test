<template>
  <div class="search-wrapper">
    <h1>Patent search</h1>

    <form @submit.prevent="search">
      <input type="text" v-model="searchTerm" />
      <button :disabled="!isSearchTermValid || isRequestPending">Search</button>
    </form>

    <ul v-if="collection && collection.length" class="search-result-list">
      <li v-for="item of collection" :key="item.id" class="search-result-list-item">
        <router-link :to="{ path: `/patents/${item.id}`, query: $route.query }">{{ item.title }}</router-link>

        <img :src="item.logo" alt="" />
        <highlighted-text :text="item.summary" :keywords="keywords"></highlighted-text>
      </li>
    </ul>
    <div v-else-if="searchTerm && searchTerm.length">
      <i>Nothing matches a specified search criteria.</i>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import HighlightedText from './HighlightedText';

import { getKeywordsFromSearchTerm } from './getKeywordsFromSearchTerm';

export default {
  name: 'patent-search',
  components: {
    HighlightedText
  },
  data() {
    return {
      searchTerm: this.$route.query.search
    };
  },
  computed: {
    ...mapState({
      collection: state => state.patents.collection,
      isRequestPending: state => state.patents.isRequestPending
    }),
    isSearchTermValid() {
      return this.searchTerm && this.searchTerm.length;
    },
    keywords() {
      return getKeywordsFromSearchTerm(this.$route.query.search);
    }
  },
  methods: {
    search() {
      if (!this.isSearchTermValid) {
        return;
      }

      this.$router.push({
        path: '/',
        query: { search: this.searchTerm }
      });
    },
    async initialize() {
      if (!this.keywords || !this.keywords.length) {
        return;
      }

      await this.$store.dispatch('patents/getCollection', {
        keywords: this.keywords
      });
    }
  },
  watch: {
    $route() {
      this.initialize();
    }
  },
  created() {
    this.initialize();
  }
};
</script>

<style scoped lang="scss">
.search-wrapper {
  width: 400px;
  margin: auto;
}
h1 {
  margin-bottom: 50px;
}

form {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-gap: 10px;
  margin-bottom: 25px;
}
.search-result-list {
  list-style-type: none;
  padding: 0;
}
.search-result-list-item {
  display: grid;
  grid-template-rows: max-content max-content;
  grid-template-columns: 100px 1fr;
  grid-gap: 10px;
  justify-content: start;

  &:not(:last-child) {
    margin-bottom: 25px;
  }

  a {
    grid-column: 1/3;
  }

  img {
    max-width: 100px;
    max-height: 100px;
    justify-self: center;
  }
}
</style>
