<template>
    <v-container>
      <h1>Callback</h1>
      <p>Processando login...</p>
    </v-container>
  </template>
  
  <script lang="ts" setup>
  import { onMounted } from 'vue';
  
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
    const redirectUri = 'http://localhost:3000/callback';
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
      console.log('Access Token:', data.access_token);
    } catch (error) {
      console.error('Erro ao obter token:', error);
    }
  };
  </script>
  