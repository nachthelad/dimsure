export const translations = {
  en: {
    site: {
      name: "Dimsure",
      tagline: "Measure it once. Trust it forever.",
      description:
        "A public, community-powered database of box dimensions for products. Optimize your packaging and logistics with verified data.",
    },
    navigation: {
      addProduct: "Add Product",
      myContributions: "My Contributions",
      communityDisputes: "Community Disputes",
      blog: "Blog",
      signIn: "Sign in with Google",
      signOut: "Sign out",
      myAccount: "My Account",
      home: "Home",
      about: "About",
      contact: "Contact",
      backToHome: "Back to Home",
    },
    auth: {
      signInTitle: "Sign in to Dimsure",
      signInDescription: "You need to be signed in to access this feature",
      continueWithGoogle: "Continue with Google",
      signingIn: "Signing in...",
      signInSuccess: "Signed in successfully",
      welcomeBack: "Welcome back!",
      signInError: "Sign in failed",
      signInErrorDescription: "There was a problem signing you in. Please try again.",
      signOutSuccess: "Signed out successfully",
      signOutDescription: "You have been signed out of your account.",
      signOutError: "Sign out failed",
      signOutErrorDescription: "There was a problem signing you out. Please try again.",
      termsAgreement: "By signing in, you agree to our Terms of Service and Privacy Policy",
      userMenu: {
        editUsername: "Edit Username",
        units: "Units",
        signOut: "Sign Out",
      },
    },
    home: {
      hero: {
        title: "Measure it once.",
        titleHighlight: "Trust it forever.",
        subtitle:
          "A public, community-powered database of box dimensions for products. Optimize your packaging and logistics with verified data.",
      },
      stats: {
        totalProducts: "Total Products",
        productsInDatabase: "Products in database",
        contributions: "Contributions",
        dataSubmissions: "Data submissions & updates",
        avgConfidence: "Avg. Confidence",
        dataReliability: "Data reliability",
      },
      recentlyAdded: {
        title: "Recently Added",
        subtitle: "Latest products added to the database",
        noProducts: "No Products Yet",
        beFirst: "Be the first to add a product to the database!",
      },
      search: {
        placeholder: "Search by SKU, product name, or brand...",
        searching: "Searching...",
        noResults: 'No products found for "{{searchTerm}}"',
        tryDifferent: "Try searching by SKU, product name, or brand",
      },
    },
    addProduct: {
      title: "Add New Product",
      subtitle: "Help the community by adding verified packaging dimensions for a new product.",
      form: {
        productName: "Product Name",
        productNamePlaceholder: "e.g., Nintendo Switch OLED White",
        productNameHelp:
          "Enter the product name as you see it. The community will help improve naming consistency over time.",
        brand: "Brand",
        brandPlaceholder: "e.g., Nintendo",
        sku: "SKU",
        skuPlaceholder: "e.g., NSW-OLED-WHT",
        category: "Category",
        categoryPlaceholder: "e.g., Gaming Consoles",
        description: "Description",
        descriptionPlaceholder: "Brief description of the product and packaging...",
        boxDimensions: "Box Dimensions",
        inMillimeters: "(in millimeters)",
        length: "Length (mm)",
        width: "Width (mm)",
        height: "Height (mm)",
        packageWeight: "Package Weight (grams)",
        weightPlaceholder: "e.g., 250",
        productImage: "Product Image (Optional)",
        imageUpload: "Click to upload or drag and drop",
        imageFormats: "PNG, JPG up to 10MB",
        imageSize: "Maximum size: 5MB",
        imageReady: "Ready to upload",
        imageError: "Image Error",
        imageUploaded: "Image Uploaded",
        imageUploadedDesc: "Your product image has been uploaded successfully",
        imageUploadFailed: "Upload Failed",
        imageUploadFailedDesc: "Failed to upload image, but product will be saved without it",
        uploadingImage: "Uploading image...",
        submittedBy: "Submitted by:",
        attribution: 'Your contribution will be attributed to your account and will appear in "My Contributions".',
        submit: "Submit Product",
        submitting: "Creating Product...",
      },
      success: {
        title: "Product Added Successfully!",
        message: "Your product has been added to the Dimsure database.",
        redirecting: "Redirecting to product page...",
      },
      suggestions: {
        cleanSpacing: "Clean up spacing:",
        apply: "Apply",
      },
      validation: {
        nameRequired: "Product name must be at least 3 characters long",
        nameTooLong: "Product name must be less than 100 characters",
        loginRequired: "You must be logged in to add a product",
      },
    },
    myContributions: {
      title: "My Contributions",
      subtitle: "Track your submissions and community impact",
      stats: {
        totalProducts: "Total Products",
        productsSubmitted: "Products submitted",
        totalLikes: "Total Likes",
        communityAppreciation: "Community appreciation",
        totalViews: "Total Views",
        productPageVisits: "Product page visits",
      },
      search: {
        placeholder: "Search your products...",
        showing: "Showing {{filtered}} of {{total}} products",
      },
      actions: {
        edit: "Edit",
        view: "View",
        addNew: "Add New Product",
        addFirst: "Add Your First Product",
        debugInfo: "Debug Info",
        refresh: "Refresh",
        fixOrphans: "Fix Orphan Products",
        fixing: "Fixing...",
        clearSearch: "Clear Search",
      },
      empty: {
        noProducts: "No Products Yet",
        noProductsMessage: "You haven't submitted any products to the database yet.",
        noResults: "No Results Found",
        noResultsMessage: 'No products match your search for "{{searchTerm}}". Try a different search term.',
      },
      orphanProducts: {
        notFound: "No contributions found",
        mightNotBeLinked: "If you've added products before, they might not be linked to your account.",
        fixMyProducts: "Fix My Products",
      },
    },
    product: {
      details: {
        sku: "SKU:",
        likes: "likes",
        views: "views",
        confidence: "confidence",
        submittedBy: "First submitted by",
        lastModified: "Last modified by",
        verifiedDimensions: "Verified Dimensions",
      },
      actions: {
        like: "Like This Entry",
        liked: "Liked",
        suggestDifferent: "Suggest Different",
        share: "Share",
        copied: "Copied!",
        reportIssue: "Report Issue",
      },
      tabs: {
        specifications: "Specifications",
        alternatives: "Alternative Dimensions",
        comments: "Comments",
        history: "Version History",
      },
      specifications: {
        title: "Product Specifications",
        packageWeight: "Package Weight:",
        weight: "Weight:",
        notSpecified: "Not specified",
      },
      alternatives: {
        noAlternatives: "No Alternative Dimensions",
        noAlternativesMessage: "This product currently has no alternative measurements submitted by the community.",
      },
      comments: {
        title: "Community Comments",
        noComments: "No Comments Yet",
        noCommentsMessage: "Be the first to share your thoughts about these dimensions.",
      },
      history: {
        title: "Version History",
        updated: "Updated dimensions and verified measurements",
        initialSubmission: "Initial submission with product dimensions",
      },
    },
    about: {
      title: "About Dimsure",
      subtitle:
        "We're building the world's most comprehensive database of product packaging dimensions, powered by a community of logistics professionals, e-commerce sellers, and shipping enthusiasts.",
      mission: {
        title: "Our Mission",
        description1:
          "Every day, millions of packages are shipped around the world. Yet finding accurate packaging dimensions for products remains a frustrating challenge for e-commerce sellers, logistics professionals, and consumers.",
        description2:
          "Dimsure solves this problem by creating a free, open, and community-driven database where anyone can contribute and access verified packaging dimensions. Our goal is simple:",
        goal: "measure it once, trust it forever.",
      },
      whyMatters: {
        title: "Why Accurate Dimensions Matter",
        ecommerce: {
          title: "E-commerce Sellers",
          description:
            "Calculate accurate shipping costs, optimize packaging, and reduce returns due to size expectations.",
        },
        logistics: {
          title: "Logistics Companies",
          description: "Optimize warehouse space, plan transportation capacity, and improve delivery efficiency.",
        },
        consumers: {
          title: "Consumers",
          description: "Make informed purchasing decisions and plan storage space before buying products online.",
        },
      },
      howItWorks: {
        title: "How Dimsure Works",
        step1: {
          title: "Community Contributes",
          description: "Users measure and submit packaging dimensions for products they own or handle.",
        },
        step2: {
          title: "Data Gets Verified",
          description: "Multiple submissions and community feedback ensure accuracy and reliability.",
        },
        step3: {
          title: "Everyone Benefits",
          description: "Free access to accurate, crowd-sourced packaging data for everyone.",
        },
      },
      community: {
        title: "Built by the Community",
        description1:
          "Dimsure is more than just a database—it's a community of people who believe in the power of shared knowledge. Every measurement, every verification, and every improvement comes from users like you who want to make shipping and logistics more efficient for everyone.",
        description2:
          "Whether you're an Amazon seller looking for FBA dimensions, a logistics manager optimizing warehouse space, or a consumer planning a purchase, your contributions help build something bigger than any individual effort.",
      },
      getInvolved: {
        title: "Get Involved",
        description: "Ready to contribute to the future of packaging data? Join our community today.",
        addProduct: "Add Your First Product",
        contactUs: "Contact Us",
      },
    },
    contact: {
      title: "Contact Us",
      subtitle: "Have questions, suggestions, or want to collaborate? We'd love to hear from you.",
      email: {
        title: "Email Us",
        description: "For any questions, suggestions, or business inquiries, please reach out to us:",
        responseTime: "We typically respond within 24-48 hours during business days.",
      },
      responseTime: {
        title: "Response Time",
        general: "General Inquiries:",
        generalTime: "24-48 hours",
        technical: "Technical Issues:",
        technicalTime: "12-24 hours",
        business: "Business Partnerships:",
        businessTime: "2-3 business days",
      },
      helpWith: {
        title: "What Can We Help With?",
        technical: {
          title: "Technical Issues:",
          description: "Problems with the website, data accuracy, or account issues",
        },
        data: {
          title: "Data Contributions:",
          description: "Questions about adding products or measurement guidelines",
        },
        business: {
          title: "Business Partnerships:",
          description: "API access, bulk data needs, or collaboration opportunities",
        },
        features: {
          title: "Feature Requests:",
          description: "Suggestions for new features or improvements",
        },
        content: {
          title: "Content Issues:",
          description: "Report incorrect data or inappropriate content",
        },
      },
      quickActions: {
        title: "Quick Actions",
        reportTechnical: "Report Technical Issue",
        suggestFeature: "Suggest Feature",
        businessInquiry: "Business Inquiry",
      },
      communityProject: {
        title: "Community-Driven Project",
        description:
          "Dimsure is built and maintained by a small team passionate about solving real logistics challenges. We appreciate your patience as we continue to improve and expand the platform based on community feedback.",
      },
    },
    privacy: {
      title: "Privacy Policy",
      subtitle: "Your privacy and data protection are important to us.",
      lastUpdated: "Last updated:",
      sections: {
        introduction: {
          title: "Introduction",
          description1:
            'Dimsure ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.',
          description2:
            "By using Dimsure, you agree to the collection and use of information in accordance with this policy.",
        },
        informationWeCollect: {
          title: "Information We Collect",
          personalInfo: {
            title: "Personal Information",
            googleAccount: "Name, email address, and profile picture when you sign in with Google",
            username: "Custom username you choose for your public profile",
            contributions: "Product data, dimensions, and descriptions you submit",
            interactions: "Likes, views, comments, and other platform activities",
          },
          automaticInfo: {
            title: "Automatically Collected Information",
            usageData: "Pages visited, time spent, and user interactions",
            deviceInfo: "Browser type, operating system, and device identifiers",
            ipAddress: "For security and analytics purposes",
            cookies: "To enhance your experience and remember preferences",
          },
        },
        howWeUse: {
          title: "How We Use Your Information",
          accountManagement: "Create and manage your user account",
          serviceProvision: "Enable you to contribute and access product dimension data",
          attribution: "Display your contributions with your chosen username",
          communication: "Send important updates about our service",
          analytics: "Understand usage patterns to improve our platform",
          security: "Protect against fraud and unauthorized access",
          legalCompliance: "Meet legal obligations and enforce our terms",
        },
        dataSharing: {
          title: "How We Share Your Information",
          noSelling: "🛡️ We DO NOT sell your personal data to third parties.",
          thirdPartyServices: {
            title: "Third-Party Services",
            google: "Authentication services and analytics",
            firebase: "Database and hosting services",
            vercel: "Website hosting and deployment",
            adsense: "Advertising services (anonymized data only)",
          },
          publicInfo: {
            title: "Public Information",
            username: "Your username and product contributions are publicly visible",
            productData: "Product data you submit becomes part of our public database",
            comments: "Comments and interactions on products are publicly displayed",
          },
        },
        dataSecurity: {
          title: "Data Security",
          encryption: "All data is encrypted in transit and at rest",
          accessControl: "Limited access to personal data on a need-to-know basis",
          googleSecurity: "We leverage Google's enterprise-grade security infrastructure",
          regularUpdates: "Security measures are continuously updated and monitored",
          dataMinimization: "We only collect data necessary for our services",
        },
        yourRights: {
          title: "Your Rights and Choices",
          accountManagement: {
            title: "Account Management",
            access: "View and download your personal data",
            correction: "Update or correct your information",
            deactivation: "Deactivate your account (data preserved for reactivation)",
            usernameChanges: "Modify your public username",
          },
          dataControl: {
            title: "Data Control",
            cookiePreferences: "Manage cookie settings in your browser",
            marketingOptOut: "Unsubscribe from promotional communications",
            dataPortability: "Request a copy of your data in a portable format",
          },
          note: "Product contributions may remain in our database even after account deactivation to maintain data integrity for the community. Your username will be anonymized if you choose to permanently delete your account.",
        },
        internationalUsers: {
          title: "International Users",
          gdprCompliance: {
            title: "GDPR Compliance (EU Users)",
            description: "If you are located in the European Union, you have additional rights under GDPR:",
            rightToBeForgotten: "Right to be forgotten (data deletion)",
            dataPortability: "Right to data portability",
            objectToProcessing: "Right to object to processing",
            withdrawConsent: "Right to withdraw consent",
          },
          ccpaCompliance: {
            title: "CCPA Compliance (California Users)",
            description: "California residents have the right to:",
            knowInfo: "Know what personal information is collected",
            deleteInfo: "Delete personal information",
            optOutSale: "Opt-out of the sale of personal information",
            nonDiscrimination: "Non-discrimination for exercising privacy rights",
          },
        },
        cookies: {
          title: "Cookies and Tracking",
          description: "We use cookies and similar technologies to enhance your experience:",
          essential: {
            title: "Essential Cookies",
            authState: "Authentication state",
            security: "Security features",
            basicFunctionality: "Basic functionality",
          },
          analytics: {
            title: "Analytics Cookies",
            usageStats: "Usage statistics",
            performanceMonitoring: "Performance monitoring",
            featureOptimization: "Feature optimization",
          },
        },
        dataRetention: {
          title: "Data Retention",
          activeAccounts: "Data retained while account is active",
          deactivatedAccounts: "Personal data preserved for potential reactivation",
          productContributions: "Retained indefinitely for community benefit",
          analyticsData: "Aggregated data retained for up to 26 months",
          legalRequirements: "Some data may be retained longer for legal compliance",
        },
        changesToPolicy: {
          title: "Changes to This Privacy Policy",
          description:
            'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.',
        },
        contact: {
          title: "Contact Us",
          description: "If you have any questions about this Privacy Policy or our data practices, please contact us:",
          email: "Email:",
          emailAddress: "nachthelad.dev@gmail.com",
          subjectLine: "Subject Line:",
          subjectText: "Privacy Policy Question - Dimsure",
        },
      },
    },
    footer: {
      description:
        "A public, community-powered database of box dimensions for products. Measure it once. Trust it forever.",
      sections: {
        product: "Product",
        company: "Company",
        getInTouch: "Get in Touch",
      },
      links: {
        addProduct: "Add Product",
        myContributions: "My Contributions",
        communityDisputes: "Community Disputes",
        blog: "Blog",
        about: "About Us",
        contact: "Contact",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        followTwitter: "Follow us on Twitter",
      },
      copyright: "© {{year}} Dimsure. All rights reserved.",
      poweredBy: "Powered by",
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      share: "Share",
      like: "Like",
      unlike: "Unlike",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      close: "Close",
      open: "Open",
      yes: "Yes",
      no: "No",
      back: "Back",
      next: "Next",
      previous: "Previous",
      comingSoon: "Coming Soon",
    },
    units: {
      mm: "mm",
      inches: "inches",
      length: "Length",
      width: "Width",
      height: "Height",
    },
  },
  es: {
    site: {
      name: "Dimsure",
      tagline: "Mídelo una vez. Confía para siempre.",
      description:
        "Una base de datos pública y colaborativa de dimensiones de embalaje de productos. Optimiza tu empaquetado y logística con datos verificados.",
    },
    navigation: {
      addProduct: "Agregar Producto",
      myContributions: "Mis Contribuciones",
      communityDisputes: "Disputas de la Comunidad",
      blog: "Blog",
      signIn: "Iniciar sesión con Google",
      signOut: "Cerrar sesión",
      myAccount: "Mi Cuenta",
      home: "Inicio",
      about: "Acerca de",
      contact: "Contacto",
      backToHome: "Volver al Inicio",
    },
    auth: {
      signInTitle: "Iniciar sesión en Dimsure",
      signInDescription: "Necesitas iniciar sesión para acceder a esta función",
      continueWithGoogle: "Continuar con Google",
      signingIn: "Iniciando sesión...",
      signInSuccess: "Sesión iniciada exitosamente",
      welcomeBack: "¡Bienvenido de vuelta!",
      signInError: "Error al iniciar sesión",
      signInErrorDescription: "Hubo un problema al iniciar sesión. Por favor intenta de nuevo.",
      signOutSuccess: "Sesión cerrada exitosamente",
      signOutDescription: "Has cerrado sesión de tu cuenta.",
      signOutError: "Error al cerrar sesión",
      signOutErrorDescription: "Hubo un problema al cerrar sesión. Por favor intenta de nuevo.",
      termsAgreement: "Al iniciar sesión, aceptas nuestros Términos de Servicio y Política de Privacidad",
      userMenu: {
        editUsername: "Editar Nombre de Usuario",
        units: "Unidades",
        signOut: "Cerrar Sesión",
      },
    },
    home: {
      hero: {
        title: "Mídelo una vez.",
        titleHighlight: "Confía para siempre.",
        subtitle:
          "Una base de datos pública y colaborativa de dimensiones de embalaje de productos. Optimiza tu empaquetado y logística con datos verificados.",
      },
      stats: {
        totalProducts: "Total de Productos",
        productsInDatabase: "Productos en la base de datos",
        contributions: "Contribuciones",
        dataSubmissions: "Envíos de datos y actualizaciones",
        avgConfidence: "Confianza Promedio",
        dataReliability: "Confiabilidad de datos",
      },
      recentlyAdded: {
        title: "Agregados Recientemente",
        subtitle: "Últimos productos agregados a la base de datos",
        noProducts: "Aún No Hay Productos",
        beFirst: "¡Sé el primero en agregar un producto a la base de datos!",
      },
      search: {
        placeholder: "Buscar por SKU, nombre del producto o marca...",
        searching: "Buscando...",
        noResults: 'No se encontraron productos para "{{searchTerm}}"',
        tryDifferent: "Intenta buscar por SKU, nombre del producto o marca",
      },
    },
    addProduct: {
      title: "Agregar Nuevo Producto",
      subtitle: "Ayuda a la comunidad agregando dimensiones de embalaje verificadas para un nuevo producto.",
      form: {
        productName: "Nombre del Producto",
        productNamePlaceholder: "ej., Nintendo Switch OLED Blanca",
        productNameHelp:
          "Ingresa el nombre del producto como lo ves. La comunidad ayudará a mejorar la consistencia de nombres con el tiempo.",
        brand: "Marca",
        brandPlaceholder: "ej., Nintendo",
        sku: "SKU",
        skuPlaceholder: "ej., NSW-OLED-WHT",
        category: "Categoría",
        categoryPlaceholder: "ej., Consolas de Videojuegos",
        description: "Descripción",
        descriptionPlaceholder: "Breve descripción del producto y embalaje...",
        boxDimensions: "Dimensiones de la Caja",
        inMillimeters: "(en milímetros)",
        length: "Largo (mm)",
        width: "Ancho (mm)",
        height: "Alto (mm)",
        packageWeight: "Peso del Paquete (gramos)",
        weightPlaceholder: "ej., 250",
        productImage: "Imagen del Producto (Opcional)",
        imageUpload: "Haz clic para subir o arrastra y suelta",
        imageFormats: "PNG, JPG hasta 10MB",
        imageSize: "Tamaño máximo: 5MB",
        imageReady: "Lista para subir",
        imageError: "Error de Imagen",
        imageUploaded: "Imagen Subida",
        imageUploadedDesc: "Tu imagen del producto se ha subido exitosamente",
        imageUploadFailed: "Error al Subir",
        imageUploadFailedDesc: "No se pudo subir la imagen, pero el producto se guardará sin ella",
        uploadingImage: "Subiendo imagen...",
        submittedBy: "Enviado por:",
        attribution: 'Tu contribución será atribuida a tu cuenta y aparecerá en "Mis Contribuciones".',
        submit: "Enviar Producto",
        submitting: "Creando Producto...",
      },
      success: {
        title: "¡Producto Agregado Exitosamente!",
        message: "Tu producto ha sido agregado a la base de datos de Dimsure.",
        redirecting: "Redirigiendo a la página del producto...",
      },
      suggestions: {
        cleanSpacing: "Limpiar espaciado:",
        apply: "Aplicar",
      },
      validation: {
        nameRequired: "El nombre del producto debe tener al menos 3 caracteres",
        nameTooLong: "El nombre del producto debe tener menos de 100 caracteres",
        loginRequired: "Debes iniciar sesión para agregar un producto",
      },
    },
    myContributions: {
      title: "Mis Contribuciones",
      subtitle: "Rastrea tus envíos e impacto en la comunidad",
      stats: {
        totalProducts: "Total de Productos",
        productsSubmitted: "Productos enviados",
        totalLikes: "Total de Me Gusta",
        communityAppreciation: "Apreciación de la comunidad",
        totalViews: "Total de Visualizaciones",
        productPageVisits: "Visitas a páginas de productos",
      },
      search: {
        placeholder: "Buscar tus productos...",
        showing: "Mostrando {{filtered}} de {{total}} productos",
      },
      actions: {
        edit: "Editar",
        view: "Ver",
        addNew: "Agregar Nuevo Producto",
        addFirst: "Agregar Tu Primer Producto",
        debugInfo: "Info de Depuración",
        refresh: "Actualizar",
        fixOrphans: "Arreglar Productos Huérfanos",
        fixing: "Arreglando...",
        clearSearch: "Limpiar Búsqueda",
      },
      empty: {
        noProducts: "Aún No Hay Productos",
        noProductsMessage: "Aún no has enviado ningún producto a la base de datos.",
        noResults: "No Se Encontraron Resultados",
        noResultsMessage:
          'Ningún producto coincide con tu búsqueda de "{{searchTerm}}". Intenta con un término diferente.',
      },
      orphanProducts: {
        notFound: "No se encontraron contribuciones",
        mightNotBeLinked: "Si has agregado productos antes, podrían no estar vinculados a tu cuenta.",
        fixMyProducts: "Arreglar Mis Productos",
      },
    },
    product: {
      details: {
        sku: "SKU:",
        likes: "me gusta",
        views: "visualizaciones",
        confidence: "confianza",
        submittedBy: "Creado por",
        lastModified: "Última modificación por",
        verifiedDimensions: "Dimensiones Verificadas",
      },
      actions: {
        like: "Me Gusta",
        liked: "Me Gusta",
        suggestDifferent: "Sugerir Diferente",
        share: "Compartir",
        copied: "¡Copiado!",
        reportIssue: "Reportar Problema",
      },
      tabs: {
        specifications: "Especificaciones",
        alternatives: "Dimensiones Alternativas",
        comments: "Comentarios",
        history: "Historial de Versiones",
      },
      specifications: {
        title: "Especificaciones del Producto",
        packageWeight: "Peso del Paquete:",
        weight: "Peso:",
        notSpecified: "No especificado",
      },
      alternatives: {
        noAlternatives: "Sin Dimensiones Alternativas",
        noAlternativesMessage: "Este producto actualmente no tiene medidas alternativas enviadas por la comunidad.",
      },
      comments: {
        title: "Comentarios de la Comunidad",
        noComments: "Aún No Hay Comentarios",
        noCommentsMessage: "Sé el primero en compartir tus pensamientos sobre estas dimensiones.",
      },
      history: {
        title: "Historial de Versiones",
        updated: "Dimensiones actualizadas y medidas verificadas",
        initialSubmission: "Envío inicial con dimensiones del producto",
      },
    },
    about: {
      title: "Acerca de Dimsure",
      subtitle:
        "Estamos construyendo la base de datos más completa del mundo de dimensiones de embalaje de productos, impulsada por una comunidad de profesionales de logística, vendedores de comercio electrónico y entusiastas del envío.",
      mission: {
        title: "Nuestra Misión",
        description1:
          "Todos los días, millones de paquetes se envían alrededor del mundo. Sin embargo, encontrar dimensiones precisas de embalaje para productos sigue siendo un desafío frustrante para vendedores de comercio electrónico, profesionales de logística y consumidores.",
        description2:
          "Dimsure resuelve este problema creando una base de datos gratuita, abierta y impulsada por la comunidad donde cualquiera puede contribuir y acceder a dimensiones de embalaje verificadas. Nuestro objetivo es simple:",
        goal: "mídelo una vez, confía para siempre.",
      },
      whyMatters: {
        title: "Por Qué Importan las Dimensiones Precisas",
        ecommerce: {
          title: "Vendedores de E-commerce",
          description:
            "Calcula costos de envío precisos, optimiza el embalaje y reduce devoluciones debido a expectativas de tamaño.",
        },
        logistics: {
          title: "Empresas de Logística",
          description:
            "Optimiza el espacio del almacén, planifica la capacidad de transporte y mejora la eficiencia de entrega.",
        },
        consumers: {
          title: "Consumidores",
          description:
            "Toma decisiones de compra informadas y planifica el espacio de almacenamiento antes de comprar productos en línea.",
        },
      },
      howItWorks: {
        title: "Cómo Funciona Dimsure",
        step1: {
          title: "La Comunidad Contribuye",
          description: "Los usuarios miden y envían dimensiones de embalaje para productos que poseen o manejan.",
        },
        step2: {
          title: "Los Datos Se Verifican",
          description: "Múltiples envíos y comentarios de la comunidad aseguran precisión y confiabilidad.",
        },
        step3: {
          title: "Todos Se Benefician",
          description: "Acceso gratuito a datos de embalaje precisos y colaborativos para todos.",
        },
      },
      community: {
        title: "Construido por la Comunidad",
        description1:
          "Dimsure es más que solo una base de datos: es una comunidad de personas que creen en el poder del conocimiento compartido. Cada medida, cada verificación y cada mejora proviene de usuarios como tú que quieren hacer que el envío y la logística sean más eficientes para todos.",
        description2:
          "Ya seas un vendedor de Amazon buscando dimensiones FBA, un gerente de logística optimizando el espacio del almacén, o un consumidor planificando una compra, tus contribuciones ayudan a construir algo más grande que cualquier esfuerzo individual.",
      },
      getInvolved: {
        title: "Involúcrate",
        description: "¿Listo para contribuir al futuro de los datos de embalaje? Únete a nuestra comunidad hoy.",
        addProduct: "Agregar Tu Primer Producto",
        contactUs: "Contáctanos",
      },
    },
    contact: {
      title: "Contáctanos",
      subtitle: "¿Tienes preguntas, sugerencias o quieres colaborar? Nos encantaría saber de ti.",
      email: {
        title: "Envíanos un Email",
        description: "Para cualquier pregunta, sugerencia o consulta comercial, por favor contáctanos:",
        responseTime: "Típicamente respondemos dentro de 24-48 horas durante días hábiles.",
      },
      responseTime: {
        title: "Tiempo de Respuesta",
        general: "Consultas Generales:",
        generalTime: "24-48 horas",
        technical: "Problemas Técnicos:",
        technicalTime: "12-24 horas",
        business: "Asociaciones Comerciales:",
        businessTime: "2-3 días hábiles",
      },
      helpWith: {
        title: "¿En Qué Podemos Ayudar?",
        technical: {
          title: "Problemas Técnicos:",
          description: "Problemas con el sitio web, precisión de datos o problemas de cuenta",
        },
        data: {
          title: "Contribuciones de Datos:",
          description: "Preguntas sobre agregar productos o pautas de medición",
        },
        business: {
          title: "Asociaciones Comerciales:",
          description: "Acceso a API, necesidades de datos masivos u oportunidades de colaboración",
        },
        features: {
          title: "Solicitudes de Funciones:",
          description: "Sugerencias para nuevas funciones o mejoras",
        },
        content: {
          title: "Problemas de Contenido:",
          description: "Reportar datos incorrectos o contenido inapropiado",
        },
      },
      quickActions: {
        title: "Acciones Rápidas",
        reportTechnical: "Reportar Problema Técnico",
        suggestFeature: "Sugerir Función",
        businessInquiry: "Consulta Comercial",
      },
      communityProject: {
        title: "Proyecto Impulsado por la Comunidad",
        description:
          "Dimsure es construido y mantenido por un pequeño equipo apasionado por resolver desafíos logísticos reales. Apreciamos tu paciencia mientras continuamos mejorando y expandiendo la plataforma basada en los comentarios de la comunidad.",
      },
    },
    privacy: {
      title: "Política de Privacidad",
      subtitle: "Tu privacidad y protección de datos son importantes para nosotros.",
      lastUpdated: "Última actualización:",
      sections: {
        introduction: {
          title: "Introducción",
          description1:
            'Dimsure ("nosotros", "nuestro" o "nos") está comprometido a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos tu información cuando usas nuestro sitio web y servicios.',
          description2: "Al usar Dimsure, aceptas la recopilación y uso de información de acuerdo con esta política.",
        },
        informationWeCollect: {
          title: "Información que Recopilamos",
          personalInfo: {
            title: "Información Personal",
            googleAccount: "Nombre, dirección de correo electrónico y foto de perfil cuando inicias sesión con Google",
            username: "Nombre de usuario personalizado que eliges para tu perfil público",
            contributions: "Datos de productos, dimensiones y descripciones que envías",
            interactions: "Me gusta, visualizaciones, comentarios y otras actividades de la plataforma",
          },
          automaticInfo: {
            title: "Información Recopilada Automáticamente",
            usageData: "Páginas visitadas, tiempo transcurrido e interacciones del usuario",
            deviceInfo: "Tipo de navegador, sistema operativo e identificadores de dispositivo",
            ipAddress: "Para propósitos de seguridad y análisis",
            cookies: "Para mejorar tu experiencia y recordar preferencias",
          },
        },
        howWeUse: {
          title: "Cómo Usamos tu Información",
          accountManagement: "Crear y gestionar tu cuenta de usuario",
          serviceProvision: "Permitirte contribuir y acceder a datos de dimensiones de productos",
          attribution: "Mostrar tus contribuciones con tu nombre de usuario elegido",
          communication: "Enviar actualizaciones importantes sobre nuestro servicio",
          analytics: "Entender patrones de uso para mejorar nuestra plataforma",
          security: "Proteger contra fraude y acceso no autorizado",
          legalCompliance: "Cumplir obligaciones legales y hacer cumplir nuestros términos",
        },
        dataSharing: {
          title: "Cómo Compartimos tu Información",
          noSelling: "🛡️ NO vendemos tus datos personales a terceros.",
          thirdPartyServices: {
            title: "Servicios de Terceros",
            google: "Servicios de autenticación y análisis",
            firebase: "Servicios de base de datos y alojamiento",
            vercel: "Alojamiento web y despliegue",
            adsense: "Servicios de publicidad (solo datos anonimizados)",
          },
          publicInfo: {
            title: "Información Pública",
            username: "Tu nombre de usuario y contribuciones de productos son públicamente visibles",
            productData: "Los datos de productos que envías se convierten en parte de nuestra base de datos pública",
            comments: "Los comentarios e interacciones en productos se muestran públicamente",
          },
        },
        dataSecurity: {
          title: "Seguridad de Datos",
          encryption: "Todos los datos están encriptados en tránsito y en reposo",
          accessControl: "Acceso limitado a datos personales según necesidad de conocimiento",
          googleSecurity: "Aprovechamos la infraestructura de seguridad de nivel empresarial de Google",
          regularUpdates: "Las medidas de seguridad se actualizan y monitorean continuamente",
          dataMinimization: "Solo recopilamos datos necesarios para nuestros servicios",
        },
        yourRights: {
          title: "Tus Derechos y Opciones",
          accountManagement: {
            title: "Gestión de Cuenta",
            access: "Ver y descargar tus datos personales",
            correction: "Actualizar o corregir tu información",
            deactivation: "Desactivar tu cuenta (datos preservados para reactivación)",
            usernameChanges: "Modificar tu nombre de usuario público",
          },
          dataControl: {
            title: "Control de Datos",
            cookiePreferences: "Gestionar configuración de cookies en tu navegador",
            marketingOptOut: "Cancelar suscripción a comunicaciones promocionales",
            dataPortability: "Solicitar una copia de tus datos en formato portable",
          },
          note: "Las contribuciones de productos pueden permanecer en nuestra base de datos incluso después de la desactivación de la cuenta para mantener la integridad de datos para la comunidad. Tu nombre de usuario será anonimizado si eliges eliminar permanentemente tu cuenta.",
        },
        internationalUsers: {
          title: "Usuarios Internacionales",
          gdprCompliance: {
            title: "Cumplimiento GDPR (Usuarios de la UE)",
            description: "Si te encuentras en la Unión Europea, tienes derechos adicionales bajo GDPR:",
            rightToBeForgotten: "Derecho al olvido (eliminación de datos)",
            dataPortability: "Derecho a la portabilidad de datos",
            objectToProcessing: "Derecho a objetar el procesamiento",
            withdrawConsent: "Derecho a retirar el consentimiento",
          },
          ccpaCompliance: {
            title: "Cumplimiento CCPA (Usuarios de California)",
            description: "Los residentes de California tienen derecho a:",
            knowInfo: "Saber qué información personal se recopila",
            deleteInfo: "Eliminar información personal",
            optOutSale: "Optar por no participar en la venta de información personal",
            nonDiscrimination: "No discriminación por ejercer derechos de privacidad",
          },
        },
        cookies: {
          title: "Cookies y Seguimiento",
          description: "Usamos cookies y tecnologías similares para mejorar tu experiencia:",
          essential: {
            title: "Cookies Esenciales",
            authState: "Estado de autenticación",
            security: "Características de seguridad",
            basicFunctionality: "Funcionalidad básica",
          },
          analytics: {
            title: "Cookies de Análisis",
            usageStats: "Estadísticas de uso",
            performanceMonitoring: "Monitoreo de rendimiento",
            featureOptimization: "Optimización de características",
          },
        },
        dataRetention: {
          title: "Retención de Datos",
          activeAccounts: "Datos retenidos mientras la cuenta esté activa",
          deactivatedAccounts: "Datos personales preservados para posible reactivación",
          productContributions: "Retenidos indefinidamente para beneficio de la comunidad",
          analyticsData: "Datos agregados retenidos hasta 26 meses",
          legalRequirements: "Algunos datos pueden retenerse más tiempo por cumplimiento legal",
        },
        changesToPolicy: {
          title: "Cambios a Esta Política de Privacidad",
          description:
            'Podemos actualizar esta Política de Privacidad de vez en cuando. Te notificaremos de cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha de "Última actualización". Se te aconseja revisar esta Política de Privacidad periódicamente para cualquier cambio.',
        },
        contact: {
          title: "Contáctanos",
          description:
            "Si tienes alguna pregunta sobre esta Política de Privacidad o nuestras prácticas de datos, por favor contáctanos:",
          email: "Correo electrónico:",
          emailAddress: "nachthelad.dev@gmail.com",
          subjectLine: "Asunto:",
          subjectText: "Pregunta sobre Política de Privacidad - Dimsure",
        },
      },
    },
    footer: {
      description:
        "Una base de datos pública y colaborativa de dimensiones de embalaje de productos. Mídelo una vez. Confía para siempre.",
      sections: {
        product: "Producto",
        company: "Empresa",
        getInTouch: "Ponte en Contacto",
      },
      links: {
        addProduct: "Agregar Producto",
        myContributions: "Mis Contribuciones",
        communityDisputes: "Disputas de la Comunidad",
        blog: "Blog",
        about: "Acerca de Nosotros",
        contact: "Contacto",
        privacy: "Política de Privacidad",
        terms: "Términos de Servicio",
        followTwitter: "Síguenos en Twitter",
      },
      copyright: "© {{year}} Dimsure. Todos los derechos reservados.",
      poweredBy: "Desarrollado por",
    },
    common: {
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      cancel: "Cancelar",
      save: "Guardar",
      edit: "Editar",
      delete: "Eliminar",
      view: "Ver",
      share: "Compartir",
      like: "Me Gusta",
      unlike: "No Me Gusta",
      search: "Buscar",
      filter: "Filtrar",
      sort: "Ordenar",
      close: "Cerrar",
      open: "Abrir",
      yes: "Sí",
      no: "No",
      back: "Atrás",
      next: "Siguiente",
      previous: "Anterior",
      comingSoon: "Próximamente",
    },
    units: {
      mm: "mm",
      inches: "pulgadas",
      length: "Largo",
      width: "Ancho",
      height: "Alto",
    },
  },
} as const

export type TranslationKey = keyof typeof translations.en
export type NestedTranslationKey<T> = T extends object
  ? { [K in keyof T]: T[K] extends object ? `${string & K}.${NestedTranslationKey<T[K]>}` : string & K }[keyof T]
  : never

export function getTranslation(locale: string, key: string): string {
  const keys = key.split(".")
  let value: any = translations[locale as keyof typeof translations] || translations.en

  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) {
      // Fallback to English
      value = translations.en
      for (const fallbackKey of keys) {
        value = value?.[fallbackKey]
        if (value === undefined) return key
      }
      break
    }
  }

  return typeof value === "string" ? value : key
}

export function interpolate(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return values[key]?.toString() || match
  })
}
