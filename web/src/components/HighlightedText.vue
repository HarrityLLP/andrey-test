<template>
  <span v-html="html"></span>
</template>

<script>
const colors = [
  '#D4E157',
  '#FFEE58',
  '#FFA726',
  '#EF5350',
  '#EC407A',
  '#AB47BC',
  '#7E57C2',
  '#5C6BC0',
  '#42A5F5',
  '#66BB6A'
];

export default {
  props: {
    text: {
      required: true,
      type: String
    },
    keywords: {
      required: true,
      type: Array
    }
  },
  computed: {
    html() {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };

      let result = this.text.replace(/[&<>"']/g, m => map[m]);
      if (!this.keywords || !this.keywords.length) {
        return result;
      }

      for (let i = 0; i < this.keywords.length; i++) {
        const keyword = this.keywords[i];
        const index = result.toLowerCase().indexOf(keyword.toLowerCase());
        if (index === -1) {
          continue;
        }
        result =
          result.substr(0, index) +
          `<mark class="marked" style="background-color: ${colors[i % 10]}">` +
          result.substr(index, keyword.length) +
          '</mark>' +
          result.substr(index + keyword.length, result.length);
      }
      return result;
    }
  }
};
</script>
