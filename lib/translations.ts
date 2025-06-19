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
