import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { initializeApp } from 'firebase/app';

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
const firebaseApp = initializeApp(firebaseConfig);

createApp(App).use(router).mount('body');
