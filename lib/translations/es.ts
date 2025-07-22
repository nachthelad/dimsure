export const es = {
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
    signInErrorDescription:
      "Hubo un problema al iniciar sesión. Por favor intenta de nuevo.",
    signOutSuccess: "Sesión cerrada exitosamente",
    signOutDescription: "Has cerrado sesión de tu cuenta.",
    signOutError: "Error al cerrar sesión",
    signOutErrorDescription:
      "Hubo un problema al cerrar sesión. Por favor intenta de nuevo.",
    termsAgreement:
      "Al iniciar sesión, aceptas nuestros Términos de Servicio y Política de Privacidad",
    userMenu: {
      profile: "Perfil",
      units: "Unidades",
      signOut: "Cerrar Sesión",
      language: "Idioma",
    },
    profile: {
      title: "Perfil",
      description: "Este nombre se mostrará públicamente.",
      username: "Nombre de usuario",
      placeholder: "ej. AmanteDeLaLogistica",
      cancel: "Cancelar",
      save: "Guardar",
      saved: "Guardado",
      saving: "Guardando...",
      requirements: "3–20 caracteres. Solo letras, números y guiones bajos.",
      daysLeft: "Podrás cambiar tu usuario en {{days}} días",
      errors: {
        required: "El nombre de usuario es obligatorio.",
        tooShort: "Debe tener al menos 3 caracteres.",
        tooLong: "No puede superar los 20 caracteres.",
        invalidChars: "Solo se permiten letras, números y guiones bajos.",
        permissionDenied: "No tenés permisos para hacer esto.",
        notFound: "Usuario no encontrado.",
        insufficientPermissions: "Permisos insuficientes.",
        updateFailed: "No se pudo actualizar el nombre: {{error}}",
      },
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
    loading: "Cargando...",
    title: "Agregar Nuevo Producto",
    subtitle:
      "Ayuda a la comunidad agregando dimensiones de embalaje verificadas para un nuevo producto.",
    form: {
      productName: "Nombre del Producto",
      productNamePlaceholder: "Switch OLED Blanca",
      productNameHelp:
        "Ingresa el nombre del producto como lo ves. La comunidad ayudará a mejorar la consistencia de nombres con el tiempo.",
      brand: "Marca",
      brandPlaceholder: "Nintendo",
      sku: "SKU",
      skuPlaceholder: "NSW-OLED-WHT",
      category: "Categoría",
      categoryPlaceholder: "Consolas",
      description: "Descripción",
      descriptionPlaceholder: "Breve descripción del producto y embalaje...",
      boxDimensions: "Dimensiones de la Caja",
      inMillimeters: "(en milímetros)",
      inInches: "(en pulgadas)",
      length: "Largo",
      width: "Ancho",
      height: "Alto",
      packageWeight: "Peso",
      weightPlaceholder: "250",
      dimensionsHelp:
        "Podés pegar dimensiones como '203 x 140 x 19' y se completarán automáticamente los tres campos",
      productImage: "Imagen del Producto (Opcional)",
      imageUpload: "Haz clic para subir una foto",
      imageFormats: "PNG, JPG hasta 5MB",
      maxImages: "Máximo 3 imágenes",
      imageReady: "Lista para subir",
      imageError: "Error de Imagen",
      imageUploaded: "Imagen Subida",
      imageUploadedDesc: "Tu imagen del producto se ha subido exitosamente",
      imageUploadFailed: "Error al Subir",
      imageUploadFailedDesc:
        "No se pudo subir la imagen, pero el producto se guardará sin ella",
      uploadingImage: "Subiendo imagen...",
      submittedBy: "Enviado por:",
      attribution:
        'Tu contribución será atribuida a tu cuenta y aparecerá en "Mis Contribuciones".',
      setAsMain: "Elegir como imagen principal",
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
      nameRequired: "El nombre del producto es requerido",
      nameMinLength: "El nombre del producto debe tener al menos 3 caracteres",
      nameMaxLength:
        "El nombre del producto debe tener menos de 100 caracteres",
      skuRequired: "El SKU es requerido",
      skuMinLength: "El SKU debe tener al menos 2 caracteres",
      skuMaxLength: "El SKU debe tener menos de 50 caracteres",
      skuExists: "Ya existe un producto con este SKU",
      brandRequired: "La marca es requerida",
      categoryRequired: "La categoría es requerida",
      dimensionsRequired: "Todas las dimensiones son requeridas",
      dimensionsPositive: "Todas las dimensiones deben ser números positivos",
      weightPositive: "El peso debe ser un número positivo",
      maxImages: "Máximo 3 imágenes permitidas",
      loginRequired: "Debes iniciar sesión para agregar un producto",
    },
    converter: {
      title: "Convertidor de Unidades",
      dimensionTitle: "Convertidor de Dimensiones",
      weightTitle: "Convertidor de Peso",
      dimensions: "Dimensiones",
      weight: "Peso",
      mmToInches: "MM a Pulgadas",
      inchesToMm: "Pulgadas a MM",
      gToLb: "G a LB",
      lbToG: "LB a G",
      enterMm: "Ingresa las dimensiones en milímetros:",
      enterInches: "Ingresa las dimensiones en pulgadas:",
      enterG: "Ingresa el peso en gramos:",
      enterLb: "Ingresa el peso en libras:",
      insert: "Convertir e insertar",
      allFieldsRequired: "Todos los campos son requeridos",
      positiveNumbers: "Todos los valores deben ser números positivos",
      errorInToMm:
        "No se pueden convertir pulgadas a mm cuando el formulario está configurado en pulgadas. Por favor usa el preset 'Pulgadas a MM'.",
      errorMmToIn:
        "No se pueden convertir mm a pulgadas cuando el formulario está configurado en mm. Por favor usa el preset 'MM a Pulgadas'.",
      errorGToLb:
        "No se pueden convertir gramos a libras cuando el formulario está configurado en gramos. Por favor usa el preset 'G a LB'.",
      errorLbToG:
        "No se pueden convertir libras a gramos cuando el formulario está configurado en libras. Por favor usa el preset 'LB a G'.",
    },
  },
  myContributions: {
    title: "Mis Contribuciones",
    subtitle: "Rastrea tus envíos e impacto en la comunidad",
    stats: {
      totalProducts: "Total de Productos",
      productsSubmitted: "Productos enviados",
      totalLikes: "Me Gusta",
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
      noProductsMessage:
        "Aún no has enviado ningún producto a la base de datos.",
      noResults: "No Se Encontraron Resultados",
      noResultsMessage:
        'Ningún producto coincide con tu búsqueda de "{{searchTerm}}". Intenta con un término diferente.',
    },
    orphanProducts: {
      notFound: "No se encontraron contribuciones",
      mightNotBeLinked:
        "Si has agregado productos antes, podrían no estar vinculados a tu cuenta.",
      fixMyProducts: "Arreglar Mis Productos",
    },
    disputeBadge: "En Disputa",
    disputeNotification:
      'Se abrió una disputa para tu producto "{{productName}}".',
    resolutionPendingNotification:
      'Una disputa para tu producto "{{productName}}" alcanzó los votos requeridos. Por favor edita tu producto antes de que expire el tiempo, o la comunidad podrá editarlo.',
  },
  blog: {
    title: "Blog de Dimsure",
    subtitle:
      "Artículos y consejos sobre embalaje, logística y actualizaciones de Dimsure.",
    noArticles: "Aún no hay artículos",
    noArticlesMessage: "Aún no se han publicado artículos en el blog.",
    backToBlog: "Volver al blog",
    by: "Por",
    on: "el",
    unknownDate: "Fecha desconocida",
    admin: {
      notAuthorized: "No autorizado",
      loading: "Cargando...",
      newPostTitle: "Nuevo artículo del blog",
      titleLabel: "Título",
      titlePlaceholder: "Título",
      coverImageLabel: "Imagen de portada (JPG, PNG, WebP, máx 5MB)",
      uploadingImage: "Subiendo imagen...",
      imageError: "Error de imagen: {{error}}",
      coverImagePreviewAlt: "Vista previa",
      contentLabel: "Contenido (Markdown, máx {{max}} caracteres)",
      contentPlaceholder: `Ejemplo:\n# Título\n\n**Negrita** y _cursiva_ y [un link](https://ejemplo.com)\n\n- Lista\n- De\n- Elementos\n\n> Una cita\n\ncódigo`,
      publishing: "Publicando...",
      publish: "Publicar",
      success: "¡Artículo publicado!",
    },
  },
  product: {
    details: {
      sku: "SKU:",
      likes: "likes",
      views: "visualizaciones",
      confidence: "confianza",
      submittedBy: "Creado por",
      lastModified: "Última modificación por",
      verifiedDimensions: "Dimensiones Verificadas",
    },
    actions: {
      like: "Me Gusta",
      liked: "Me Gusta",
      suggestDifferent: "Sugerir Diferencia",
      share: "Compartir",
      copied: "¡Copiado!",
      reportIssue: "Reportar Problema",
    },
    tabs: {
      specifications: "Especificaciones",
      alternatives: "Dimensiones Alternativas",
      comments: "Comentarios",
      history: "Historial de Versiones",
      previous: "Anterior",
      next: "Siguiente",
    },
    specifications: {
      title: "Especificaciones del Producto",
      packageWeight: "Peso del Paquete:",
      weight: "Peso:",
      notSpecified: "No especificado",
      comment: "Comentarios del creador:",
    },
    alternatives: {
      noAlternatives: "Sin Dimensiones Alternativas",
      noAlternativesMessage:
        "Este producto actualmente no tiene medidas alternativas enviadas por la comunidad.",
    },
    comments: {
      title: "Comentarios",
      noComments: "Aún no hay comentarios.",
      loginToComment: "Debes iniciar sesión para ver y escribir comentarios.",
      add: "Agregar comentario",
      addPlaceholder: "Escribe tu comentario aquí...",
      errorAdd: "No se pudo agregar el comentario. Intenta nuevamente.",
    },
    history: {
      title: "Historial de Versiones",
      updated: "Dimensiones actualizadas y medidas verificadas",
      initialSubmission: "Envío inicial con dimensiones del producto",
    },
    suggestedCorrectionTitle: "Corrección sugerida para {{productName}}",
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
        description:
          "Los usuarios miden y envían dimensiones de embalaje para productos que poseen o manejan.",
      },
      step2: {
        title: "Los Datos Se Verifican",
        description:
          "Múltiples envíos y comentarios de la comunidad aseguran precisión y confiabilidad.",
      },
      step3: {
        title: "Todos Se Benefician",
        description:
          "Acceso gratuito a datos de embalaje precisos y colaborativos para todos.",
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
      description:
        "¿Listo para contribuir al futuro de los datos de embalaje? Únete a nuestra comunidad hoy.",
      addProduct: "Agregar Tu Primer Producto",
      contactUs: "Contáctanos",
    },
  },
  contact: {
    title: "Contáctanos",
    subtitle:
      "¿Tienes preguntas, sugerencias o quieres colaborar? Nos encantaría saber de ti.",
    email: {
      title: "Envíanos un Email",
      description:
        "Para cualquier pregunta, sugerencia o consulta comercial, por favor contáctanos:",
      responseTime:
        "Típicamente respondemos dentro de 24-48 horas durante días hábiles.",
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
        description:
          "Problemas con el sitio web, precisión de datos o problemas de cuenta",
      },
      data: {
        title: "Contribuciones de Datos:",
        description: "Preguntas sobre agregar productos o pautas de medición",
      },
      business: {
        title: "Asociaciones Comerciales:",
        description:
          "Acceso a API, necesidades de datos masivos u oportunidades de colaboración",
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
    subtitle:
      "Tu privacidad y protección de datos son importantes para nosotros.",
    lastUpdated: "Última actualización:",
    sections: {
      introduction: {
        title: "Introducción",
        description1:
          'Dimsure ("nosotros", "nuestro" o "nos") está comprometido a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos tu información cuando usas nuestro sitio web y servicios.',
        description2:
          "Al usar Dimsure, aceptas la recopilación y uso de información de acuerdo con esta política.",
      },
      informationWeCollect: {
        title: "Información que Recopilamos",
        personalInfo: {
          title: "Información Personal",
          googleAccount:
            "Nombre, dirección de correo electrónico y foto de perfil cuando inicias sesión con Google",
          username:
            "Nombre de usuario personalizado que eliges para tu perfil público",
          contributions:
            "Datos de productos, dimensiones y descripciones que envías",
          interactions:
            "Me gusta, visualizaciones, comentarios y otras actividades de la plataforma",
        },
        automaticInfo: {
          title: "Información Recopilada Automáticamente",
          usageData:
            "Páginas visitadas, tiempo transcurrido e interacciones del usuario",
          deviceInfo:
            "Tipo de navegador, sistema operativo e identificadores de dispositivo",
          ipAddress: "Para propósitos de seguridad y análisis",
          cookies: "Para mejorar tu experiencia y recordar preferencias",
        },
      },
      howWeUse: {
        title: "Cómo Usamos tu Información",
        accountManagement: "Crear y gestionar tu cuenta de usuario",
        serviceProvision:
          "Permitirte contribuir y acceder a datos de dimensiones de productos",
        attribution:
          "Mostrar tus contribuciones con tu nombre de usuario elegido",
        communication:
          "Enviar actualizaciones importantes sobre nuestro servicio",
        analytics: "Entender patrones de uso para mejorar nuestra plataforma",
        security: "Proteger contra fraude y acceso no autorizado",
        legalCompliance:
          "Cumplir obligaciones legales y hacer cumplir nuestros términos",
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
          username:
            "Tu nombre de usuario y contribuciones de productos son públicamente visibles",
          productData:
            "Los datos de productos que envías se convierten en parte de nuestra base de datos pública",
          comments:
            "Los comentarios e interacciones en productos se muestran públicamente",
        },
      },
      dataSecurity: {
        title: "Seguridad de Datos",
        encryption: "Todos los datos están encriptados en tránsito y en reposo",
        accessControl:
          "Acceso limitado a datos personales según necesidad de conocimiento",
        googleSecurity:
          "Aprovechamos la infraestructura de seguridad de nivel empresarial de Google",
        regularUpdates:
          "Las medidas de seguridad se actualizan y monitorean continuamente",
        dataMinimization:
          "Solo recopilamos datos necesarios para nuestros servicios",
      },
      yourRights: {
        title: "Tus Derechos y Opciones",
        accountManagement: {
          title: "Gestión de Cuenta",
          access: "Ver y descargar tus datos personales",
          correction: "Actualizar o corregir tu información",
          deactivation:
            "Desactivar tu cuenta (datos preservados para reactivación)",
          usernameChanges: "Modificar tu nombre de usuario público",
        },
        dataControl: {
          title: "Control de Datos",
          cookiePreferences:
            "Gestionar configuración de cookies en tu navegador",
          marketingOptOut:
            "Cancelar suscripción a comunicaciones promocionales",
          dataPortability:
            "Solicitar una copia de tus datos en formato portable",
        },
        note: "Las contribuciones de productos pueden permanecer en nuestra base de datos incluso después de la desactivación de la cuenta para mantener la integridad de datos para la comunidad. Tu nombre de usuario será anonimizado si eliges eliminar permanentemente tu cuenta.",
      },
      internationalUsers: {
        title: "Usuarios Internacionales",
        gdprCompliance: {
          title: "Cumplimiento GDPR (Usuarios de la UE)",
          description:
            "Si te encuentras en la Unión Europea, tienes derechos adicionales bajo GDPR:",
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
          optOutSale:
            "Optar por no participar en la venta de información personal",
          nonDiscrimination:
            "No discriminación por ejercer derechos de privacidad",
        },
      },
      cookies: {
        title: "Cookies y Seguimiento",
        description:
          "Usamos cookies y tecnologías similares para mejorar tu experiencia:",
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
        deactivatedAccounts:
          "Datos personales preservados para posible reactivación",
        productContributions:
          "Retenidos indefinidamente para beneficio de la comunidad",
        analyticsData: "Datos agregados retenidos hasta 26 meses",
        legalRequirements:
          "Algunos datos pueden retenerse más tiempo por cumplimiento legal",
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
      followX: "Síguenos en X",
    },
    copyright: "© {{year}} Dimsure. Todos los derechos reservados.",
    poweredBy: "Desarrollado por",
  },
  disputes: {
    title: "Disputas de la Comunidad",
    subtitle:
      "Ayuda a resolver desacuerdos de mediciones y mejora la calidad de los datos",
    reportIssue: "Reportar Problema",
    admin: "Admin",
    tabs: {
      all: "Todas",
      open: "Abiertas",
      inReview: "En Revisión",
      resolved: "Resueltas",
      rejected: "Rechazadas",
      myReports: "Mis Reportes",
    },
    empty: {
      noDisputes: "No se encontraron disputas",
      noReportsYet: "Aún no has reportado ningún problema.",
      noMatchingFilter: "Ninguna disputa coincide con el filtro actual.",
    },
    dispute: {
      untitled: "Disputa Sin Título",
      product: "Producto:",
      unknownProduct: "Producto Desconocido",
      noDescription: "No se proporcionó descripción",
      evidence: {
        current: "Actual:",
        proposed: "Propuesto:",
        evidence: "Evidencia:",
        evidenceImage: "Imagen de Evidencia:",
      },
      createdBy: "Por",
      unknownDate: "Fecha desconocida",
      pendingCreatorAction: "Esperando la edición del creador",
      youCanEditProduct: "Puedes editar el producto",
      editProduct: "Editar Producto",
    },
    modal: {
      createTitle: "Reportar un Problema de Datos",
      suggestTitle: "Sugerir una Corrección",
      title: "Título",
      titlePlaceholder: "Breve descripción del problema",
      titlePlaceholderSuggest: "Breve descripción de la corrección",
      productSku: "SKU del Producto",
      skuPlaceholder: "ej., APPLE-IPHONE15-128GB",
      issueType: "Tipo de Problema",
      issueTypes: {
        measurement: "Medidas Incorrectas",
        weight: "Peso Incorrecto",
        image: "Imagen Incorrecta/Faltante",
        description: "Descripción Incorrecta",
        category: "Categoría Incorrecta",
        other: "Otro Problema",
      },
      currentValue: "Valor Actual",
      currentWeight: "Peso Actual",
      currentValuePlaceholder: "Medida actual en la base de datos",
      currentWeightPlaceholder:
        "Peso actual en la base de datos (ej., 250g o 0.55lb)",
      proposedValue: "Valor Propuesto",
      correctValue: "Valor Correcto",
      proposedWeight: "Peso Propuesto",
      correctWeight: "Peso Correcto",
      proposedValuePlaceholder:
        "Cuál debería ser la medida (ej., 150 × 75 × 8 mm)",
      proposedWeightPlaceholder:
        "Cuál debería ser el peso (ej., 300g o 0.66lb)",
      description: "Descripción",
      descriptionPlaceholder: "Explica el problema en detalle...",
      descriptionPlaceholderSuggest:
        "Explica el problema y por qué crees que necesita corrección...",
      evidenceSource: "Evidencia/Fuente",
      evidenceSourcePlaceholder:
        "Proporciona fuentes o evidencia para tu corrección...",
      evidenceSourcePlaceholderSuggest:
        "Proporciona fuentes o evidencia para tu corrección (ej., documentación oficial, medidas manuales)...",
      evidenceImage: "Imagen de Evidencia (Opcional)",
      evidenceImageUpload: "Haz clic para subir imagen de evidencia",
      evidenceImageFormats: "PNG, JPG hasta 5MB",
      noMeasurements: "No hay medidas disponibles",
      noWeight: "No hay peso disponible",
      cancel: "Cancelar",
      submit: "Enviar Reporte",
      submitSuggestion: "Enviar Sugerencia",
      submitting: "Enviando...",
      uploading: "Subiendo...",
      validation: {
        titleRequired: "Por favor proporciona un título para la disputa.",
        titleRequiredSuggest:
          "Por favor proporciona un título para la sugerencia.",
        descriptionRequired:
          "Por favor proporciona una descripción del problema.",
        skuRequired: "Por favor proporciona un SKU de producto.",
        valueRequired: "Por favor proporciona el valor correcto.",
        valuesRequired:
          "Para disputas de medidas/peso, proporciona tanto el valor actual como el propuesto.",
        productNotFound: "Producto no encontrado. Por favor verifica el SKU.",
      },
      success: {
        disputeSubmitted: "¡Tu disputa ha sido enviada exitosamente!",
        suggestionSubmitted:
          "¡Tu sugerencia ha sido enviada exitosamente! Gracias por ayudar a mejorar la calidad de nuestros datos.",
      },
      errors: {
        submitFailed: "Error al enviar la disputa. Por favor intenta de nuevo.",
        submitFailedSuggest:
          "Error al enviar la sugerencia. Por favor intenta de nuevo.",
        imageUploadFailed: "Error al Subir Imagen",
        imageUploadFailedDesc:
          "Error al subir la imagen de evidencia, pero la disputa se enviará sin ella.",
      },
    },
  },
  editProduct: {
    title: "Editar Producto",
    subtitle:
      "Realiza cambios en campos individuales y guárdalos de uno en uno",
    backToContributions: "Volver a Mis Contribuciones",
    overview: {
      title: "Resumen del Producto",
    },
    fields: {
      productName: {
        title: "Nombre del Producto",
        placeholder: "Ingresa el nombre del producto",
      },
      description: {
        title: "Descripción",
        placeholder: "Ingresa la descripción del producto",
      },
      brand: {
        title: "Marca",
        placeholder: "Selecciona marca",
      },
      category: {
        title: "Categoría",
        placeholder: "Selecciona categoría",
      },
      weight: {
        title: "Peso",
        placeholder: "Ingresar peso (ej., 250g, 1.5lb)",
      },
      dimensions: {
        title: "Dimensiones (mm)",
        length: "Largo",
        width: "Ancho",
        height: "Alto",
      },
      images: {
        title: "Imágenes del Producto (Máx 3)",
        noImage: "Sin imagen",
        upload: "Subir",
        replace: "Reemplazar",
        setAsMain: "Establecer como imagen principal",
        main: "Principal",
        mainImageUpdated: "¡Imagen principal actualizada exitosamente!",
      },
    },
    actions: {
      viewProductPage: "Ver Página del Producto",
      backToContributions: "Volver a Mis Contribuciones",
      save: "Guardar",
      saving: "Guardando...",
    },
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
    viewDetail: "Ver detalle",
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
    backToList: "Volver a la lista",
    comingSoon: "Próximamente",
  },
  units: {
    mm: "MM",
    inches: "Pulgadas",
    metric: "Métrico",
    imperial: "Imperial",
    g: "g",
    lb: "lb",
    metricSystem: "Sistema Métrico",
    imperialSystem: "Sistema Imperial",
    convertToMetric: "Convertir a Métrico",
    convertToImperial: "Convertir a Imperial",
    length: "Longitud",
    weight: "Peso",
    height: "Altura",
  },
  notifications: {
    title: "Notificaciones",
    loading: "Cargando...",
    empty: "No tenés notificaciones.",
  },
  notFound: {
    title: "404 - Página no encontrada",
    description: "Lo sentimos, la página que buscas no existe o fue movida.",
    backToHome: "Volver al inicio",
    imageAlt: "Página no encontrada",
  },
  admin: {
    products: {
      title: "Moderación de Productos",
      loading: "Cargando productos...",
      filterByStatus: "Filtrar por estado:",
      status: {
        pending: "Pendientes",
        approved: "Aprobados",
        rejected: "Rechazados",
      },
      sku: "SKU",
      brand: "Marca",
      category: "Categoría",
      dimensions: "Dimensiones",
      moderationDetail: "Detalle de moderación",
      approve: "Aprobar",
      reject: "Rechazar",
      imageAlt: "{{name}} imagen {{idx}}",
      modalImageAlt: "Imagen grande",
    },
  },
  pendingApproval:
    "Este producto está pendiente de aprobación y no es visible públicamente.",
} as const;
