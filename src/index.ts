/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// Synthwave Lorem Ipsum Generator - Cloudflare Worker (TypeScript)

interface Env {
  // Define any environment variables here if needed
}

interface WordBank {
  nouns: string[];
  adjectives: string[];
  verbs: string[];
  tech: string[];
}

interface GeneratedResponse {
  paragraphs: string[];
  count: number;
  sentences_per_paragraph: number;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Handle different endpoints
    if (url.pathname === '/api/generate') {
      return handleGenerate(request);
    } else if (url.pathname === '/sitemap.xml') {
      return handleSitemap(request);
    } else if (url.pathname === '/favicon.ico' || url.pathname === '/favicon.svg') {
      return handleFavicon(request);
    } else if (url.pathname === '/robots.txt') {
      return handleRobots(request);
    } else if (url.pathname === '/') {
      return new Response(getHTML(), {
        headers: { 'Content-Type': 'text/html' }
      });
    } else {
      return new Response('Not found', { status: 404 });
    }
  }
};

// Synthwave-themed word banks
const synthwaveWords: WordBank = {
  nouns: [
    'synthesizer', 'neon', 'chrome', 'laser', 'grid', 'circuit', 'matrix', 'vector',
    'pixel', 'hologram', 'scanner', 'terminal', 'interface', 'plasma', 'voltage',
    'frequency', 'wavelength', 'binary', 'datastream', 'mainframe', 'cyberdeck',
    'retrofit', 'outrun', 'arcade', 'cassette', 'VHS', 'monitor', 'dashboard',
    'vibes', 'aesthetic', 'nightdrive', 'sunset', 'cityscape', 'skyline',
    'highway', 'boulevard', 'avenue', 'corridor', 'dimension', 'reality',
    'simulation', 'algorithm', 'protocol', 'sequence', 'module', 'system',
    'moonlight', 'dreamscape', 'retrowave', 'nightclub', 'console', 'joystick',
    'soundscape', 'waveform', 'spectrum', 'signal', 'drive', 'tape', 'diskette',
    'cyberspace', 'avatar', 'sunglasses', 'nightfall', 'starlight', 'hyperdrive',
    'overdrive', 'transistor', 'resistor', 'datapath', 'bytecode', 'sidelane',
    'nightowl', 'afterglow', 'midnight', 'pulse', 'echo', 'reflection', 'mirrorball',
    'starlane', 'nightshade', 'dreamwave', 'retrosynth', 'neonlight', 'glitch',
    'sideload', 'uplink', 'downlink', 'modem', 'databank',
    'synthpad', 'darkwave', 'cyberpunk', 'neonscape', 'retrograde', 'timeloop',
    'flashback', 'synthwave', 'laserbeam', 'holodeck', 'datacore', 'mainboard',
    'synthesizer', 'oscillator', 'arpeggiator', 'reverb', 'chorus', 'delay',
    'nighttime', 'sunrise', 'neonfall', 'citylight', 'streetlamp', 'billboard',
    'nexus', 'vertex', 'polygon', 'wireframe', 'framebuffer', 'rasterizer',
    'cybernaut', 'technomancer', 'datajockey', 'netrunner', 'codebreaker',
    'dreamstate', 'mindscape', 'voidspace', 'hyperlink', 'bandwidth', 'firewall', 'New Cydonia'
  ],
  adjectives: [
    'electric', 'digital', 'synthetic', 'neon', 'chrome', 'metallic', 'holographic',
    'pixelated', 'retro', 'futuristic', 'cybernetic', 'virtual', 'analog',
    'magnetic', 'sonic', 'cosmic', 'stellar', 'lunar', 'solar', 'plasma',
    'crystalline', 'fluorescent', 'iridescent', 'luminous', 'radiant',
    'pulsing', 'streaming', 'flowing', 'cascading', 'infinite', 'eternal',
    'temporal', 'dimensional', 'parallel', 'quantum', 'atomic', 'molecular',
    'kinetic', 'dynamic', 'ultra', 'mega', 'hyper', 'super', 'turbo',
    'glowing', 'shimmering', 'vaporized', 'nocturnal', 'dreamy', 'hypnotic',
    'surreal', 'vivid', 'prismatic', 'translucent', 'blazing', 'burning',
    'twilight', 'midnight', 'galactic', 'celestial', 'astral', 'psychedelic',
    'vaporwave', 'retrograde', 'chromatic', 'glitchy', 'fragmented', 'fragmentary',
    'fragmental','cybernetic', 'futuristic', 'dystopian', 'utopian', 'techno', 'synthethic',
    'recursive', 'iterative', 'procedural', 'algorithmic', 'geometric', 'angular',
    'curved', 'smooth', 'rough', 'textured', 'glossy', 'matte', 'reflective',
    'transparent', 'opaque', 'saturated', 'desaturated', 'vibrant', 'muted',
    'intense', 'subtle', 'bold', 'delicate', 'harsh', 'soft', 'sharp', 'blurred',
    'focused', 'distorted', 'compressed', 'expanded', 'accelerated', 'decelerated',
    'elevated', 'submerged', 'suspended', 'grounded', 'wireless', 'hardwired'
  ],
  verbs: [
    'synthesize', 'generate', 'transmit', 'broadcast', 'stream', 'process',
    'compute', 'calculate', 'render', 'display', 'project', 'emit', 'pulse',
    'flow', 'cascade', 'surge', 'accelerate', 'boost', 'amplify', 'enhance',
    'upgrade', 'optimize', 'calibrate', 'synchronize', 'harmonize', 'resonate',
    'vibrate', 'oscillate', 'fluctuate', 'modulate', 'transform', 'convert',
    'decode', 'encode', 'encrypt', 'decrypt', 'compile', 'execute', 'run',
    'initialize', 'activate', 'engage', 'override', 'bypass', 'hack',
    'illuminate', 'glow', 'reflect', 'mirror', 'scan', 'uplink', 'download',
    'upload', 'rewind', 'fastforward', 'loop', 'cycle', 'reboot', 'powerup',
    'shutdown', 'boot', 'simulate', 'replicate', 'duplicate', 'fragment',
    'glitch', 'distort', 'warp', 'bend', 'shift', 'phase', 'drift', 'slide',
    'fade', 'spark', 'ignite', 'charge', 'flash', 'blink', 'flicker',
    'vaporize', 'dream', 'navigate', 'drive','teleport', 'materialize', 'dematerialize', 'digitize', 'analogize', 'pixelate',
    'rasterize', 'vectorize', 'compress', 'decompress', 'buffer', 'cache',
    'refresh', 'reload', 'restart', 'hibernate', 'suspend', 'resume',
    'interface', 'connect', 'disconnect', 'sync', 'desync', 'patch',
    'update', 'rollback', 'merge', 'branch', 'fork', 'clone',
    'authenticate', 'authorize', 'validate', 'verify', 'confirm', 'deny',
    'escalate', 'throttle', 'saturate', 'desaturate', 'intensify', 'diminish'
  ],
  tech: [
    'CPU', 'GPU', 'RAM', 'ROM', 'SSD', 'HDD', 'USB', 'VGA', 'HDMI', 'LCD',
    'LED', 'OLED', 'CRT', 'DOS', 'GUI', 'API', 'URL', 'HTTP', 'TCP', 'IP',
    'WiFi', 'LAN', 'WAN', 'VPN', 'DNS', 'SSL', 'FTP', 'SSH', 'SQL', 'XML',
    'JSON', 'HTML', 'CSS', 'JS', 'PHP', 'C++', 'Python', 'Java', 'Ruby',
    'BASIC', 'Pascal', 'Perl', 'Fortran', 'COBOL', 'ZX Spectrum', 'Amiga',
    'Commodore', 'Atari', 'MSX', 'Floppy', 'TapeDrive', 'EPROM',
    'EEPROM', 'NVRAM', 'VRAM', 'SRAM', 'DRAM', 'DDR', 'PCIe', 'SATA',
    'IDE', 'SCSI', 'Bluetooth', 'NFC', 'RFID', 'QR', 'ASCII', 'UTF-8',
    'Base64', 'SHA-256', 'MD5', 'AES', 'RSA', 'TLS', 'IPv6', 'UDP',
    'SMTP', 'POP3', 'IMAP', 'MQTT', 'REST', 'SOAP', 'GraphQL', 'WebRTC',
    'WebGL', 'Canvas', 'SVG', 'PNG', 'JPEG', 'GIF', 'MP3', 'WAV',
    'MIDI', 'VST', 'DAW', 'EQ', 'LFO', 'ADSR', 'BPM', 'Hz',
    'dB', 'MHz', 'GHz', 'TB', 'GB', 'MB', 'KB'
  ]
};

