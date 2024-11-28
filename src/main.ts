import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify'; // Importando o Vuetify
import { createVuetify } from 'vuetify'; // Vue 3 usa Vuetify como plugin

import 'vuetify/styles'; // Importando os estilos padrão do Vuetify

const app = createApp(App);

// Usando o Vuetify e o Vue Router
app.use(vuetify); // Instala o Vuetify no Vue
app.use(router); // Instala o Vue Router
app.mount('#app');
