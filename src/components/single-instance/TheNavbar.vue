<template>
  <nav class="nav">
    <TheLogo />
    <div class="nav__items">
      <BaseButtonIcon tooltip="Report">
        <ChartColumnIcon />
      </BaseButtonIcon>
      <BaseButtonIcon tooltip="User">
        <UserIcon />
      </BaseButtonIcon>
      <BaseButtonIcon tooltip="Logout">
        <ArrowLeftFromLineIcon />
      </BaseButtonIcon>
    </div>
  </nav>
</template>
<script>
import BaseButtonIcon from '@/components/global/buttons/BaseButtonIcon.vue';
import UserIcon from '@/components/icons/User.vue';
import ArrowLeftFromLineIcon from '@/components/icons/ArrowLeftFromLine.vue';
import ChartColumnIcon from '@/components/icons/ChartColumn.vue';
import TheLogo from '@/components/single-instance/TheLogo.vue';

export default {
  components: {
    TheLogo,
    UserIcon,
    BaseButtonIcon,
    ArrowLeftFromLineIcon,
    ChartColumnIcon
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../assets/scss/1-settings/css-properties/colors/main';
@use '../../assets/scss/2-tools/mixins/css-properties/padding';

// prettier-ignore
.nav {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed map.get(main.$primary, 600);
  @include padding.bottom((
    xsm: 25
  ));

  &__items {
    display: flex;
  }
}
</style>
