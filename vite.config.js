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

      server.middlewares.use('/api/upload-project-image', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { filename, dataUrl } = JSON.parse(body);
              const matches = /^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/.exec(dataUrl || '');
              if (!matches) {
                throw new Error('Invalid image dataUrl');
              }
              const buffer = Buffer.from(matches[2], 'base64');
              const safeName = (filename || 'image.png')
                .replace(/[^a-zA-Z0-9._-]/g, '_')
                .toLowerCase();
              const finalName = `${Date.now()}-${safeName}`;
              const uploadDir = path.resolve(__dirname, 'public/projects');
              if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
              }
              fs.writeFileSync(path.join(uploadDir, finalName), buffer);

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, url: `./projects/${finalName}` }));
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
