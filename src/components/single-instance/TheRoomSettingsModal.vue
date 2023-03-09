<template>
  <Modal class="" :show-modal="showModal">
    <div class="modal__header">
      <h2 class="modal__title">Settings</h2>
      <button class="modal__close-btn" type="button" @click="closeModal">
        <XMark />
      </button>
    </div>
    <div class="modal__form-group-wrapper">
      <BaseNumericUpDownInput
        label="Pomodoro Duration"
        placeholder="Pomodoro's duration"
        v-model="pomodoroDuration"
      />

      <BaseNumericUpDownInput
        label="Pomodoros before long break"
        placeholder="Pomodoros before long break"
        v-model="pomodoros"
      />

      <BaseNumericUpDownInput
        label="Short break length"
        placeholder="Short break length"
        v-model="pomodoroShortBreak"
      />

      <BaseNumericUpDownInput
        label="Long break length"
        placeholder="Long break length"
        v-model="pomodoroLongBreak"
      />
    </div>
    <BaseButtonPlayful
      class="modal__save-btn"
      type="button"
      :is-loading="isBtnLoading"
      @click="saveSettings"
    >
      <template #text>Save</template>
    </BaseButtonPlayful>
  </Modal>
</template>

<script>
import Modal from '@/components/global/Modal.vue';
import XMark from '@/components/icons/XMark.vue';
import BaseNumericUpDownInput from '@/components/global/forms/BaseNumericUpDownInput.vue';
import BaseNumberTextInput from '@/components/global/forms/BaseNumberTextInput.vue';
import BaseButtonPlayful from '@/components/global/buttons/BaseButtonPlayful.vue';
import { useRoomSettingsStore } from '@/stores/room-settings-store';
import UserCollection from '@/assets/js/firestore/user-collection';

export default {
  components: {
    Modal,
    XMark,
    BaseNumericUpDownInput,
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
      pomodoroLongBreak: roomSettingsStore.longBreakLength.toString(),
      isBtnLoading: false
    };
  },
  emits: ['onModalClose'],
  methods: {
    saveSettings() {
      this.isBtnLoading = true;

      const DATA = {
        roomSettings: {
          pomodoroDuration: parseInt(this.pomodoroDuration),
          pomodoros: parseInt(this.pomodoros),
          shortBreak: parseInt(this.pomodoroShortBreak),
          longBreak: parseInt(this.pomodoroLongBreak)
        }
      };

      UserCollection.update(DATA);

      setTimeout(() => (this.isBtnLoading = false), 1000);
    },
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
