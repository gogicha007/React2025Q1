import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { config } from 'dotenv';

config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });

const baseURL = process.env.VITE_BASE_URL;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: baseURL,
});
