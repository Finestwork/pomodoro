<template>
  <ul :class="rootClass">
    <li v-for="list in lists" :key="list">{{ list }}</li>
  </ul>
</template>

<script>
export default {
  props: {
    lists: {
      type: Array,
      required: true
    },

    // danger
    colorScheme: {
      type: String,
      required: true
    }
  },
  computed: {
    rootClass() {
      return `alert-list--${this.colorScheme}`;
    }
  }
};
</script>

<style lang="scss">
@use 'sass:map';
@use '../../../assets/scss/1-settings/css-properties/colors/safety';
@use '../../../assets/scss/1-settings/css-properties/font-size/major-second';
@use '../../../assets/scss/2-tools/functions/convertions/pixels';

.alert-list--danger {
  border-radius: 5px;
  list-style: none;
  background-color: lighten(map.get(safety.$danger, 600), 10%);
  color: white;
  font-weight: 600;
  font-size: pixels.toRem(map.get(major-second.$scale, 3));
  padding: pixels.toRem(10);

  > * {
    margin-bottom: pixels.toRem(7);
    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>
