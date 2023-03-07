<template>
  <div class="login">
    <TheLogo />

    <div>
      <p class="form__label">Please login to continue</p>
      <form class="form__form">
        <BaseTextInput
          class="form__email"
          :label="'Email:'"
          :type="'text'"
          :id="'emailTxt'"
          :placeholder="'Enter email here'"
          v-model="emailText"
        >
          <template #leadingIcon>
            <UserIcon />
          </template>
        </BaseTextInput>
        <BaseTextInput
          class="form__password"
          :label="'Password:'"
          :type="'password'"
          :id="'passwordTxt'"
          :placeholder="'Enter password here'"
          v-model="passwordText"
        >
          <template #leadingIcon>
            <LockIcon />
          </template>
        </BaseTextInput>
        <BasePlayfulButton
          class="form__submit"
          :type="'button'"
          :is-loading="toggleBtnLoading"
          @click="submitForm"
        >
          <template #text>Login</template>
        </BasePlayfulButton>
      </form>
    </div>

    <p class="login__no-account">
      Don't have an account yet?
      <router-link class="login__register-link" :to="{ name: 'Signup' }">Signup here</router-link>
    </p>
  </div>
</template>

<script>
import TheLogo from '@/components/single-instance/TheLogo.vue';
import BaseTextInput from '@/components/global/forms/BaseTextInput.vue';
import UserIcon from '@/components/icons/User.vue';
import LockIcon from '@/components/icons/Lock.vue';
import BasePlayfulButton from '@/components/global/buttons/BasePlayfulButton.vue';

export default {
  components: {
    TheLogo,
    BaseTextInput,
    UserIcon,
    LockIcon,
    BasePlayfulButton
  },
  data() {
    return {
      emailText: '',
      passwordText: '',
      toggleBtnLoading: false
    };
  },
  methods: {
    submitForm() {}
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
.login {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  .form {
    &__label {
      text-align: center;
      font-weight: 600;
      color: map.get(text.$main, 900);
      @include font-size.responsive((
          xsm: map.get(major-second.$scale, 3)
      ));
      @include margin.bottom((
        xsm: 25
      ));
    }
    &__email{
      @include margin.bottom((
          xsm: 25
      ));
    }

    &__password{
      @include margin.bottom((
        xsm: 30
      ));
    }

    &__submit{
      width: 100%;
      max-width: 250px;
      margin-left: auto;
      margin-right: auto;
      box-shadow: 0 6px 0 rgba(map.get(main.$primary, 500), 0.4);
      @include padding.all-sides((
        xsm: 15
      ));
      &:focus{
        box-shadow: 0 3px 0 rgba(map.get(main.$primary, 500), 0.4);
      }
    }
  }

  &__no-account{
    text-align: center;
    font-weight: 600;
    color: map.get(text.$main, 700);
    @include font-size.responsive((
      xsm: map.get(major-second.$scale, 2)
    ));
  }

  &__register-link{
    outline: none;
    transition: box-shadow-transition.$transition-linear;
    color: map.get(main.$primary, 600);
    @include font-size.responsive((
      xsm: map.get(major-second.$scale, 3)
    ));
    &:hover,
    &:focus{
      color: darken(map.get(main.$primary, 600), 5%);
    }
    &:focus{
      @include box-shadow-primary.lightness(light, sm);
    }
  }
}
</style>
