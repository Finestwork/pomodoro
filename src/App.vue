<template>
  <router-view />
</template>

<style lang="scss">
@use 'assets/scss/1-settings/css-properties/font-family/roboto-flex';
@use 'assets/scss/3-generics/normalize';
@use 'assets/scss/3-generics/reset-space';
@use 'assets/scss/3-generics/reset-form-fields';

html {
  font-size: 62.5%; // 10px of 16px
  box-sizing: border-box;
}

body {
  font-family: roboto-flex.$full-support;
  position: relative;
  font-size: 1.6rem; // 16px in rem
  overflow-x: hidden;
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
