<template>
  <nav class="nav">
    <TheLogo />
    <div class="nav__items">
      <BaseButtonIcon tooltip="Room Settings">
        <GearIcon />
      </BaseButtonIcon>
      <BaseButtonIcon tooltip="Share Link">
        <LinkIcon />
      </BaseButtonIcon>
      <BaseButtonIcon tooltip="Report">
        <ChartColumnIcon />
      </BaseButtonIcon>
      <BaseButtonIcon tooltip="User">
        <UserIcon />
      </BaseButtonIcon>
      <BaseButtonIcon tooltip="Logout">
        <ArrowLeftFromLineIcon />
      </BaseButtonIcon>

      <span class="nav__dashed-border">
        <DashedBorder />
      </span>
    </div>
  </nav>
</template>
<script>
import BaseButtonIcon from '@/components/global/buttons/BaseButtonIcon.vue';
import UserIcon from '@/components/icons/User.vue';
import ArrowLeftFromLineIcon from '@/components/icons/ArrowLeftFromLine.vue';
import ChartColumnIcon from '@/components/icons/ChartColumn.vue';
import LinkIcon from '@/components/icons/Link.vue';
import GearIcon from '@/components/icons/Gear.vue';
import TheLogo from '@/components/single-instance/TheLogo.vue';
import DashedBorder from '@/components/Shapes/DashedBorder.vue';

export default {
  components: {
    TheLogo,
    UserIcon,
    BaseButtonIcon,
    ArrowLeftFromLineIcon,
    ChartColumnIcon,
    LinkIcon,
    GearIcon,
    DashedBorder
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
  position: relative;
  //border-bottom: 1px dashed map.get(main.$primary, 600);
  @include padding.bottom((
    xsm: 25
  ));

  &__items {
    display: flex;
  }

  &__dashed-border{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    :deep(svg){
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
