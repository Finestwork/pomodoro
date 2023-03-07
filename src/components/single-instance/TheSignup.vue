<template>
  <div class="signup">
    <h2 class="signup__title">Signup</h2>

    <form class="signup__form">
      <BaseTextInput
        class="form__username"
        :label="'Username:'"
        :type="'text'"
        :id="'signupUsernameTxt'"
        :placeholder="'Enter username here'"
        v-model="usernameText"
      />
      <BaseTextInput
        class="form__email"
        :label="'Email:'"
        :type="'email'"
        :id="'signupEmailTxt'"
        :placeholder="'Enter email here'"
        v-model="emailText"
      />
      <BaseTextInput
        class="form__password"
        :label="'Password:'"
        :type="'password'"
        :id="'signupPasswordTxt'"
        :placeholder="'Enter password here'"
        v-model="passwordText"
      />
      <BaseTextInput
        class="form__confirm-password"
        :label="'Confirm Password:'"
        :type="'password'"
        :id="'signupConfirmPasswordTxt'"
        :placeholder="'Confirm your password here'"
        v-model="confirmPasswordText"
      />
      <BasePlayfulButton
        class="form__submit"
        :type="'button'"
        :is-loading="toggleBtnLoading"
        @click="submitForm"
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
import BasePlayfulButton from '@/components/global/buttons/BasePlayfulButton.vue';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default {
  components: {
    BaseTextInput,
    BasePlayfulButton
  },
  data() {
    return {
      usernameText: '',
      emailText: '',
      passwordText: '',
      confirmPasswordText: '',
      toggleBtnLoading: false
    };
  },
  methods: {
    submitForm() {
      this.toggleBtnLoading = true;

      createUserWithEmailAndPassword(getAuth(), this.emailText, this.passwordText)
        .then((res) => {
          this.toggleBtnLoading = false;

          console.log(res);

          updateProfile(getAuth().currentUser, { displayName: this.usernameText }).then((res) => {
            console.log(res);
            // Success
          });
        })
        .catch((err) => {
          this.toggleBtnLoading = false;
          console.log(err);
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
.signup{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__title{
    font-weight: 800;
    color: map.get(main.$primary, 900);
    @include font-size.responsive((
      xsm: map.get(major-second.$scale, 7)
    ));
  }

  &__form{
    max-width: 650px;
    .form{
      &__username,
      &__email,
      &__password{
        @include margin.bottom((
            xsm: 15
        ));
      }
      &__submit{
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

  &__login-msg{
    font-weight: 500;
    color: map.get(text.$main, 800);
    @include font-size.responsive((
      xsm: map.get(major-second.$scale, 3)
    ));
  }
  &__login-link{
    transition: box-shadow-transition.$transition-linear;
    color: map.get(main.$primary, 500);

    &:focus{
      outline: none;
      @include box-shadow-primary.lightness(light, sm);
    }

    &:focus,
    &:hover{
      color: darken(map.get(main.$primary, 500), 5%);
    }
  }
}
</style>
