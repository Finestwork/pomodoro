<template>
  <div class="homepage">
    <div class="homepage__container">
      <TheNavbar class="nav" />
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/single-instance/TheNavbar.vue';

// NPM
import { getAuth } from 'firebase/auth';

export default {
  components: { TheNavbar },
  methods: {
    logoutUser() {
      getAuth().signOut();
    }
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../assets/scss/1-settings/css-properties/colors/main';
@use '../../assets/scss/2-tools/mixins/css-properties/margin';
@use '../../assets/scss/2-tools/mixins/css-properties/padding';

// prettier-ignore
.homepage{
  background-color: lighten(map.get(main.$primary, 50), 2%);

  &__container {
    width: 90%;
    min-height: 100vh;
    margin-left: auto;
    margin-right: auto;

    @include padding.all-sides((
        xsm: 0.1
    ));

    .nav {
      @include padding.top((
          xsm: 30
      ));
    }
  }
}
</style>
