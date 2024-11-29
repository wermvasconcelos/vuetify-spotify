<template>
  <v-app-bar color="primary" dark v-if="dataUser">
    <v-app-bar-title>
      <v-icon left>mdi-spotify</v-icon> Vuetify Spotify
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-avatar size="40">
        <img :src="dataUser.images?.[0]?.url || defaultAvatar" alt="Imagem do usuário" class="avatar-img" />
      </v-avatar>
    </v-btn>
    <span class="user-name">{{ dataUser.display_name }}</span>
  </v-app-bar>

  <v-container v-if="topTracks.length">
    <h2>Top 5 Tracks</h2>
    <v-list>
      <!-- Remover v-list-item-group se não for necessário para agrupamento -->
      <v-list-item v-for="track in topTracks" :key="track.id">
        <v-list-item-content>
          <v-list-item-title>{{ track.name }}</v-list-item-title>
          <!-- Verificar se track.artists é um array de objetos corretamente -->
          <v-list-item-subtitle>{{ track.artists.map(artist => artist.name).join(', ') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const token = ref<string | null>(null);
const dataUser = ref<Record<string, any> | null>(null);
const topTracks = ref<Track[]>([]); // Tipando topTracks como um array de Track
const defaultAvatar = 'https://i.pinimg.com/236x/ff/ec/3b/ffec3b2283def1d5bd1cc089108b8df8.jpg';

// Definindo as interfaces para tipagem
interface Artist {
  name: string;
}

interface Track {
  id: string;
  name: string;
  artists: Artist[]; // Array de artistas
}

onMounted(() => {
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get('code');

  // Verifica se o token já está salvo
  const storedToken = localStorage.getItem('spotify_token');
  if (storedToken) {
    token.value = storedToken;
    getDataUser(storedToken);
  } else if (code) {
    console.log('Código recebido:', code);
    getAccessToken(code);
  } else {
    console.warn('Nenhum código ou token disponível.');
  }
});

const getAccessToken = async (code: string) => {
  const clientId = 'b1fa1e63f13447dd828daedcd729ab1d';
  // const redirectUri = 'http://localhost:3000/callback';
  const redirectUri = 'https://vuetify-spotify.vercel.app/callback';
  const codeVerifier = localStorage.getItem('code_verifier') || '';

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
        scope: 'user-top-read'
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao obter token: ' + response.statusText);
    }

    const data = await response.json();
    token.value = data.access_token;
    localStorage.setItem('spotify_token', data.access_token); // Salvar token
    getDataUser(data.access_token);
    console.log('Access Token:', data.access_token);
  } catch (error) {
    console.error('Erro ao obter token:', error);
  }
};

const getDataUser = async (token: string) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (response.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('spotify_token');
      console.warn('Token expirado. Usuário precisa fazer login novamente.');
      return;
    }

    if (!response.ok) {
      throw new Error('Erro ao obter dados do usuário: ' + response.statusText);
    }

    dataUser.value = await response.json();
    console.log('Dados do usuário:', dataUser.value);

    // Chama a função para obter as top tracks
    getTopTracks(token);
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
  }
};

const getTopTracks = async (token: string) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    topTracks.value = data.items; // Aqui estamos assumindo que 'data.items' já tem o tipo correto

    // Mapeando artistas e utilizando a tipagem correta
    const artistNames = topTracks.value.map((track) => {
      // Garantindo que o tipo de 'track' está correto
      const artist = track.artists[0]; // Primeiro artista (caso haja mais de um)
      return artist.name;
    });

    console.log('Top Artists:', artistNames);
  } catch (error) {
    console.error('Erro ao obter top tracks:', error);
  }
};
</script>

<style scoped>
.avatar-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.user-name {
  margin-left: 8px;
  margin-right: 16px;
  font-weight: bold;
  color: white;
}
</style>
