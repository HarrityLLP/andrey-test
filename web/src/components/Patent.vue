<template>
  <section v-if="isRequestPending"></section>
  <section v-else class="patent-wrapper">
    <div class="back-wrapper">
      <a @click="$router.go(-1)">&lt; Back</a>
    </div>
    <form @submit.prevent>
      <label>Keywords:</label>
      <input type="text" v-model="searchTerm" />
    </form>
    <h1>{{ title }}</h1>
    <ul class="patent-image-list">
      <li v-for="image of images" :key="image" class="patent-image-list-item">
        <img :src="`/${image}`" class="patent-image" />
      </li>
    </ul>
    <article>
      <highlighted-text :text="text" :keywords="keywords" />
    </article>
  </section>
</template>

<script>
import { mapState } from 'vuex';

import HighlightedText from './HighlightedText';
import { getKeywordsFromSearchTerm } from './getKeywordsFromSearchTerm';

export default {
  name: 'patent',
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
      title: state => state.patent.title,
      text: state => state.patent.text,
      images: state => state.patent.images,
      isRequestPending: state => state.patent.isRequestPending
    }),
    keywords() {
      return getKeywordsFromSearchTerm(this.searchTerm);
    }
  },
  created() {
    this.$store.dispatch('patent/getById', { id: this.$route.params.id });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.patent-wrapper {
  width: 800px;
  margin: auto;
}

.back-wrapper {
  text-align: left;
  margin-bottom: 25px;
}

h1 {
  margin-bottom: 50px;
}

form {
  width: 100%;
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: 10px;
  margin: 0 auto 25px auto;
  width: 600px;
}

article {
  white-space: pre-wrap;
}

.patent-image-list {
  list-style: none;
  margin: 0 0 25px 0;
  padding: 0;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
.patent-image {
  max-width: 200px;
  max-height: 200px;
}
</style>
