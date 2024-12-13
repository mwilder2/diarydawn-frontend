import express from 'express';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { environment } from './src/app/environments/environment';
import cors from 'cors';


export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Apply CORS middleware to allow all origins
  server.use(cors({
    origin: true, // Allow all origins
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 200 // For legacy browser support
  }));

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;


    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then(html => res.send(html))
      .catch(err => next(err));
  });

  return server;
}

function run(): void {
  const port = environment.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on: ${port}`);
  });
}

run();


// Configure CORS
// const corsOptions = {
//   origin: baseUrl,
//   optionsSuccessStatus: 200,
// };

// Use CORS middleware
// server.use(cors(corsOptions));
