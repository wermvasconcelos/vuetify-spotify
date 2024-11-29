<template>
  <v-container>
    <h1>Home</h1>
    <v-btn @click="loginSpotify">Logar com Spotify</v-btn>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const clientId = 'b1fa1e63f13447dd828daedcd729ab1d';
// const redirectUri = 'http://localhost:3000/callback';
const redirectUri = 'https://vuetify-spotify.vercel.app/callback';
const scopes = ['user-read-private', 'user-read-email', 'playlist-read-private', 'user-top-read'];

let codeVerifier = ref('');

const generateCodeVerifier = () => {
  const array = new Uint8Array(128);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .substring(0, 128);
};

const generateCodeChallenge = async (verifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const loginSpotify = async () => {
  codeVerifier.value = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier.value);
  localStorage.setItem('code_verifier', codeVerifier.value);

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
  window.location.href = authUrl;
};
</script>
