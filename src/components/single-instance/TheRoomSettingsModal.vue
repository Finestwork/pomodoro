<template>
  <Modal
    :show-modal="showModal"
    :color-state="colorState"
    ref="modal"
    header-title="Settings"
    @onModalClose="closeModal"
  >
    <BaseSingleLineAlert
      class="modal__success-alert"
      color-scheme="success"
      v-if="shouldShowSuccessAlert"
    >
      Successfully updated your pomodoro settings!
    </BaseSingleLineAlert>
    <BaseSingleLineAlert
      class="modal__success-alert"
      color-scheme="danger"
      v-if="shouldShowDangerAlert"
    >
      Uh-oh! Unable to update your pomodoro settings but don't worry you can try again later.
    </BaseSingleLineAlert>

    <div class="modal__form-group-wrapper">
      <BaseNumericUpDownInput
        ref="pomodoroDuration"
        class="modal__text-input-groups"
        label="Pomodoro Duration"
        placeholder="Pomodoro's duration"
        pop-msg="Determines how many minutes you want your pomodoro session to be, which can be adjusted based on personal preference and the nature of the task at hand. Ex: 5 is equivalent to 5 minutes"
        :color-state="colorState"
        :value="pomodoroDuration"
      />

      <BaseNumericUpDownInput
        ref="pomodoros"
        class="modal__text-input-groups"
        label="Pomodoros before long break"
        placeholder="Pomodoros before long break"
        pop-msg="How many pomodoro you want before a long break?"
        :color-state="colorState"
        :value="pomodoros"
      />

      <BaseNumericUpDownInput
        ref="pomodoroShortBreak"
        class="modal__text-input-groups"
        label="Short break length"
        placeholder="Short break length"
        pop-msg="How long would you like your short break to be in between pomodoro sessions?"
        :color-state="colorState"
        :value="shortBreak"
      />

      <BaseNumericUpDownInput
        ref="pomodoroLongBreak"
        class="modal__text-input-groups"
        label="Long break length"
        placeholder="Long break length"
        pop-msg="How long would you like your break to be after completing a set of pomodoros?"
        :color-state="colorState"
        :value="longBreak"
      />

      <BaseSwitch label="Enable notification" id="switchSound" :color-state="colorState" />
    </div>
    <BaseButtonPlayful
      class="modal__save-btn"
      type="button"
      :is-loading="isBtnLoading"
      :color-state="colorState"
      @click="saveSettings"
    >
      <template #text>Save</template>
    </BaseButtonPlayful>
  </Modal>
</template>

<script>
import Modal from '@/components/global/Modal.vue';
import BaseNumericUpDownInput from '@/components/global/forms/BaseNumericUpDownInput.vue';
import BaseButtonPlayful from '@/components/global/buttons/BaseButtonPlayful.vue';
import BaseSingleLineAlert from '@/components/global/alerts/BaseSingleLineAlert.vue';
import BaseSwitch from '@/components/global/forms/BaseSwitch.vue';

// Helpers
import { useRoomSettingsStore } from '@/stores/room-settings-store';
import UserCollection from '@/assets/js/firestore/user-collection';
import TypeHelper from '@/assets/js/helpers/type-helper';

