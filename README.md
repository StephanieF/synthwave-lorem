# 🌆 Synthwave Lorem Ipsum Generator

> *Generate retro-futuristic placeholder text that's absolutely electric* ⚡

Welcome to the most radical lorem ipsum generator in cyberspace! This synthwave-themed text generator creates placeholder content that's perfect for your 80s-inspired designs, cyberpunk projects, and neon-soaked websites.

## ✨ What makes it special?

- 🎵 **Synthwave vocabulary** - Words like "neon", "cyberdeck", "retrowave", and "hologram"
- 🚀 **Multiple formats** - Plain text, HTML, or JSON output
- 🌈 **API endpoints** - Integrate directly into your projects
- 🎮 **Retro aesthetic** - Built with that authentic 80s vibe
- ⚡ **Cloudflare Workers** - Lightning-fast generation

## 🚀 Usage

Visit the live generator at: **[Your deployed URL here]**

Or use the API directly:
```
GET /api/generate?paragraphs=3&sentences=5&format=text
```

Parameters:
- `paragraphs` (1-10) - Number of paragraphs
- `sentences` (1-10) - Sentences per paragraph
- `format` - Output format: `text`, `html`, or `json`

## 🛠️ Development

This project runs on Cloudflare Workers and needs the Wrangler CLI to power up your dev environment! 🚀

### 🔧 First-time setup (if you haven't installed Wrangler yet):
```bash
# Install the Wrangler CLI globally - your gateway to the edge! ⚡
npm install -g wrangler

# Login to your Cloudflare account (you'll need one for deployment)
wrangler login
```

### 💻 Getting the code running locally:
```bash
# Clone the repo
git clone https://github.com/StephanieF/synthwave-lorem.git
cd synthwave-lorem

# Install dependencies
npm install

# Start local development - time to see the magic happen! ✨
wrangler dev
```

Visit `http://localhost:8787` to see your changes in real-time! The future is now! 🌆

**Pro tip:** If you're new to Cloudflare Workers, check out their [getting started guide](https://developers.cloudflare.com/workers/) - it's the perfect primer for entering the serverless matrix! 🤖

## 🌟 Contributing

Ready to join the synthwave revolution? We'd love your help making this generator even more radical! 🕶️

### 💫 Ways to contribute:
- 🐛 **Report bugs** - Help us squash those glitches in the matrix!
- 💡 **Suggest features** - Got ideas to make this even more electric?
- 🌈 **Add new words** - Help expand our synthwave vocabulary!
- 🚀 **Fork & customize** - Make your own version of the generator!
- ⭐ **Star the repo** - Show some love for the project!

### 🔧 How to contribute:
1. **Fork the repository** to your own GitHub account
2. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-awesome-feature
   ```
3. **Make your changes** and test them locally with `wrangler dev`
4. **Commit your changes** with a clear message:
   ```bash
   git commit -m "Add awesome synthwave feature"
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature/your-awesome-feature
   ```
6. **Open a Pull Request** on the main repository

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Keep the neon dreams alive!* 🌆✨

Made with 💖 and plenty of synthwave vibes
