# 📏 Dimsure

**The Crowdsourced Product Dimension Database**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/nachthelads-projects/v0-dimsure-ui-design)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/1yttxNtDNvG)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

## 🎯 What is Dimsure?

Dimsure is a **community-driven platform** where users can contribute, verify, and access accurate product dimensions. Think of it as the "Wikipedia for product measurements" - helping consumers, designers, and businesses make informed decisions based on reliable dimensional data.

### 🌟 Why Dimsure?

- **🔍 Hard to find dimensions**: Product specifications are often incomplete or missing
- **📐 Accuracy matters**: Wrong dimensions can lead to costly mistakes
- **🤝 Community power**: Crowdsourced data is more reliable and comprehensive
- **🌍 Global accessibility**: Available in multiple languages with metric/imperial units

## ✨ Key Features

### 🔐 **Authentication & User Management**
- Google OAuth integration
- User profiles with contribution tracking
- Personalized dashboards

### 📊 **Product Database**
- Add new products with detailed dimensions
- Edit and improve existing entries
- SKU-based product identification
- Image support for visual reference

### 🎯 **Measurement System**
- Support for both metric (mm) and imperial (inches) units
- Automatic unit conversion
- Precise dimensional data storage

### 🌐 **Internationalization**
- Multi-language support (English/Spanish)
- Localized content and interface
- Cultural measurement preferences

### 🏆 **Community Features**
- Like/vote system for data quality
- User contribution tracking
- Community dispute resolution
- Confidence scoring for measurements

### 🔍 **Search & Discovery**
- Advanced product search
- Filter by categories and specifications
- Alternative dimension suggestions
- Related product recommendations

### 📱 **Modern Experience**
- Progressive Web App (PWA) support
- Responsive design for all devices
- Dark/light theme toggle
- Fast, optimized performance

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Firebase/Firestore
- **Authentication**: Firebase Auth (Google OAuth)
- **Deployment**: Vercel
- **PWA**: Web App Manifest, Service Workers

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/dimsure.git
   cd dimsure
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your Firebase configuration:
   \`\`\`env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   \`\`\`

4. **Set up Firestore rules**
   \`\`\`bash
   firebase deploy --only firestore:rules
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### For Contributors

1. **Sign up** with your Google account
2. **Search** for products or add new ones
3. **Add dimensions** with accurate measurements
4. **Upload images** to help others identify products
5. **Verify** other users' contributions

### For Consumers

1. **Search** for products by name or SKU
2. **View dimensions** in your preferred units
3. **Check confidence scores** for data reliability
4. **Compare** similar products
5. **Export** dimension data for your projects

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Code Contributions

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Data Contributions

1. Sign up on the platform
2. Add accurate product dimensions
3. Verify existing entries
4. Report incorrect data through the dispute system

### Translation

Help us make Dimsure available in more languages:
- Check `public/locales/` for existing translations
- Add new language files following the same structure
- Update the language configuration in `lib/i18n.ts`

## 📊 Project Structure

\`\`\`
dimsure/
├── app/                    # Next.js app directory
│   ├── (pages)/           # Route pages
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   ├── auth.ts          # Authentication logic
│   └── ...              # Other utilities
├── public/              # Static assets
│   ├── locales/         # Translation files
│   └── ...              # Icons, images
└── scripts/             # Build and utility scripts
\`\`\`

## 🔒 Privacy & Security

- **Data Protection**: All user data is handled according to privacy best practices
- **Secure Authentication**: Google OAuth ensures secure login
- **Content Moderation**: Community-driven quality control
- **GDPR Compliant**: Respects user privacy rights

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [v0.dev](https://v0.dev) - AI-powered development
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Hosted on [Vercel](https://vercel.com/)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/dimsure/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/dimsure/discussions)
- **Email**: support@dimsure.com

---

**Made with ❤️ by the Dimsure community**

*Helping the world measure better, one dimension at a time.*