// Generate random synthwave sentence
function generateSentence(): string {
  const patterns: (() => string)[] = [
    () => `${randomChoice(synthwaveWords.adjectives)} ${randomChoice(synthwaveWords.nouns)} ${randomChoice(synthwaveWords.verbs)} ${randomChoice(synthwaveWords.tech)}`,
    () => `${randomChoice(synthwaveWords.tech)} ${randomChoice(synthwaveWords.verbs)} ${randomChoice(synthwaveWords.adjectives)} ${randomChoice(synthwaveWords.nouns)}`,
    () => `${randomChoice(synthwaveWords.nouns)} ${randomChoice(synthwaveWords.verbs)} through ${randomChoice(synthwaveWords.adjectives)} ${randomChoice(synthwaveWords.tech)}`,
    () => `${randomChoice(synthwaveWords.adjectives)} ${randomChoice(synthwaveWords.adjectives)} ${randomChoice(synthwaveWords.nouns)} ${randomChoice(synthwaveWords.verbs)}`,
    () => `${randomChoice(synthwaveWords.verbs)} ${randomChoice(synthwaveWords.nouns)} via ${randomChoice(synthwaveWords.tech)} ${randomChoice(synthwaveWords.adjectives)}`,
  ];

  return capitalize(randomChoice(patterns)());
}

