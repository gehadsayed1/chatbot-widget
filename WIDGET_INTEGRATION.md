# Chatbot Widget - Embeddable Web Component

## 🎯 Overview

This chatbot has been transformed into a production-ready embeddable web component that can be integrated into ANY website with a single script tag.

## ✅ Implementation Summary

### What Was Changed

#### 1. **vite.config.js** - Library Mode Configuration

- ✅ Enabled `customElement: true` in Vue plugin
- ✅ Configured `build.lib` mode with UMD format
- ✅ Set entry point to `src/main.js`
- ✅ Output filename: `chatbot.js`
- ✅ Disabled CSS code splitting (`cssCodeSplit: false`)
- ✅ Configured Rollup to inline all dynamic imports

**Why**: Library mode bundles the app as a standalone UMD module that can be loaded via `<script>` tag. UMD format ensures maximum compatibility across different module systems.

#### 2. **main.js** - Custom Element Registration

- ✅ **Wrapper Component Pattern**: Uses a wrapper component to correctly install plugins (Pinia, i18n) on the custom element's internal app instance during `setup()`.
- ✅ **Style Injection**: Explicitly injects both global Tailwind styles (from `style.css?inline`) and component-scoped styles into the Shadow DOM.
- ✅ **Auto-Injection**: Automatically appends the widget to `document.body` if not present.

**Why**: `defineCustomElement` creates a new Vue app instance for each element instance. Plugins like i18n and Pinia must be installed via `app.use()` on _that specific instance_ to work correctly. The wrapper pattern allows us to hook into `setup()` to perform this installation.

#### 3. **App.vue** - Widget Positioning

- ✅ Added `:host` CSS selector with:
  - `position: fixed`
  - `bottom: 20px; right: 20px`
  - `z-index: 999999`
- ✅ Added `dir` and `lang` attributes for RTL/LTR support

**Why**: `:host` targets the custom element itself in Shadow DOM. Fixed positioning ensures the widget floats above all page content without affecting layout.

#### 4. **Component Refactoring** - Shadow DOM Compatibility

- ✅ **ChatMessages.vue**: Replaced `document.getElementById()` with `ref` and `querySelector` on ref element
- ✅ **ChatFooter.vue**: Accepts `scrollContainer` prop instead of DOM query
- ✅ **ChatSuggestions.vue**: Accepts `scrollContainer` prop instead of DOM query
- ✅ **ChatBox.vue**: Exposes `scrollContainer` ref and passes to child components

**Why**: Shadow DOM creates an isolated DOM tree. Direct `document.getElementById()` calls cannot access elements inside Shadow DOM. Using Vue refs ensures components work correctly within the shadow boundary.

#### 5. **i18n.js** - Shadow DOM Compatibility

- ✅ Removed `document.documentElement.setAttribute()` calls
- ✅ Direction (RTL/LTR) now handled at component level via `dir` attribute
- ✅ Added `getCurrentDirection()` helper function

**Why**: Shadow DOM is isolated from the host document. Setting attributes on `document.documentElement` won't affect the widget. Direction is now managed within the component scope.

#### 6. **Store Configuration**

- ✅ `chatUi.js` already has `isOpen = true` by default

**Why**: Widget should be open by default as per requirements.

## 🚀 Build Instructions

### Build the Widget

```bash
npm run build
```

This will generate:

- `dist/chatbot.js` - The complete widget bundle (UMD format)
- `dist/style.css` - (Empty if correctly inlined, or containing external styles if any)

### Test Locally

1. Build the widget:

   ```bash
   npm run build
   ```

2. Open `test.html` in a browser:

   ```bash
   # Windows
   start test.html

   # Mac/Linux
   open test.html
   ```

## 📦 Integration Instructions

### Basic Integration

Add this single line to any HTML page:

```html
<script src="https://example.com/chatbot.js"></script>
```

That's it! The widget will:

- ✅ Automatically inject itself into the page
- ✅ Appear at bottom-right corner
- ✅ Be open by default
- ✅ Not interfere with host page CSS or JavaScript

### Advanced Integration

#### Manual Placement

If you want to control where the widget appears:

```html
<!-- Place the widget element wherever you want -->
<chat-widget></chat-widget>

<!-- Load the script -->
<script src="https://example.com/chatbot.js"></script>
```

#### Programmatic Control

```javascript
// Create widget programmatically
const widget = document.createElement("chat-widget");
document.body.appendChild(widget);
```

## 🔒 Shadow DOM Isolation

The widget uses Shadow DOM which provides:

1. **CSS Isolation**: Host page styles won't affect the widget, and widget styles won't leak to the host page
2. **JavaScript Isolation**: Widget's internal DOM is encapsulated
3. **No Conflicts**: Multiple widgets can coexist on the same page
4. **Clean Integration**: No need to worry about CSS class name collisions

## ✨ Features Preserved

All original functionality is maintained:

- ✅ Pinia state management works correctly
- ✅ Vue i18n for multi-language support (AR, EN, FR)
- ✅ RTL/LTR direction handling
- ✅ API integration and session cookies unchanged
- ✅ All UI interactions (scrolling, suggestions, forms)
- ✅ Voice call functionality
- ✅ Message history and state persistence

## 🎨 Styling

All Tailwind CSS is bundled and injected into the Shadow DOM automatically. The widget is completely self-contained.

### Icons & External Resources

- **FontAwesome**: The widget automatically detects if it's running in Shadow DOM and injects the FontAwesome CDN link (`all.min.css`) directly into the shadow root. This ensures icons work even if the host page doesn't have them.
- **Google Fonts**: Cairo and Inter fonts are imported via CSS.

### CSS Reset

To ensure consistent appearance across all websites, the widget includes a specific CSS reset for Shadow DOM (e.g. `border-style: solid`) to prevent host page styles or browser defaults from breaking the layout.

The widget works in all modern browsers that support:

- Custom Elements (Web Components)
- Shadow DOM
- ES6+ JavaScript

Supported browsers:

- Chrome/Edge 67+
- Firefox 63+
- Safari 10.1+
- Opera 54+

## 📊 Bundle Size

The final bundle includes:

- Vue 3 runtime
- Pinia
- Vue i18n
- Tailwind CSS (scoped to widget)
- All components and assets

Expected size: ~200-300KB (gzipped)

## 🔧 Production Deployment

1. Build the widget: `npm run build`
2. Upload `dist/chatbot.js` to your CDN/hosting
3. Distribute the script URL to clients
4. Clients add `<script src="YOUR_URL/chatbot.js"></script>` to their pages

## 🎯 Verification Checklist

When testing, verify:

- [ ] Widget appears at bottom-right
- [ ] Widget is open by default
- [ ] No CSS conflicts with host page
- [ ] Can send and receive messages
- [ ] Scrolling works correctly
- [ ] Language switching works
- [ ] RTL/LTR direction works
- [ ] No JavaScript errors in console
- [ ] Widget works on different host pages
- [ ] Multiple page loads don't create duplicate widgets

## 📝 Notes

- The widget auto-injects only if `<chat-widget>` is not already present
- The widget respects existing language preferences (localStorage/cookies)
- API proxy configuration is for development only - production should use absolute URLs
- Session cookies and API authentication work as before
