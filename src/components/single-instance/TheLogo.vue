<template>
  <div class="logo">
    <span class="logo__box">
      <img src="/images/logo/pomofocus.svg" alt="Pomofocus Logo" />
    </span>
    <span class="logo__text">Pomofocus</span>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../assets/scss/1-settings/css-properties/colors/main';
@use '../../assets/scss/2-tools/functions/convertions/pixels';

.logo {
  display: flex;
  align-items: center;
  &__box {
    display: flex;
    width: 20px;
    height: 20px;
    img {
      display: block;
      width: 100%;
    }
  }
  &__text {
    font-weight: 700;
    color: map.get(main.$primary, 600);
    margin-left: pixels.toRem(4);
  }
}
</style>
