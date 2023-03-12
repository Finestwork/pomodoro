<template>
  <Modal
    :color-state="colorState"
    :show-modal="showModal"
    header-title="Settings"
    @onModalClose="onModalClose"
  >
    <div class="modal__form-wrapper">
      <BaseSingleLineAlert
        class="modal__alert"
        color-scheme="danger"
        v-if="errorAlertText.trim() !== ''"
        >{{ errorAlertText }}
      </BaseSingleLineAlert>
      <BaseSingleLineAlert
        class="modal__alert"
        color-scheme="success"
        v-if="successAlertText.trim() !== ''"
        >{{ successAlertText }}
      </BaseSingleLineAlert>
      <BaseTextInput
        class="modal__form"
        label="Username:"
        type="text"
        placeholder="Place your username here"
        id="profileSettingsUsernameTxt"
        :color-state="colorState"
        v-model="currentUsername"
      />
      <BaseTextInput
        class="modal__form"
        label="Email:"
        type="email"
        placeholder="Place your email here"
        id="profileSettingsEmailTxt"
        :validation-rules="{ isEmail: true }"
        :clear-errors="shouldClearEmailErrors"
        :color-state="colorState"
        v-model="currentEmail"
      />
      <BaseTextInput
        class="modal__form"
        label="Change password:"
        type="password"
        placeholder="Change your password here"
        id="profileSettingsPasswordTxt"
        :color-state="colorState"
        v-model="currentPassword"
      />
    </div>

    <div class="modal__form-controls">
      <BaseButtonPlayful class="btn" type="button" color-state="danger" @click="reset">
        <template #text>Reset</template>
      </BaseButtonPlayful>
      <BaseButtonPlayful
        class="btn"
        type="button"
        :color-state="colorState"
        :is-loading="isSubmitBtnLoading"
        @click="submit"
      >
        <template #text>Update</template>
      </BaseButtonPlayful>
    </div>
  </Modal>

  <Teleport to="body">
    <Modal
      class="auth-modal"
      :color-state="colorState"
      :show-modal="shouldShowAuthenticationModal"
      @onModalClose="authModalClose"
    >
      <p class="auth-modal__label">Please confirm your credentials.</p>
      <BaseTextInput
        class="auth-modal__form-wrapper"
        id="authEmailTxt"
        label="Email:"
        placeholder="Place your email here"
        type="email"
        :clear-form="shouldClearAuthEmail"
        :color-state="colorState"
        v-model="credentialEmail"
      />
      <BaseTextInput
        class="auth-modal__form-wrapper"
        id="authPasswordTxt"
        label="Password:"
        placeholder="Place your password here"
        type="password"
        :clear-form="shouldClearAuthPassword"
        :color-state="colorState"
        v-model="credentialPassword"
      />
      <BaseButtonPlayful
        class="auth-modal__submit-btn"
        type="button"
        :color-state="colorState"
        :is-loading="isAuthBtnLoading"
        @click="submitCredential"
      >
        <template #text>Submit</template>
      </BaseButtonPlayful>
    </Modal>
  </Teleport>
</template>

<script>
import Modal from '@/components/global/Modal.vue';
import BaseTextInput from '@/components/global/forms/BaseTextInput.vue';
import BaseButtonPlayful from '@/components/global/buttons/BaseButtonPlayful.vue';
import BaseSingleLineAlert from '@/components/global/alerts/BaseSingleLineAlert.vue';
import GoogleCodeErrors from '@/assets/js/auth/google-code-errors';

