<template>
  <nav :class="getRootClass">
    <TheLogo :color-state="colorState" />
    <div class="nav__items">
      <BaseButtonIcon tooltip="Room Settings" :color-state="colorState" @click="showRoomSettings">
        <GearIcon />
      </BaseButtonIcon>
      <BaseButtonIcon tooltip="Share Link" :color-state="colorState">
        <LinkIcon />
      </BaseButtonIcon>
      <BaseButtonIcon tooltip="Report" :color-state="colorState">
        <ChartColumnIcon />
      </BaseButtonIcon>
      <BaseButtonIcon
        tooltip="Profile Settings"
        :color-state="colorState"
        @click="showProfileSettings"
      >
        <UserIcon />
      </BaseButtonIcon>
      <BaseButtonIcon tooltip="Logout" :color-state="colorState" @click="logoutUser">
        <ArrowLeftFromLineIcon />
      </BaseButtonIcon>
    </div>
  </nav>

  <Teleport to="body">
    <TheRoomSettingsModal
      :show-modal="shouldShowRoomSettings"
      :color-state="colorState"
      @onModalClose="onRoomSettingsClose"
    />
    <TheProfileSettings
      :show-modal="shouldShowProfileSettings"
      :color-state="colorState"
      @onModalClose="onProfileSettingsClose"
    />
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
import TheProfileSettings from '@/components/single-instance/TheProfileSettings.vue';

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
    TheRoomSettingsModal,
    TheProfileSettings
  },
  props: {
    // focus, short-break, long-break
    colorState: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      shouldShowProfileSettings: false,
      shouldShowRoomSettings: false
    };
  },
  methods: {
    logoutUser() {
      getAuth().signOut();
    },
    onRoomSettingsClose() {
      document.body.style.overflow = null;
      this.shouldShowRoomSettings = false;
    },
    showRoomSettings() {
      document.body.style.overflow = 'hidden';
      this.shouldShowRoomSettings = true;
    },
    showProfileSettings() {
      document.body.style.overflow = 'hidden';
      this.shouldShowProfileSettings = true;
    },
    onProfileSettingsClose() {
      document.body.style.overflow = null;
      this.shouldShowProfileSettings = false;
    }
  },
  computed: {
    getRootClass() {
      return `nav ${this.colorState}`;
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
  &.focus {
    border-bottom: 2px dashed map.get(main.$primary, 600)
  }

  &.short-break {
    border-bottom: 2px dashed map.get(main.$secondary, 600)
  }

  &.long-break {
    border-bottom: 2px dashed map.get(main.$tertiary, 600)
  }

  @include all-properties.init((
      xsm: (
          display: flex,
          flex-direction: column,
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
