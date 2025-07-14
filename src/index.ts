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

    // Handle different endpoints
    if (url.pathname === '/api/generate') {
      return handleGenerate(request);
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
    'simulation', 'algorithm', 'protocol', 'sequence', 'module', 'system'
  ],
  adjectives: [
    'electric', 'digital', 'synthetic', 'neon', 'chrome', 'metallic', 'holographic',
    'pixelated', 'retro', 'futuristic', 'cybernetic', 'virtual', 'analog',
    'magnetic', 'sonic', 'cosmic', 'stellar', 'lunar', 'solar', 'plasma',
    'crystalline', 'fluorescent', 'iridescent', 'luminous', 'radiant',
    'pulsing', 'streaming', 'flowing', 'cascading', 'infinite', 'eternal',
    'temporal', 'dimensional', 'parallel', 'quantum', 'atomic', 'molecular',
    'kinetic', 'dynamic', 'ultra', 'mega', 'hyper', 'super', 'turbo'
  ],
  verbs: [
    'synthesize', 'generate', 'transmit', 'broadcast', 'stream', 'process',
    'compute', 'calculate', 'render', 'display', 'project', 'emit', 'pulse',
    'flow', 'cascade', 'surge', 'accelerate', 'boost', 'amplify', 'enhance',
    'upgrade', 'optimize', 'calibrate', 'synchronize', 'harmonize', 'resonate',
    'vibrate', 'oscillate', 'fluctuate', 'modulate', 'transform', 'convert',
    'decode', 'encode', 'encrypt', 'decrypt', 'compile', 'execute', 'run',
    'initialize', 'activate', 'engage', 'override', 'bypass', 'hack'
  ],
  tech: [
    'CPU', 'GPU', 'RAM', 'ROM', 'SSD', 'HDD', 'USB', 'VGA', 'HDMI', 'LCD',
    'LED', 'OLED', 'CRT', 'DOS', 'GUI', 'API', 'URL', 'HTTP', 'TCP', 'IP',
    'WiFi', 'LAN', 'WAN', 'VPN', 'DNS', 'SSL', 'FTP', 'SSH', 'SQL', 'XML',
    'JSON', 'HTML', 'CSS', 'JS', 'PHP', 'C++', 'Python', 'Java', 'Ruby'
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
  const paragraphs: number = parseInt(url.searchParams.get('paragraphs') || '3');
  const sentences: number = parseInt(url.searchParams.get('sentences') || '5');
  const format: string = url.searchParams.get('format') || 'text';

  const generatedText: string[] = [];
  for (let i = 0; i < paragraphs; i++) {
    generatedText.push(generateParagraph(sentences));
  }

  if (format === 'json') {
    const response: GeneratedResponse = {
      paragraphs: generatedText,
      count: paragraphs,
      sentences_per_paragraph: sentences
    };
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else if (format === 'html') {
    const htmlParagraphs: string = generatedText.map(p => `<p>${p}</p>`).join('\n');
    return new Response(htmlParagraphs, {
      headers: { 'Content-Type': 'text/html' }
    });
  } else {
    return new Response(generatedText.join('\n\n'), {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// HTML Interface
function getHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Synthwave Lorem Ipsum Generator</title>
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
            padding: 20px;
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
            background: rgba(0, 255, 255, 0.1);
            color: #00ffff;
            border-radius: 5px;
            font-family: 'Orbitron', monospace;
            font-weight: 700;
        }

        input:focus, select:focus {
            outline: none;
            box-shadow: 0 0 15px #00ffff;
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
    </style>
</head>
<body>
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