// NPM
import {
  getAuth,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';

export default {
  components: {
    Modal,
    BaseTextInput,
    BaseButtonPlayful,
    BaseSingleLineAlert
  },
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    colorState: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      credentialEmail: '',
      credentialPassword: '',
      oldUsername: '',
      oldEmail: '',
      currentUsername: '',
      currentEmail: '',
      currentPassword: '',
      shouldClearEmailErrors: false,
      shouldShowAuthenticationModal: false,
      shouldClearAuthEmail: false,
      shouldClearAuthPassword: false,
      isSubmitBtnLoading: false,
      isAuthBtnLoading: false,
      errorAlertText: '',
      successAlertText: ''
    };
  },
  mounted() {
    const currentUser = getAuth().currentUser;

    this.oldUsername = currentUser.displayName;
    this.currentUsername = currentUser.displayName;
    this.oldEmail = currentUser.email;
    this.currentEmail = currentUser.email;
  },
  emits: ['onModalClose'],
  methods: {
    onModalClose() {
      this.isSubmitBtnLoading = false;
      this.isAuthBtnLoading = false;
      this.credentialEmail = '';
      this.credentialPassword = '';
      this.reset();
      this.$emit('onModalClose');
    },
    reset(e = null) {
      if (e !== null) e.currentTarget.blur();
      this.currentUsername = this.oldUsername;
      this.currentEmail = this.oldEmail;
      this.currentPassword = '';
      this.shouldClearEmailErrors = true;
      this.errorAlertText = '';
      this.successAlertText = '';

      this.$nextTick(() => (this.shouldClearEmailErrors = false));
    },
    submit(e) {
      e.currentTarget.blur();

      const ARE_FIELDS_VALID =
        this.currentUsername === this.oldUsername &&
        this.currentEmail === this.oldEmail &&
        this.currentPassword.trim() === '';

      if (ARE_FIELDS_VALID) return;

      const currentUser = getAuth().currentUser;
      this.errorAlertText = '';
      this.successAlertText = '';
      this.isSubmitBtnLoading = true;

      // If user only updated his username
      if (this.currentUsername !== this.oldUsername) {
        updateProfile(currentUser, { displayName: this.currentUsername }).then(() => {
          this.oldUsername = this.currentUsername;
        });
      }

      // If user updates both password and email
      if (this.currentEmail !== this.oldEmail && this.currentPassword.trim() !== '') {
        updateEmail(currentUser, this.currentEmail)
          .then(() => {
            updatePassword(currentUser, this.currentPassword)
              .then(() => {
                this.oldEmail = this.currentEmail;
                this.currentPassword = '';
                this.isSubmitBtnLoading = false;
                this.successAlertText = 'Successfully updated your credentials.';
              })
              .catch((err) => {
                if (!err.code) return;

                // Other google error codes
                this.errorAlertText = GoogleCodeErrors.getErrors[err.code];
              });
          })
          .catch((err) => {
            if (!err.code) return;

            // Re-authenticate user
            if (err.code === 'auth/requires-recent-login') {
              this.shouldShowAuthenticationModal = true;
              this.credentialEmail = this.oldEmail;
            }

            // Other google error codes
            this.errorAlertText = GoogleCodeErrors.getErrors[err.code];
          });

        return;
      }

      // If user only updates the email
      if (this.currentEmail !== this.oldEmail) {
        updateEmail(currentUser, this.currentEmail)
          .then(() => {
            this.oldEmail = this.currentEmail;
            this.isSubmitBtnLoading = false;
            this.successAlertText = 'Successfully updated your credentials.';
          })
          .catch((err) => {
            if (!err.code) return;

            // Re-authenticate user
            if (err.code === 'auth/requires-recent-login') {
              this.shouldShowAuthenticationModal = true;
              this.credentialEmail = this.oldEmail;
            }
          });

        return;
      }

      // If user only updates the password
      if (this.currentPassword.trim() !== '') {
        updatePassword(currentUser, this.currentPassword)
          .then(() => {
            this.isSubmitBtnLoading = false;
            this.successAlertText = 'Successfully updated your credentials.';
          })
          .catch((err) => {
            if (!err.code) return;

            // Re-authenticate user
            if (err.code === 'auth/requires-recent-login') {
              this.credentialEmail = this.oldEmail;
              this.shouldShowAuthenticationModal = true;
            }
          });
      }
    },
    submitCredential() {
      this.isAuthBtnLoading = true;
      const PROVIDER = EmailAuthProvider.credential(this.credentialEmail, this.credentialPassword);
      reauthenticateWithCredential(getAuth().currentUser, PROVIDER)
        .then(() => {
          this.isAuthBtnLoading = false;
          this.isSubmitBtnLoading = false;
          this.oldEmail = this.currentEmail;
          this.shouldShowAuthenticationModal = false;

          this.currentPassword = '';
          this.credentialEmail = '';
          this.credentialPassword = '';
          this.successAlertText = 'Successfully updated your credentials.';
        })
        .catch((err) => {
          this.isAuthBtnLoading = false;
          this.isSubmitBtnLoading = false;
          this.shouldShowAuthenticationModal = false;

          if (!err.code) return;
          this.errorAlertText = GoogleCodeErrors.getErrors[err.code];
          this.credentialEmail = '';
          this.credentialPassword = '';
        });
    },
    authModalClose() {
      this.shouldShowAuthenticationModal = false;
      this.isSubmitBtnLoading = false;
      this.isAuthBtnLoading = false;
      this.credentialEmail = '';
      this.credentialPassword = '';
    }
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../assets/scss/1-settings/css-properties/font-size/major-second';
@use '../../assets/scss/1-settings/css-properties/colors/text';
@use '../../assets/scss/2-tools/mixins/css-properties/margin';
@use '../../assets/scss/2-tools/mixins/css-properties/padding';
@use '../../assets/scss/2-tools/mixins/css-properties/font-size';

// prettier-ignore
.modal {
  &__form-wrapper {
    @include margin.top((
        xsm: 35
    ));
  }

  &__form {
    @include margin.bottom((
        xsm: 15
    ));

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  &__alert {
    @include margin.bottom((
        xsm: 15
    ));
  }

  &__form-controls {
    display: flex;
    justify-content: flex-end;
    @include margin.top((
        xsm: 25
    ));
    @include margin.bottom((
        xsm: 7
    ));

    .btn {
      @include margin.right((
          xsm: 7
      ));

      &:last-of-type {
        margin-right: 0;
      }
    }
  }

}

// prettier-ignore
.auth-modal {
  &__label {
    font-weight: 600;
    text-align: center;
    color: map.get(text.$main, 700);
    @include font-size.responsive((
        xsm: map.get(major-second.$scale, 3)
    ));
    @include margin.top((
        xsm: 45
    ));
    @include margin.bottom((
        xsm: 15
    ));
  }

  &__form-wrapper {
    @include margin.bottom((
        xsm: 15
    ));

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  &__submit-btn {
    width: 100%;
    max-width: 250px;
    margin-left: auto;
    margin-right: auto;
    @include margin.top((
        xsm: 35
    ));
    @include margin.bottom((
        xsm: 10
    ));
    @include padding.all-sides((
        xsm: [15, 10]
    ));
  }
}
</style>
