import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function savePortfolioPlugin() {
  return {
    name: 'save-portfolio-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-portfolio', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const formatted = JSON.stringify(data, null, 2);

              const srcPath = path.resolve(__dirname, 'src/data/portfolioData.json');
              const publicPath = path.resolve(__dirname, 'public/data/portfolioData.json');

              fs.writeFileSync(srcPath, formatted, 'utf8');
              fs.writeFileSync(publicPath, formatted, 'utf8');

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, message: 'Saved directly to disk files' }));
            } catch (err) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), savePortfolioPlugin()],
  server: {
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
