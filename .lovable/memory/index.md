# Memory: index.md

# MASFLY Project

## Design System
- Theme: Clean white/light background + orange accent (Alibaba-inspired)
- Primary orange: HSL 24 95% 53%
- Background: HSL 0 0% 96% (light gray)
- Cards: white
- Footer: dark (foreground color)
- Fonts: Poppins (display), Inter (body)
- All UI in French
- Style: Professional e-commerce, clean, readable

## Business Info
- Name: MASFLY
- Country: Benin
- WhatsApp: +2290148108013
- Admin email: stephaneavocevou2@gmail.com

## Architecture
- Pages: Index, Catalogue, APropos, Contact, Admin
- DB: categories, products, product_images tables
- Storage: product-images bucket
- Admin: auth-based, CRUD for products + multi-image upload
- WhatsApp ordering with pre-filled messages
- Navbar: 3-row (top bar, search bar, categories)
- Catalogue: sidebar filters on desktop, pills on mobile
