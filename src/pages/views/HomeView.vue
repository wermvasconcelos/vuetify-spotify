<template>
    <v-container>
      <h1>Home</h1>
      <v-btn @click="loginSpotify">Logar com Spotify</v-btn>
    </v-container>
  </template>
  
  <script lang="ts" setup>
  import { onMounted } from 'vue';
  import axios from 'axios';
  
  const clientId = 'b1fa1e63f13447dd828daedcd729ab1d';
  const redirectUri = 'http://localhost:3000/callback';
  const scopes = ['user-read-private', 'user-read-email', 'playlist-read-private'];
  let codeVerifier = '';
  
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
    codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem('code_verifier', codeVerifier);
  
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes.join(' '))}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
    window.location.href = authUrl;
  };
  
  const getAccessToken = async (code: string) => {
    codeVerifier = localStorage.getItem('code_verifier') || '';
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  
    console.log('Access Token Response:', response.data);
    console.log('Access Token:', response.data.access_token);
  };
  
  onMounted(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');
    if (code) {
      getAccessToken(code);
    }
  });
  </script>
  
  