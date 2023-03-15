<template>
  <div :class="getRootClass">
    <span class="switch__label">{{ label }}</span>

    <div class="switch__wrapper">
      <input type="checkbox" :id="id" />
      <label :for="id"></label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // focus, short-break, long-break
    colorState: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    label: {
      type: String
    }
  },
  computed: {
    getRootClass() {
      return `switch ${this.colorState}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../../assets/scss/1-settings/css-properties/font-size/major-second';
@use '../../../assets/scss/1-settings/css-properties/colors/main';
@use '../../../assets/scss/2-tools/functions/convertions/pixels';
@use '../../../assets/scss/2-tools/mixins/css-properties/margin';
@use '../../../assets/scss/2-tools/mixins/css-properties/all-properties';

// prettier-ignore
.switch {
  @include all-properties.init((
      xsm: (
          display: flex,
          flex-direction: column
      ),
      230: (
          flex-direction: row,
          justify-content: space-between,
          align-items: center
      )
  ));

  .switch__label {
    font-weight: 600;
    font-size: pixels.toRem(map.get(major-second.$scale, 3));
    @include margin.bottom((
        xsm: 7,
        230: 0
    ));
  }

  input[type="radio"],
  input[type="checkbox"] {
    &:active {
      ~ label::before {
        width: 70%;
      }
    }

    &:checked {
      ~ label::before {
        transform: translate(-100%, -50%);
        left: calc(100% - .3rem);
      }
    }
  }

  &__wrapper {
    display: flex;
  }

  label{
    display: block;
    position: relative;
    width: 50px;
    height: 25px;
    border-radius: 99rem;
    cursor: pointer;
    border: none;
    padding: pixels.toRem(3);
    transition: all .25s ease;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 3px;
      transform: translateY(-50%);
      border-radius: 99rem;
      width: 20px;
      height: 20px;
      background-color: white;
      transition: all .25s ease;
    }
  }

  &.focus {
    .switch__label {
      color: map.get(main.$primary, 900);
    }

    input[type="checkbox"],
    input[type="radio"] {
      &:checked {
        ~ label {
          background-color: map.get(main.$primary, 600);
          &:hover{
            background-color: darken(map.get(main.$primary, 600), 3%);
          }
        }
      }
    }

    label {
      background-color: map.get(main.$primary, 300);
      &:hover{
        background-color: darken(map.get(main.$primary, 300), 10%);
      }
    }
  }


}
</style>