// Generate paragraph
function generateParagraph(sentences: number = 5): string {
  const sentenceArray: string[] = [];
  for (let i = 0; i < sentences; i++) {
    sentenceArray.push(generateSentence());
  }
  return sentenceArray.join('. ') + '.';
}

// Utility functions
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Handle API requests
async function handleGenerate(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const paragraphs: number = Math.min(Math.max(parseInt(url.searchParams.get('paragraphs') || '3'), 1), 10);
  const sentences: number = Math.min(Math.max(parseInt(url.searchParams.get('sentences') || '5'), 1), 10);
  const format: string = url.searchParams.get('format') || 'text';

  // Validate format
  if (!['text', 'html', 'json'].includes(format)) {
    return new Response('Invalid format. Use: text, html, or json', { status: 400 });
  }

  const generatedText: string[] = [];
  for (let i = 0; i < paragraphs; i++) {
    generatedText.push(generateParagraph(sentences));
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (format === 'json') {
    const response: GeneratedResponse = {
      paragraphs: generatedText,
      count: paragraphs,
      sentences_per_paragraph: sentences
    };
    return new Response(JSON.stringify(response), {
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  } else if (format === 'html') {
    const htmlParagraphs: string = generatedText.map(p => `<p>${p}</p>`).join('\n');
    return new Response(htmlParagraphs, {
      headers: { ...headers, 'Content-Type': 'text/html' }
    });
  } else {
    return new Response(generatedText.join('\n\n'), {
      headers: { ...headers, 'Content-Type': 'text/plain' }
    });
  }
}

// Handle sitemap.xml requests
async function handleSitemap(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const sitemap = generateSitemap(baseUrl);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}

// Generate sitemap.xml content
function generateSitemap(baseUrl: string): string {
  const currentDate = new Date().toISOString().split('T')[0]; // Just date, no time

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>${escapeXml(baseUrl)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${escapeXml(baseUrl)}/api/generate</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
}

// Add XML escaping function
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';

  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Handle favicon requests
async function handleFavicon(request: Request): Promise<Response> {
  // Generate a synthwave-themed SVG favicon
  const faviconSvg = generateFaviconSvg();

  return new Response(faviconSvg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
    }
  });
}

// Generate synthwave-themed SVG favicon
function generateFaviconSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff00ff;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#00ffff;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="grid" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#00ffff;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#ff00ff;stop-opacity:0.8" />
      </linearGradient>
      <pattern id="gridPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
        <path d="M 4 0 L 0 0 0 4" fill="none" stroke="url(#grid)" stroke-width="0.5" opacity="0.6"/>
      </pattern>
    </defs>

    <!-- Background -->
    <rect width="32" height="32" fill="#000"/>

    <!-- Grid pattern -->
    <rect width="32" height="32" fill="url(#gridPattern)"/>

    <!-- Synthwave mountains -->
    <polygon points="0,24 8,16 16,20 24,12 32,16 32,32 0,32" fill="url(#bg)" opacity="0.8"/>

    <!-- Neon glow effect -->
    <polygon points="0,24 8,16 16,20 24,12 32,16 32,32 0,32" fill="none" stroke="#00ffff" stroke-width="0.5" opacity="0.9"/>

    <!-- Retro sun -->
    <circle cx="24" cy="8" r="3" fill="none" stroke="#ff00ff" stroke-width="1" opacity="0.9"/>
    <circle cx="24" cy="8" r="2" fill="none" stroke="#ff00ff" stroke-width="0.5" opacity="0.7"/>
    <circle cx="24" cy="8" r="1" fill="#ff00ff" opacity="0.8"/>
  </svg>`;
}

// HTML Interface
function getHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P8XDLHLV');</script>
<!-- End Google Tag Manager -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Synthwave Lorem Ipsum Generator</title>
    <meta name="description" content="Generate retro-futuristic synthwave-themed placeholder text for your projects. Perfect for 80s-inspired designs and cyberpunk aesthetics.">
    <link rel="sitemap" type="application/xml" href="/sitemap.xml">
    <link rel="icon" type="image/svg+xml" href="/favicon.ico">
    <link rel="shortcut icon" type="image/svg+xml" href="/favicon.ico">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Orbitron', monospace;
            background: linear-gradient(135deg, #0c0c0c 0%, #1a0033 50%, #000 100%);
            color: #00ffff;
            min-height: 100vh;
            overflow-x: hidden;
        }

        .grid-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image:
                linear-gradient(cyan 1px, transparent 1px),
                linear-gradient(90deg, cyan 1px, transparent 1px);
            background-size: 50px 50px;
            opacity: 0.1;
            z-index: -1;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 50px 20px 20px 20px;
            position: relative;
            z-index: 1;
        }

        h1 {
            text-align: center;
            font-size: 3rem;
            font-weight: 900;
            margin-bottom: 10px;
            text-shadow: 0 0 20px #00ffff, 0 0 40px #ff00ff;
            animation: pulse 2s infinite;
        }

        .subtitle {
            text-align: center;
            font-size: 1.2rem;
            margin-bottom: 40px;
            color: #ff00ff;
            text-shadow: 0 0 10px #ff00ff;
        }

        .controls {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }

        .control-group {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        label {
            margin-bottom: 5px;
            font-weight: 700;
            color: #00ffff;
            text-shadow: 0 0 5px #00ffff;
        }

        input, select {
            padding: 10px;
            border: 2px solid #00ffff;
            background: rgba(0, 0, 0, 0.8);
            color: #00ffff;
            border-radius: 5px;
            font-family: 'Orbitron', monospace;
            font-weight: 700;
        }

        input:focus, select:focus {
            outline: none;
            box-shadow: 0 0 15px #00ffff;
            background: rgba(0, 0, 0, 0.9);
        }

        /* Style dropdown options specifically */
        select option {
            background: #000;
            color: #00ffff;
            border: none;
            padding: 10px;
        }

        select option:hover,
        select option:focus {
            background: #1a0033;
            color: #ff00ff;
        }

        button {
            padding: 15px 30px;
            font-size: 1.2rem;
            font-weight: 700;
            background: linear-gradient(45deg, #ff00ff, #00ffff);
            color: #000;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: 'Orbitron', monospace;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(255, 0, 255, 0.3);
        }

        .output {
            background: rgba(0, 255, 255, 0.05);
            border: 2px solid #00ffff;
            border-radius: 10px;
            padding: 30px;
            margin-top: 30px;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
            backdrop-filter: blur(10px);
        }

        .output p {
            margin-bottom: 20px;
            line-height: 1.6;
            font-size: 1.1rem;
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
        }

        .copy-btn {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 1rem;
            background: linear-gradient(45deg, #00ffff, #ff00ff);
        }

        @keyframes pulse {
            0%, 100% { text-shadow: 0 0 20px #00ffff, 0 0 40px #ff00ff; }
            50% { text-shadow: 0 0 30px #00ffff, 0 0 60px #ff00ff; }
        }

        .api-info {
            margin-top: 40px;
            padding: 20px;
            background: rgba(255, 0, 255, 0.1);
            border: 2px solid #ff00ff;
            border-radius: 10px;
            line-height: 1.5;
        }

        .api-info h3 {
            color: #ff00ff;
            margin-bottom: 15px;
            text-shadow: 0 0 10px #ff00ff;
        }

        .api-info code {
            background: rgba(0, 0, 0, 0.5);
            padding: 2px 5px;
            border-radius: 3px;
            color: #00ffff;
        }

        .api-info ul {
            margin-left: 20px;
        }

        .community-info {
            margin-top: 40px;
            padding: 20px;
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid #00ffff;
            border-radius: 10px;
            line-height: 1.5;
        }

        .community-info h3 {
            color: #00ffff;
            margin-bottom: 15px;
            text-shadow: 0 0 10px #00ffff;
        }

        .community-info h3::before {
            content: "🌆";
            font-size: 1.5em;
            margin-right: 10px;
        }

        .community-info p {
            margin-bottom: 10px;
        }

        .community-info ul {
            margin-left: 20px;
            margin-bottom: 10px;
        }

        .community-info a {
            color: #ff00ff;
            text-decoration: none;
            font-weight: 700;
            transition: all 0.3s ease;
        }

        .community-info a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P8XDLHLV"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

    <div class="grid-bg"></div>
    <div class="container">
        <h1>SYNTHWAVE LOREM</h1>
        <p class="subtitle">Generate retro-futuristic placeholder text</p>

        <div class="controls">
            <div class="control-group">
                <label for="paragraphs">Paragraphs:</label>
                <input type="number" id="paragraphs" min="1" max="10" value="3">
            </div>
            <div class="control-group">
                <label for="sentences">Sentences per paragraph:</label>
                <input type="number" id="sentences" min="1" max="10" value="5">
            </div>
            <div class="control-group">
                <label for="format">Output format:</label>
                <select id="format">
                    <option value="text">Plain Text</option>
                    <option value="html">HTML</option>
                    <option value="json">JSON</option>
                </select>
            </div>
        </div>

        <div style="text-align: center;">
            <button onclick="generateText()">GENERATE SYNTHWAVE TEXT</button>
        </div>

        <div id="output" class="output" style="display: none;">
            <div id="generated-text"></div>
            <button class="copy-btn" onclick="copyToClipboard()">COPY TO CLIPBOARD</button>
        </div>

        <div class="api-info">
            <h3>API Endpoints:</h3>
            <p><strong>Generate text:</strong> <code>GET /api/generate?paragraphs=3&sentences=5&format=text</code></p>
            <p><strong>Parameters:</strong></p>
            <ul>
                <li><code>paragraphs</code> - Number of paragraphs (1-10)</li>
                <li><code>sentences</code> - Sentences per paragraph (1-10)</li>
                <li><code>format</code> - Output format: text, html, or json</li>
            </ul>
        </div>

        <div class="community-info">
            <h3>Join the Synthwave Revolution!</h3>
            <p>This generator is <strong>open source</strong> and powered by the community! Found a bug? Have an awesome idea? Want to add more radical synthwave words? We'd love to hear from you! ⚡</p>

            <p><strong>💫 Ways to contribute:</strong></p>
            <ul>
                <li>🐛 <strong>Report bugs</strong> - Help us squash those glitches in the matrix!</li>
                <li>💡 <strong>Suggest features</strong> - Got ideas to make this even more electric?</li>
                <li>🌈 <strong>Add new words</strong> - Help expand our synthwave vocabulary!</li>
                <li>🚀 <strong>Fork & customize</strong> - Make your own version of the generator!</li>
                <li>⭐ <strong>Star the repo</strong> - Show some love for the project!</li>
            </ul>

            <p style="text-align: center; margin-top: 20px;">
                <a href="https://github.com/StephanieF/synthwave-lorem" target="_blank" style="
                    display: inline-block;
                    padding: 12px 24px;
                    background: linear-gradient(45deg, #ff00ff, #00ffff);
                    color: #000;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                    font-family: 'Orbitron', monospace;
                ">🔥 View on GitHub 🔥</a>
            </p>

            <p style="text-align: center; margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">
                Keep the neon dreams alive! 🕶️✨
            </p>
        </div>
    </div>

    <script>
        async function generateText() {
            const paragraphs = document.getElementById('paragraphs').value;
            const sentences = document.getElementById('sentences').value;
            const format = document.getElementById('format').value;

            const response = await fetch(\`/api/generate?paragraphs=\${paragraphs}&sentences=\${sentences}&format=\${format}\`);
            const text = await response.text();

            const output = document.getElementById('output');
            const generatedText = document.getElementById('generated-text');

            if (format === 'html') {
                generatedText.innerHTML = text;
            } else if (format === 'json') {
                generatedText.innerHTML = \`<pre>\${text}</pre>\`;
            } else {
                generatedText.innerHTML = text.split('\\n\\n').map(p => \`<p>\${p}</p>\`).join('');
            }

            output.style.display = 'block';
        }

        function copyToClipboard() {
            const text = document.getElementById('generated-text').innerText;
            navigator.clipboard.writeText(text).then(() => {
                alert('Text copied to clipboard!');
            });
        }
    </script>
</body>
</html>`;
}

// Handle robots.txt requests
async function handleRobots(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const robots = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}