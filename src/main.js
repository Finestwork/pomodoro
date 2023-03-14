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
initializeApp({
  apiKey: 'AIzaSyDDo6-6YDQxMu4ESIdfPNMVag5mMcNT8ac',
  authDomain: 'pomotasker-app.firebaseapp.com',
  projectId: 'pomotasker-app',
  storageBucket: 'pomotasker-app.appspot.com',
  messagingSenderId: '860162131029',
  appId: '1:860162131029:web:c14e28504a6abc52c8c0dc'
});

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
