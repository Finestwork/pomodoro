<template>
  <nav class="nav">
    <TheLogo />
    <div class="nav__items">
      <BaseButtonIcon tooltip="Room Settings" @click="showRoomSettings">
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
      <BaseButtonIcon tooltip="Logout" @click="logoutUser">
        <ArrowLeftFromLineIcon />
      </BaseButtonIcon>
    </div>
  </nav>

  <Teleport to="body">
    <TheRoomSettingsModal :show-modal="shouldShowModal" @onModalClose="onModalClose" />
  </Teleport>
</template>
<script>
import BaseButtonIcon from '@/components/global/buttons/BaseButtonIcon.vue';
import UserIcon from '@/components/icons/User.vue';
import ArrowLeftFromLineIcon from '@/components/icons/ArrowLeftFromLine.vue';
import ChartColumnIcon from '@/components/icons/ChartColumn.vue';
import LinkIcon from '@/components/icons/Link.vue';
import GearIcon from '@/components/icons/Gear.vue';
import TheLogo from '@/components/single-instance/TheLogo.vue';
import TheRoomSettingsModal from '@/components/single-instance/TheRoomSettingsModal.vue';

// NPM
import { getAuth } from 'firebase/auth';

export default {
  components: {
    TheLogo,
    UserIcon,
    BaseButtonIcon,
    ArrowLeftFromLineIcon,
    ChartColumnIcon,
    LinkIcon,
    GearIcon,
    TheRoomSettingsModal
  },
  data() {
    return {
      shouldShowModal: false
    };
  },
  methods: {
    logoutUser() {
      getAuth().signOut();
    },
    onModalClose() {
      this.shouldShowModal = false;
    },
    showRoomSettings(e) {
      e.currentTarget.blur();
      this.shouldShowModal = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../assets/scss/1-settings/css-properties/colors/main';
@use '../../assets/scss/2-tools/mixins/css-properties/padding';
@use '../../assets/scss/2-tools/mixins/css-properties/margin';
@use '../../assets/scss/2-tools/mixins/css-properties/all-properties';

// prettier-ignore
.nav {
  @include all-properties.init((
      xsm: (
          display: flex,
          flex-direction: column,
          border-bottom: 2px dashed map.get(main.$primary, 600)
      ),
      380: (
          flex-direction: row,
          justify-content: space-between,
          align-items: center
      )
  ));
  @include padding.vertical((
      xsm: 25
  ));

  &__items {
    display: flex;
    @include margin.top((
        xsm: 15,
        380: 0
    ));
  }
}
</style>
