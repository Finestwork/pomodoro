<template>
  <main>
    <h2>Hello from vue</h2>
    <Button />
  </main>
</template>

<script>
import Button from '@/components/Button.vue';
export default {
  components: {
    Button
  }
};
</script>
<style lang="scss">
@use '../assets/scss/1-settings/css-properties/font-family/roboto-flex';
@import 'normalize.css';

*,
*::before,
*::after {
  padding: 0;
  margin: 0;
  box-sizing: inherit;
}

html {
  font-size: 62.5%; // 10px of 16px
  box-sizing: border-box;
}

body {
  position: relative;
  font-family: roboto-flex.$full-support;
  font-size: 1.6rem; // 16px in rem
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}

main {
  display: flex;
  flex-direction: column;
  h2 {
    margin-bottom: 1rem;
  }
}
</style>
