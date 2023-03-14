<template>
  <Modal
    class="chat-progress"
    :color-state="colorState"
    :show-modal="showModal"
    @onModalClose="onModalClose"
  >
    <div class="loader" v-if="canDisplayLoader">
      <span class="loader__animation" ref="animation"></span>
      <h3 class="loader__title">Currently fetching your recent activities</h3>
    </div>
    <p class="error" v-if="canDisplayError">
      Unable to fetch your recent activities, you may try again later.
    </p>
    <div ref="chart" v-if="canDisplayChart"></div>
  </Modal>
</template>
<script>
import Modal from '@/components/global/Modal.vue';
import { useStoredPomodoros } from '@/stores/pomodoro';
import PomodoroHelper from '@/assets/js/firestore/pomodoro';

// NPM
import ApexCharts from 'apexcharts';
import lottie from 'lottie-web';
import ChartAnimation from '@/assets/js/lottie/chart-blue.json';

export default {
  components: {
    Modal
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
      chart: null,
      lottie: null,
      shouldDisplayLoader: false,
      shouldDisplayChart: false,
      shouldDisplayError: false,
      storedPomodoros: useStoredPomodoros()
    };
  },
  emits: ['onModalClose'],
  methods: {
    onModalClose() {
      this.$emit('onModalClose');
    },
    initLottie() {
      this.lottie = lottie.loadAnimation({
        container: this.$refs.animation,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: ChartAnimation
      });
    },
    initChart() {
      const COLOR_STATE =
        this.colorState === 'focus'
          ? '#EB1483'
          : this.colorState === 'short-break'
          ? '#29ADC2'
          : '#6129C2';

      this.chart = new ApexCharts(this.$refs.chart, {
        colors: [COLOR_STATE],
        series: [],
        chart: {
          height: 350,
          type: 'area',
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          colors: [COLOR_STATE]
        },
        fill: {
          colors: [COLOR_STATE],
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.8,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },
        xaxis: {
          categories: [],
          axisBorder: {
            color: '#E9EEF7'
          },
          axisTicks: {
            color: '#E9EEF7'
          },
          labels: {
            show: false
          },
          crosshairs: {
            show: true,
            position: 'back',
            stroke: {
              color: COLOR_STATE,
              width: 1,
              dashArray: 4
            }
          },
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          min: 0,
          labels: {
            style: {
              colors: ['#253D65'],
              fontWeight: 600
            }
          },
          axisBorder: {
            color: '#E9EEF7'
          },
          axisTicks: {
            color: '#E9EEF7'
          }
        },
        grid: {
          borderColor: '#CFDAED',
          strokeDashArray: 3,
          yaxis: {
            lines: {
              show: true
            }
          },
          xaxis: {
            lines: {
              show: true
            }
          }
        },
        tooltip: {
          fillSeriesColor: false,
          style: {
            fontFamily: 'inherit'
          },
          formatter: function (val, opts) {
            return opts.w.globals.labels[opts.dataPointIndex] + ': ' + val;
          },
          x: {
            show: true,
            formatter: (i, opt) => {
              const CATEGORIES = opt.w.globals.categoryLabels;
              const DATE = CATEGORIES[i - 1];
              return new Date(DATE).toLocaleDateString('en', { dateStyle: 'long' });
            }
          },
          y: {
            formatter: (num) => {
              return num < 0 ? 0 : num;
            },
            title: {
              formatter: (seriesName) => seriesName
            }
          }
        }
      });
      this.chart.render();

      // Animate the chart
      const SERIES = this.storedPomodoros.getPomodoros;
      const CATEGORIES = this.storedPomodoros.getDates;

      this.chart.updateOptions({
        xaxis: {
          categories: CATEGORIES
        }
      });
      this.chart.updateSeries([{ name: 'pomodoros', data: SERIES }]);
    }
  },
  computed: {
    canDisplayLoader() {
      return this.shouldDisplayLoader && !this.shouldDisplayChart && !this.shouldDisplayError;
    },
    canDisplayChart() {
      return !this.shouldDisplayLoader && this.shouldDisplayChart && !this.shouldDisplayError;
    },
    canDisplayError() {
      return !this.shouldDisplayLoader && !this.shouldDisplayChart && this.shouldDisplayError;
    }
  },
  watch: {
    showModal(showModal) {
      if (showModal) {
        // If pomodoro activity is not yet stored in pinia
        if (!this.storedPomodoros.hasPomodoros) {
          this.shouldDisplayLoader = true;
          this.$nextTick(() => {
            if (this.lottie === null) this.initLottie();
          });
          PomodoroHelper.getAll()
            .then((res) => {
              // To avoid content jumping
              setTimeout(() => {
                this.shouldDisplayLoader = false;
                this.shouldDisplayChart = true;
                this.storedPomodoros.storeCloudPomodoros(res.docs);
                this.$nextTick(() => this.initChart());
              }, 750);
            })
            .catch(() => {
              this.shouldDisplayLoader = false;
              this.shouldDisplayError = true;
            });
          return;
        }

        // If activity is already stored in pinia but chart is not yet initialized
        this.shouldDisplayChart = true;
        this.$nextTick(() => this.initChart());
        return;
      }

      // Destroy chart if model will be hidden so that new data will be displayed again
      if (this.chart !== null) this.chart.destroy();
    }
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../assets/scss/1-settings/css-properties/font-size/major-second';
@use '../../assets/scss/1-settings/css-properties/colors/text';
@use '../../assets/scss/2-tools/mixins/css-properties/padding';
@use '../../assets/scss/2-tools/mixins/css-properties/font-size';
@use '../../assets/scss/2-tools/mixins/css-properties/margin';

// prettier-ignore
.chat-progress {
  :deep(.modal__container) {
    width: 95%;
    max-width: 1000px;
    @include padding.all-sides((
        xsm: 15
    ));
  }
}

// prettier-ignore
.loader{
  @include margin.vertical((
    xsm: 25
  ));
  &__animation{
    display: flex;
    width: 150px;
    margin-left: auto;
    margin-right: auto;
  }
  &__title{
    font-weight: 600;
    text-align: center;
    color: map.get(text.$main, 900);
    @include font-size.responsive((
      xsm: map.get(major-second.$scale, 4)
    ));
  }
}

// prettier-ignore
.error{
  font-weight: 600;
  text-align: center;
  color: map.get(text.$main, 900);
  @include margin.vertical((
    xsm: 10
  ));
  @include font-size.responsive((
    xsm: map.get(major-second.$scale, 3)
  ));
}
</style>