export default {
  components: {
    Modal,
    BaseNumericUpDownInput,
    BaseButtonPlayful,
    BaseSingleLineAlert,
    BaseSwitch
  },
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    // focus, short-break, long-break
    colorState: {
      type: String,
      required: true
    }
  },
  data() {
    const roomSettingsStore = useRoomSettingsStore();
    return {
      roomSettingsStore: useRoomSettingsStore(),
      pomodoroDuration: roomSettingsStore.pomodoroDuration,
      pomodoros: roomSettingsStore.pomodoros,
      shortBreak: roomSettingsStore.shortBreakLength,
      longBreak: roomSettingsStore.longBreakLength,
      isBtnLoading: false,
      shouldShowSuccessAlert: false,
      shouldShowDangerAlert: false
    };
  },
  updated() {
    this.getSettingsFromStore();
  },
  emits: ['onModalClose'],
  methods: {
    saveSettings(e) {
      const DURATION = this.$refs.pomodoroDuration.$refs.input.$refs.input.value;
      const POMODOROS = this.$refs.pomodoros.$refs.input.$refs.input.value;
      const SHORT_BREAK = this.$refs.pomodoroShortBreak.$refs.input.$refs.input.value;
      const LONG_BREAK = this.$refs.pomodoroLongBreak.$refs.input.$refs.input.value;
      const ARE_FIELDS_VALID_NUM =
        TypeHelper.isNumber(DURATION) &&
        TypeHelper.isNumber(POMODOROS) &&
        TypeHelper.isNumber(SHORT_BREAK) &&
        TypeHelper.isNumber(LONG_BREAK);
      const ARE_FIELDS_VALID_INT =
        TypeHelper.isInteger(DURATION) &&
        TypeHelper.isInteger(POMODOROS) &&
        TypeHelper.isInteger(SHORT_BREAK) &&
        TypeHelper.isInteger(LONG_BREAK);

      // Fields are not valid
      if (!ARE_FIELDS_VALID_NUM || !ARE_FIELDS_VALID_INT) {
        this.$refs.pomodoroDuration.$refs.input.$refs.input.value = this.pomodoroDuration;
        this.$refs.pomodoros.$refs.input.$refs.input.value = this.pomodoros;
        this.$refs.pomodoroShortBreak.$refs.input.$refs.input.value = this.shortBreak;
        this.$refs.pomodoroLongBreak.$refs.input.$refs.input.value = this.longBreak;

        e.currentTarget.blur();
        return;
      }

      this.shouldShowSuccessAlert = false;
      this.shouldShowDangerAlert = false;
      this.isBtnLoading = true;

      const DATA = {
        roomSettings: {
          pomodoroDuration: parseInt(DURATION),
          pomodoros: parseInt(POMODOROS),
          shortBreak: parseInt(SHORT_BREAK),
          longBreak: parseInt(LONG_BREAK)
        }
      };

      UserCollection.update(DATA)
        .then(() => {
          this.roomSettingsStore.changePomodoroDuration(parseInt(DURATION));
          this.roomSettingsStore.changeNumberOfPomodoro(parseInt(POMODOROS));
          this.roomSettingsStore.changeShortBreakLength(parseInt(SHORT_BREAK));
          this.roomSettingsStore.changeLongBreakLength(parseInt(LONG_BREAK));
          this.shouldShowSuccessAlert = true;
          this.isBtnLoading = false;
          this.getSettingsFromStore();
        })
        .catch(() => {
          this.shouldShowDangerAlert = true;
          this.isBtnLoading = false;
        });
    },
    closeModal() {
      this.shouldShowSuccessAlert = false;
      this.shouldShowDangerAlert = false;
      this.isBtnLoading = false;

      this.$refs.pomodoroDuration.$refs.input.$refs.input.value = this.pomodoroDuration;
      this.$refs.pomodoros.$refs.input.$refs.input.value = this.pomodoros;
      this.$refs.pomodoroShortBreak.$refs.input.$refs.input.value = this.shortBreak;
      this.$refs.pomodoroLongBreak.$refs.input.$refs.input.value = this.longBreak;
      this.$emit('onModalClose');
    },

    /*
     * ===========
     * Helpers
     * ===========
     */

    getSettingsFromStore() {
      this.pomodoroDuration = this.roomSettingsStore.pomodoroDuration;
      this.pomodoros = this.roomSettingsStore.pomodoros;
      this.shortBreak = this.roomSettingsStore.shortBreakLength;
      this.longBreak = this.roomSettingsStore.longBreakLength;
    }
  }
};
</script>

<style lang="scss" scoped>
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
  :deep(.modal__container) {
    width: 95%;
    max-width: 600px;
    @include padding.all-sides((
        xsm: 15
    ));
  }

  &__success-alert,
  &__danger-alert {
    @include margin.top((
        xsm: 10
    ));
    @include margin.bottom((
        xsm: 25
    ));
  }

  &__form-group-wrapper {
    @include margin.top((
        xsm: 30
    ));
  }

  &__text-input-groups {
    @include margin.bottom((
        xsm: 30
    ));

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  &__save-btn {
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
