import FIREBASE_CONFIG from '../firebase.config.json';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { initializeApp } from 'firebase/app';
import FloatingVue from 'floating-vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import 'floating-vue/dist/style.css';
import 'nprogress/nprogress.css';

// Initialize Firebase
initializeApp(FIREBASE_CONFIG);

createApp(App)
  .use(router)
  .use(createPinia())
  .use(FloatingVue)
  .use(Toast, {
    transition: 'Vue-Toastification__bounce',
    maxToasts: 8,
    newestOnTop: true
  })
  .mount('body');
