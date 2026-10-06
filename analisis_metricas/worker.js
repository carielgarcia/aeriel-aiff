// Entrada del Worker de aeriel.net: solo atiende /api/uso y /api/metricas; todo lo demás lo sirven los assets.
import { onRequestPost as uso } from './api/uso.js';
import { onRequestGet as metricas } from './api/metricas.js';

const no = (permitido) => new Response(null, { status: 405, headers: { allow: permitido } });

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/uso') return request.method === 'POST' ? uso({ request, env }) : no('POST');
    if (pathname === '/api/metricas') return request.method === 'GET' ? metricas({ request, env }) : no('GET');
    return env.ASSETS.fetch(request);
  }
};
