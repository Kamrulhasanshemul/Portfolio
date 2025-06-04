# Portfolio Website

A modern portfolio website built with SvelteKit, TypeScript, and Tailwind CSS, designed to showcase your data analysis skills and projects.

## Features

- 📱 Responsive design
- 🎨 Modern UI with animations
- 🔐 Admin panel for content management
- 📊 Dynamic skills visualization
- 🚀 Fast loading with SvelteKit
- ☁️ Ready for Cloudflare Pages deployment

## Tech Stack

- **Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons
- **Deployment**: Cloudflare Pages

## Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Run the setup script (already done)
   ./setup-env.sh
   
   # Or create .env manually with:
   SESSION_SECRET=your-super-secret-key-change-in-production
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Main site: `http://localhost:5173`
   - Admin panel: `http://localhost:5173/admin`
   - Login with: admin / admin123

## Deployment to Cloudflare Pages

### Option 1: Direct Upload

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload to Cloudflare Pages**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project" → "Upload assets"
   - Upload the `.svelte-kit/cloudflare` folder
   - Set build command: `npm run build`
   - Set build output directory: `.svelte-kit/cloudflare`

### Option 2: Git Integration

1. **Push your code to GitHub/GitLab**

2. **Connect to Cloudflare Pages**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project" → "Connect to Git"
   - Select your repository

3. **Configure build settings**
   - Framework preset: SvelteKit
   - Build command: `npm run build`
   - Build output directory: `.svelte-kit/cloudflare`

4. **Set environment variables** (in Cloudflare Pages dashboard)
   ```
   SESSION_SECRET=your-super-secret-key-change-in-production
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

## Content Management

### Admin Panel

Access the admin panel at `/admin` to update:
- Hero section content
- Statistics
- Skills and proficiency levels

**Note**: In the current version, content is stored in memory and will reset on deployment. For persistent storage, consider upgrading to:
- Cloudflare KV for simple key-value storage
- Cloudflare D1 for a full SQL database
- External cloud database (MongoDB Atlas, PlanetScale, etc.)

### Adding Persistent Storage

To upgrade to persistent storage, you can:

1. **Use Cloudflare KV** (recommended for simple data)
2. **Use Cloudflare D1** (for complex queries)
3. **Use external database** (for existing cloud infrastructure)

## Customization

### Updating Content

1. **Hero Section**: Edit in admin panel or modify `defaultContent` in `/api/content/+server.ts`
2. **Skills**: Add/remove skills in the admin panel
3. **Styling**: Modify Tailwind classes in component files
4. **Colors**: Update color scheme in `app.css`

### Adding New Sections

1. Create new components in `src/lib/components/`
2. Add to main page in `src/routes/+page.svelte`
3. Update types in `src/lib/types/content.ts` if needed
4. Add admin fields if content should be editable

## Security Notes

- Change default admin credentials before deployment
- Use a strong SESSION_SECRET in production
- Consider implementing rate limiting for admin endpoints
- Use HTTPS in production (Cloudflare Pages provides this automatically)

## Performance

- All images are optimized for web
- CSS is purged and minified
- JavaScript is bundled and split
- Works offline with service worker (can be enabled)

## License

MIT License - feel free to use this template for your own portfolio!

## Support

For issues or questions, please open an issue in the repository.
