<template>
  <div class="signup">
    <h2 class="signup__title">Signup</h2>

    <BaseListAlert
      class="signup__alert-list"
      :lists="errors"
      :color-scheme="'danger'"
      v-if="errors.length !== 0"
    />

    <form class="signup__form" @submit.prevent="submitForm">
      <BaseTextInput
        class="form__username"
        :label="'Username:'"
        :type="'text'"
        :id="'signupUsernameTxt'"
        :placeholder="'Enter username here'"
        :validation-rules="{ required: true }"
        v-model="usernameText"
      />
      <BaseTextInput
        class="form__email"
        :label="'Email:'"
        :type="'email'"
        :id="'signupEmailTxt'"
        :placeholder="'Enter email here'"
        :validation-rules="{ isEmail: true }"
        v-model="emailText"
      />
      <BaseTextInput
        class="form__password"
        :label="'Password:'"
        :type="'password'"
        :id="'signupPasswordTxt'"
        :placeholder="'Enter password here'"
        :validation-rules="{
          min: 6,
          required: true
        }"
        v-model="passwordText"
      />
      <BaseTextInput
        class="form__confirm-password"
        :label="'Confirm Password:'"
        :type="'password'"
        :id="'signupConfirmPasswordTxt'"
        :placeholder="'Confirm your password here'"
        :validation-rules="{
          min: 6,
          required: true,
          sameWith: { element: '#signupPasswordTxt', fieldName: 'password' }
        }"
        v-model="confirmPasswordText"
      />
      <BasePlayfulButton
        ref="submitBtn"
        class="form__submit"
        color-state="focus"
        :type="'submit'"
        :is-loading="toggleBtnLoading"
      >
        <template #text>Register</template>
      </BasePlayfulButton>
    </form>

    <p class="signup__login-msg">
      Already have an account?
      <router-link class="signup__login-link" :to="{ name: 'Login' }">Login here</router-link>
    </p>
  </div>
</template>

<script>
import BaseTextInput from '@/components/global/forms/BaseTextInput.vue';
import BasePlayfulButton from '@/components/global/buttons/BaseButtonPlayful.vue';
import BaseListAlert from '@/components/global/alerts/BaseListAlert.vue';
import GoogleCodeErrors from '@/assets/js/auth/google-code-errors';
import { useRoomSettingsStore } from '@/stores/room-settings-store';
import UserCollection from '@/assets/js/firestore/user-collection';

// NPM
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import isEmpty from 'validator/es/lib/isEmpty';
import isEmail from 'validator/es/lib/isEmail';
import isLength from 'validator/es/lib/isLength';

export default {
  components: {
    BaseTextInput,
    BasePlayfulButton,
    BaseListAlert
  },
  data() {
    return {
      usernameText: '',
      emailText: '',
      passwordText: '',
      confirmPasswordText: '',
      toggleBtnLoading: false,
      errors: []
    };
  },
  emits: ['successfullyRegistered', 'updateProfileFailed'],
  methods: {
    submitForm() {
      this.$refs.submitBtn.$el.blur(); // Bouncy effect
      this.errors = [];
      this.toggleBtnLoading = true;

      // Validate Fields
      [
        { field: 'usernameText', message: `• Username field must not be empty.` },
        { field: 'emailText', message: `• Email field must not be empty.` },
        { field: 'passwordText', message: `• Password field must not be empty.` },
        { field: 'confirmPasswordText', message: `• Confirm password field must not be empty.` }
      ].forEach((fieldObj) => {
        if (isEmpty(this[fieldObj.field])) {
          this.errors.push(fieldObj.message);
        }
      });

      if (!isEmail(this.emailText)) {
        this.errors.push('• Invalid email address.');
      }

      if (this.passwordText !== this.confirmPasswordText) {
        this.errors.push('• Password fields is not the same.');
      }

      if (!isLength(this.passwordText, { min: 6 })) {
        this.errors.push('• Password must be greater than 5.');
      }

      if (!isLength(this.confirmPasswordText, { min: 6 })) {
        this.errors.push('• Confirm password must be greater than 5.');
      }

      // If there's an error, do not register the user
      if (this.errors.length !== 0) {
        this.toggleBtnLoading = false;
        return;
      }

      // validate
      createUserWithEmailAndPassword(getAuth(), this.emailText, this.passwordText)
        .then((res) => {
          this.toggleBtnLoading = false;

          updateProfile(getAuth().currentUser, { displayName: this.usernameText })
            .then(() => {
              const roomSettingsStore = useRoomSettingsStore();
              const USER_ID = res.user.uid;
              const DATA = {
                userId: USER_ID,
                displayName: this.usernameText,
                roomSettings: {
                  pomodoroDuration: roomSettingsStore.pomodoroDuration,
                  pomodoros: roomSettingsStore.pomodoros,
                  shortBreak: roomSettingsStore.shortBreakLength,
                  longBreak: roomSettingsStore.longBreakLength
                }
              };

              UserCollection.addData(DATA);
            })
            .catch(() => {
              this.$emit('updateProfileFailed');
            });
        })
        .catch((err) => {
          this.toggleBtnLoading = false;
          if (err.code) {
            this.errors.push(`• ${GoogleCodeErrors.getErrors[err.code]}`);
            return;
          }

          this.errors.push('• Sorry unable to register, please try again later.');
          this.$emit('failedRegister');
        });
    }
  }
};
</script>

<style lang="scss">
@use 'sass:map';
@use '../../assets/scss/1-settings/css-properties/font-size/major-second';
@use '../../assets/scss/1-settings/css-properties/colors/text';
@use '../../assets/scss/1-settings/css-properties/colors/main';
@use '../../assets/scss/1-settings/css-properties/box-shadow/transition' as box-shadow-transition;
@use '../../assets/scss/2-tools/mixins/css-properties/font-size';
@use '../../assets/scss/2-tools/mixins/css-properties/margin';
@use '../../assets/scss/2-tools/mixins/css-properties/padding';
@use '../../assets/scss/2-tools/mixins/css-properties/box-shadow/primary' as box-shadow-primary;

// prettier-ignore
.signup {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__title {
    font-weight: 800;
    color: map.get(main.$primary, 900);
    @include font-size.responsive((
        xsm: map.get(major-second.$scale, 7)
    ));
  }

  &__alert-list {
    @include margin.top((
        xsm: 20
    ));
    @include margin.bottom((
        xsm: 20
    ));
  }

  &__form {
    max-width: 650px;

    .form {
      &__username,
      &__email,
      &__password {
        @include margin.bottom((
            xsm: 15
        ));
      }

      &__submit {
        width: 100%;
        max-width: 250px;
        margin-left: auto;
        margin-right: auto;
        @include margin.top((
            xsm: 35
        ));
        @include padding.vertical((
            xsm: 15
        ));
      }
    }
  }

  &__login-msg {
    font-weight: 500;
    color: map.get(text.$main, 800);
    @include font-size.responsive((
        xsm: map.get(major-second.$scale, 3)
    ));
    @include margin.top((
        xsm: 30
    ));
  }

  &__login-link {
    transition: box-shadow-transition.$transition-linear;
    color: map.get(main.$primary, 500);

    &:focus {
      outline: none;
      @include box-shadow-primary.lightness(light, sm);
    }

    &:focus,
    &:hover {
      color: darken(map.get(main.$primary, 500), 5%);
    }
  }
}
</style>
