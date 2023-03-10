import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { initializeApp } from 'firebase/app';
import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';
import 'nprogress/nprogress.css';

const firebaseConfig = {
  apiKey: 'AIzaSyCuoGNaLWyct6-U9sNy9pSKJ_2lBaEFQuw',
  authDomain: 'pomofocus-app.firebaseapp.com',
  projectId: 'pomofocus-app',
  storageBucket: 'pomofocus-app.appspot.com',
  messagingSenderId: '1035010712294',
  appId: '1:1035010712294:web:930a19fc52d1e79b191127',
  measurementId: 'G-DL6ZKE4MYN'
};

// Initialize Firebase
initializeApp(firebaseConfig);

createApp(App).use(router).use(createPinia()).use(FloatingVue).mount('body');
