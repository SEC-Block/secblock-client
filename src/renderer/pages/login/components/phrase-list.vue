<template>
  <ul>
    <li v-for="item in itemList" class="contant">{{ item.cnt }}</li>
  </ul>
</template>

<script>
export default {
  name: '',
  components: {

  },
  props: {
    itemList: Array
  },
  data() {
    return {

    }
  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  destroyed() { },
  methods: {

  },
}
</script>

<style scoped>
ul {
  display: flex;
  flex-wrap: wrap;
}
ul li {
  padding: 0 6px;
  background: rgba(242, 242, 242, 1);
  border-radius: 4px;
  color: #252f33;
  font-size: 14px;
  height: 24px;
  line-height: 24px;
  margin: 12px 4px 0 0;
  font-family: Lato-Regular;
}
</style>