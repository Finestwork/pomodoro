<template>
  <Modal class="" :show-modal="showModal">
    <div class="modal__header">
      <h2 class="modal__title">Settings</h2>
      <button class="modal__close-btn" type="button" @click="closeModal">
        <XMark />
      </button>
    </div>
    <div class="modal__form-group-wrapper">
      <div class="modal__text-input-groups">
        <p class="form-group__lbl">Pomodoro length</p>
        <BaseNumberTextInput placeholder="Pomodoro length" v-model="pomodoroDuration" />
      </div>
      <div class="modal__text-input-groups">
        <p class="form-group__lbl">Pomodoros before long break</p>
        <BaseNumberTextInput placeholder="Pomodoros before long break" v-model="pomodoros" />
      </div>
      <div class="modal__text-input-groups">
        <p class="form-group__lbl">Short break length</p>
        <BaseNumberTextInput placeholder="Short-break length" v-model="pomodoroShortBreak" />
      </div>
      <div class="modal__text-input-groups">
        <p class="form-group__lbl">Long break length</p>
        <BaseNumberTextInput placeholder="Long break length" v-model="pomodoroLongBreak" />
      </div>
    </div>
    <BaseButtonPlayful class="modal__save-btn" type="button" @click="saveSettings">
      <template #text>Save</template>
    </BaseButtonPlayful>
  </Modal>
</template>

<script>
import Modal from '@/components/global/Modal.vue';
import XMark from '@/components/icons/XMark.vue';
import BaseNumberTextInput from '@/components/global/forms/BaseNumberTextInput.vue';
import BaseButtonPlayful from '@/components/global/buttons/BaseButtonPlayful.vue';
import { useRoomSettingsStore } from '@/stores/room-settings-store';

export default {
  components: {
    Modal,
    XMark,
    BaseNumberTextInput,
    BaseButtonPlayful
  },
  props: {
    showModal: {
      type: Boolean,
      required: true
    }
  },
  data() {
    const roomSettingsStore = useRoomSettingsStore();
    return {
      pomodoroDuration: roomSettingsStore.pomodoroDuration.toString(),
      pomodoros: roomSettingsStore.pomodoros.toString(),
      pomodoroShortBreak: roomSettingsStore.shortBreakLength.toString(),
      pomodoroLongBreak: roomSettingsStore.longBreakLength.toString()
    };
  },
  emits: ['onModalClose'],
  methods: {
    saveSettings() {},
    closeModal() {
      this.$emit('onModalClose');
    }
  }
};
</script>

<style lang="scss">
@use 'sass:map';
@use '../../assets/scss/1-settings/css-properties/font-size/major-second';
@use '../../assets/scss/1-settings/css-properties/colors/main';
@use '../../assets/scss/1-settings/css-properties/colors/text';
@use '../../assets/scss/1-settings/css-properties/box-shadow/transition' as box-shadow-transition;
@use '../../assets/scss/2-tools/mixins/css-properties/padding';
@use '../../assets/scss/2-tools/mixins/css-properties/box-shadow/primary' as box-shadow-primary;
@use '../../assets/scss/2-tools/mixins/css-properties/font-size';
@use '../../assets/scss/2-tools/mixins/css-properties/margin';
@use '../../assets/scss/2-tools/mixins/css-properties/all-properties';

// prettier-ignore
.modal {
  &__container {
    width: 95%;
    max-width: 600px;
    @include padding.all-sides((
      xsm: 15
    ));
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-weight: 600;
    color: map.get(text.$main, 900);
    @include font-size.responsive((
        xsm: map.get(major-second.$scale, 6)
    ));
  }

  &__close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    width: 20px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    transition: box-shadow-transition.$transition-linear;
    @include padding.all-sides((
        xsm: 5
    ));

    &:focus {
      outline: none;
      @include box-shadow-primary.lightness(lighter, md)
    }

    &:focus,
    &:hover {
      background-color: map.get(main.$primary, 100);

      svg path {
        fill: map.get(main.$primary, 600);
      }
    }

    :deep(svg) {
      display: block;
      width: 100%;
      height: 100%;

      path {
        fill: map.get(text.$main, 900);
      }
    }
  }

  &__form-group-wrapper {
    @include margin.top((
        xsm: 30
    ));
  }

  &__text-input-groups {
    @include all-properties.init((
        xsm: (
            display: flex,
            flex-direction: column
        ),
        450: (
            flex-direction: row,
            justify-content: space-between,
            align-items: center
        )
    ));
    @include margin.bottom((
        xsm: 30
    ));

    &:last-of-type {
      margin-bottom: 0;
    }

    .form-group__lbl {
      font-weight: 600;
      color: map.get(main.$primary, 900);
      @include font-size.responsive((
          xsm: map.get(major-second.$scale, 3)
      ));
      @include margin.bottom((
          xsm: 15,
          450: 0
      ));
    }
  }
  &__save-btn{
    margin-left: auto;
    width: 100px;
    @include margin.top((
      xsm: 25
    ));
    @include padding.vertical((
      xsm: 13
    ));
  }
}
</style>
