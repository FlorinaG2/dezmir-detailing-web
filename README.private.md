# Dezmir Detailing - Static Website

A modern, bilingual static website for Dezmir Detailing built with pure HTML, CSS, and JavaScript. No Node.js or build tools required.

## Features

- 🌍 **Bilingual Support**: Romanian (default) and English
- 📱 **Mobile-First Design**: Fully responsive from 360px to 1440px+
- 🎨 **Dark Theme**: Custom color scheme with gold accents (#BF983A)
- ⚡ **Smooth Animations**: CSS animations and transitions
- 🖼️ **Photo Gallery**: Interactive gallery with Before/After filtering
- 🔐 **Admin Panel**: Simple password-protected image management
- ♿ **Accessibility**: WCAG compliant with proper focus states
- 🚀 **SEO Optimized**: Schema.org markup and proper meta tags

## File Structure

```
dezmir-static/
├── index.html              # Romanian homepage
├── en.html                 # English homepage
├── css/
│   └── style.css          # All styles
├── js/
│   ├── main.js            # Main functionality
│   └── translations.js    # Translation data
├── images/                # Image assets
├── admin/
│   ├── index.html         # Admin panel
│   └── login.html         # Admin login
└── README.md              # This file
```

## Quick Start

1. **Download/Clone** the files to your web server
2. **Open** `index.html` in a web browser
3. **Customize** content in the HTML files and `js/translations.js`
4. **Upload** to any web hosting service

## Customization

### Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --bg-primary: #090802;      /* Background */
    --primary: #BF983A;         /* Gold accent */
    --primary-dark: #614E23;    /* Deep gold */
    --primary-light: #D4B771;   /* Light gold */
    --text-primary: #F4F4F4;    /* Text color */
}
```

### Content
- **Text**: Edit `js/translations.js` for all text content
- **Images**: Replace placeholder images in `images/` folder
- **Contact Info**: Update phone numbers and email in HTML files

### Logo
Replace the logo by updating the logo elements in both HTML files:
```html
<div class="logo-icon">D</div>
<span class="logo-text">Dezmir Detailing</span>
```

## Admin Panel

### Access
1. Go to `/admin/login.html`
2. Default password: `admin123`
3. Change password in `admin/login.html` JavaScript

### Features
- Upload multiple images
- Tag images as "Before" or "After"
- Add captions
- Simple file management

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

### Any Web Host
1. Upload all files to your web server
2. Ensure `index.html` is in the root directory
3. Test all functionality

### GitHub Pages
1. Create a GitHub repository
2. Upload files to the repository
3. Enable GitHub Pages in repository settings
4. Your site will be available at `https://username.github.io/repository-name`

### Netlify
1. Drag and drop the folder to Netlify
2. Your site will be live instantly
3. Custom domain can be added in Netlify dashboard

## Performance

- **No Dependencies**: Pure HTML, CSS, and JavaScript
- **Fast Loading**: Optimized images and minimal code
- **Mobile Optimized**: Responsive design for all devices
- **SEO Ready**: Proper meta tags and schema markup

## Security

- Admin panel uses simple password authentication
- For production, implement proper server-side authentication
- Consider adding CSRF protection for forms

## Maintenance

### Adding Content
1. **Images**: Use admin panel or upload directly to `images/` folder
2. **Text**: Edit `js/translations.js`
3. **Services**: Update HTML in both language files
4. **Pricing**: Update package information in HTML

### Updating
1. Edit files directly
2. Upload changes to web server
3. Clear browser cache if needed

## Troubleshooting

### Images Not Loading
- Check file paths in `js/translations.js`
- Ensure images are in the `images/` folder
- Verify file permissions

### Admin Panel Not Working
- Check browser console for errors
- Verify JavaScript is enabled
- Clear browser cache

### Mobile Issues
- Test on actual devices
- Check viewport meta tag
- Verify responsive CSS

## Support

For technical issues:
1. Check browser console for errors
2. Verify all files are uploaded correctly
3. Test on different browsers
4. Check file permissions

---

**Dezmir Detailing** - Îngrijire auto de precizie. Finisaj ca oglinda.
