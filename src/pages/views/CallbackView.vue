<template>
  <v-app>
    <v-container v-if="dataUser">
      <img :src="dataUser.images[0].url" alt="Imagem do usuário" />
      <br>
      País: {{ dataUser.country }}
      <br>
      Nome: {{ dataUser.display_name }}
      <br>
      Email: {{ dataUser.email }}
      <br>
      <a :href="dataUser.external_urls.spotify">Ir para o Spotify</a>
      <br>
      Tipo de conta: {{ dataUser.product }}
    </v-container>
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const token = ref();
const dataUser = ref();

onMounted(() => {
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get('code');

  if (code) {
    console.log('Código recebido:', code);
    // Chame a função para trocar o código pelo token de acesso
    getAccessToken(code);
  }
});

const getAccessToken = async (code: string) => {
  const clientId = 'b1fa1e63f13447dd828daedcd729ab1d';
  const redirectUri = 'https://vuetify-spotify.vercel.app/callback';
  // const redirectUri = 'http://localhost:3000/callback';
  const codeVerifier = localStorage.getItem('code_verifier') || '';

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    const data = await response.json();
    token.value = data.access_token;
    getDataUser(token.value);
    console.log('Access Token:', data.access_token);
  } catch (error) {
    console.error('Erro ao obter token:', error);
  }
};

const getDataUser = async (token: string) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();
    dataUser.value = data;
    console.log('Data user:', data);
  } catch (error) {
    console.error('Erro ao obter token:', error);
  }
}
</script>