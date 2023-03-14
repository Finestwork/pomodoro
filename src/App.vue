<template>
  <router-view />
</template>

<style lang="scss">
@use 'sass:map';
@use 'assets/scss/1-settings/css-properties/font-family/roboto-flex';
@use 'assets/scss/1-settings/css-properties/font-size/major-second';
@use 'assets/scss/1-settings/css-properties/colors/main';
@use 'assets/scss/2-tools/functions/convertions/pixels';
@use 'assets/scss/3-generics/normalize';
@use 'assets/scss/3-generics/reset-space';
@use 'assets/scss/3-generics/reset-form-fields';

html {
  font-size: 62.5%; // 10px of 16px
  box-sizing: border-box;
}

body {
  font-family: roboto-flex.$full-support;
  position: relative;
  font-size: 1.6rem; // 16px in rem
  overflow-x: hidden;
  width: 100%;
  height: 100vh;

  // To increase specificity
  .btn-tooltip.v-popper--theme-tooltip {
    font-weight: 600;
    font-size: pixels.toRem(map.get(major-second.$scale, 2));
    max-width: 250px;
    line-height: 1.5;

    &.v-popper__popper--show-from {
      .v-popper__wrapper {
        transform: translateY(4px);
      }
    }

    &.v-popper__popper--show-to {
      .v-popper__wrapper {
        transform: none;
        transition: transform 0.15s ease;
      }
    }
  }

  #nprogress .bar {
    box-shadow: rgba(240, 81, 164, 0.2) 0px 0px 3px 3px;
    background-color: #f50080;
  }

  .Vue-Toastification__toast {
    min-width: auto;
    width: 100%;
    max-width: 500px;
    align-items: center;
    min-height: 0;
    padding: pixels.toRem(15) pixels.toRem(15);

    .Vue-Toastification__icon {
      margin-right: pixels.toRem(8);
      width: 16px;
    }
    .Vue-Toastification__toast-body {
      font-weight: 500;
      font-family: inherit;
      font-size: pixels.toRem(map.get(major-second.$scale, 4));
    }
    .Vue-Toastification__progress-bar {
      bottom: -1px;
    }
  }
}

main {
  display: flex;
  flex-direction: column;
  h2 {
    margin-bottom: 1rem;
  }
}

.focus {
  .btn-tooltip.v-popper--theme-tooltip {
    .v-popper__inner {
      background: map.get(main.$primary, 500);
    }

    .v-popper__arrow-outer,
    .v-popper__arrow-inner {
      border-color: map.get(main.$primary, 500);
    }
  }
}
.short-break {
  .btn-tooltip.v-popper--theme-tooltip {
    .v-popper__inner {
      background: map.get(main.$secondary, 500);
    }

    .v-popper__arrow-outer,
    .v-popper__arrow-inner {
      border-color: map.get(main.$secondary, 500);
    }
  }
}
.long-break {
  .btn-tooltip.v-popper--theme-tooltip {
    .v-popper__inner {
      background: map.get(main.$tertiary, 500);
    }

    .v-popper__arrow-outer,
    .v-popper__arrow-inner {
      border-color: map.get(main.$tertiary, 500);
    }
  }
}
</style>
