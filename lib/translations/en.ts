export const en = {
  site: {
    name: "Dimsure",
    tagline: "Measure it once. Trust it forever.",
    description:
      "A public, community-powered database of box dimensions for products. Optimize your packaging and logistics with verified data.",
  },
  navigation: {
    addProduct: "Add Product",
    search: "Search",
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
    signingOut: "Signing out...",
    signInSuccess: "Signed in successfully",
    welcomeBack: "Welcome back!",
    signInError: "Sign in failed",
    signInErrorDescription:
      "There was a problem signing you in. Please try again.",
    signOutSuccess: "Signed out successfully",
    signOutDescription: "You have been signed out of your account.",
    signOutError: "Sign out failed",
    signOutErrorDescription:
      "There was a problem signing you out. Please try again.",
    termsAgreement:
      "By signing in, you agree to our Terms of Service and Privacy Policy",
    userMenu: {
      profile: "Profile",
      units: "Units",
      signOut: "Sign Out",
      language: "Language",
    },
    profile: {
      title: "Profile",
      description: "This name will be visible to others.",
      username: "Username",
      placeholder: "e.g. LogisticsLover",
      cancel: "Cancel",
      save: "Save",
      saved: "Saved",
      saving: "Saving...",
      requirements: "3–20 characters. Only letters, numbers, and underscores.",
      daysLeft: "You will be able to change your username in {{days}} days",
      errors: {
        required: "Username is required.",
        tooShort: "Must be at least 3 characters.",
        tooLong: "Cannot exceed 20 characters.",
        invalidChars: "Only letters, numbers, and underscores are allowed.",
        permissionDenied: "You don't have permission to do this.",
        notFound: "User not found.",
        insufficientPermissions: "Insufficient permissions.",
        updateFailed: "Failed to update username: {{error}}",
      },
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
  search: {
    title: "Search Products",
    subtitle: "Find products by name, SKU, brand, or dimensions",
    placeholder: "Search by SKU, product name, or brand...",
    searching: "Searching...",
    resultsCount: "products found",
    showingFirst20: "Showing first 20 results",
    noResults: "No products found",
    noProducts: "No products available",
    tryDifferent: "Try adjusting your search terms or filters",
    beFirst: "Be the first to add a product to the database!",
    sortBy: "Sort by",
    sort: {
      name: "Name",
      brand: "Brand",
      date: "Date Added",
    },
    filters: "Filters",
    advancedFilters: "Advanced Filters",
    clearFilters: "Clear All",
    filterOptions: {
      brand: "Brand",
      category: "Category",
      length: "Length",
      width: "Width",
      height: "Height",
      allBrands: "All Brands",
      allCategories: "All Categories",
    },
  },
  addProduct: {
    loading: "Loading...",
    title: "Add New Product",
    subtitle:
      "Help the community by adding verified packaging dimensions for a new product.",
    form: {
      productName: "Product Name",
      productNamePlaceholder: "Switch OLED White",
      productNameHelp:
        "Enter the product name as you see it. The community will help improve naming consistency over time.",
      brand: "Brand",
      brandPlaceholder: "Nintendo",
      sku: "SKU",
      skuPlaceholder: "NSW-OLED-WHT",
      category: "Category",
      categoryPlaceholder: "Consoles",
      description: "Description",
      descriptionPlaceholder:
        "Brief description of the product and packaging...",
      boxDimensions: "Box Dimensions",
      inMillimeters: "(in millimeters)",
      inInches: "(in inches)",
      length: "Length",
      width: "Width",
      height: "Height",
      packageWeight: "Weight",
      weightPlaceholder: "250",
      dimensionsHelp:
        "You can paste dimensions like '203 x 140 x 19' and all three fields will be filled in automatically",
      productImage: "Product Image (Optional)",
      imageUpload: "Click to upload",
      imageFormats: "PNG, JPG up to 5MB",
      maxImages: "3 images max",
      imageReady: "Ready to upload",
      imageError: "Image Error",
      imageUploaded: "Image Uploaded",
      imageUploadedDesc: "Your product image has been uploaded successfully",
      imageUploadFailed: "Upload Failed",
      imageUploadFailedDesc:
        "Failed to upload image, but product will be saved without it",
      uploadingImage: "Uploading image...",
      submittedBy: "Submitted by:",
      attribution:
        'Your contribution will be attributed to your account and will appear in "My Contributions".',
      setAsMain: "Set as main picture",
      submit: "Submit Product",
      submitting: "Creating Product...",
    },
    converter: {
      title: "Units Converter",
      dimensionTitle: "Dimension Converter",
      weightTitle: "Weight Converter",
      dimensions: "Dimensions",
      weight: "Weight",
      mmToInches: "MM to Inches",
      inchesToMm: "Inches to MM",
      gToLb: "G to LB",
      lbToG: "LB to G",
      enterMm: "Enter dimensions in millimeters:",
      enterInches: "Enter dimensions in inches:",
      enterG: "Enter weight in grams:",
      enterLb: "Enter weight in pounds:",
      insert: "Convert and insert",
      allFieldsRequired: "All fields are required",
      positiveNumbers: "All values must be positive numbers",
      errorInToMm:
        "Cannot convert inches to mm when the form is set to inches. Please use the 'MM to Inches' preset.",
      errorMmToIn:
        "Cannot convert mm to inches when the form is set to mm. Please use the 'Inches to MM' preset.",
      errorGToLb:
        "Cannot convert grams to pounds when the form is set to grams. Please use the 'LB to G' preset.",
      errorLbToG:
        "Cannot convert pounds to grams when the form is set to pounds. Please use the 'G to LB' preset.",
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
      nameRequired: "Product name is required",
      nameMinLength: "Product name must be at least 3 characters long",
      nameMaxLength: "Product name must be less than 100 characters",
      skuRequired: "SKU is required",
      skuMinLength: "SKU must be at least 2 characters long",
      skuMaxLength: "SKU must be less than 50 characters",
      skuExists: "A product with this SKU already exists",
      brandRequired: "Brand is required",
      categoryRequired: "Category is required",
      dimensionsRequired: "All dimensions are required",
      dimensionsPositive: "All dimensions must be positive numbers",
      weightPositive: "Weight must be a positive number",
      maxImages: "Maximum 3 images allowed",
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
      noProductsMessage:
        "You haven't submitted any products to the database yet.",
      noResults: "No Results Found",
      noResultsMessage:
        'No products match your search for "{{searchTerm}}". Try a different search term.',
    },
    orphanProducts: {
      notFound: "No contributions found",
      mightNotBeLinked:
        "If you've added products before, they might not be linked to your account.",
      fixMyProducts: "Fix My Products",
    },
    disputeBadge: "In Dispute",
    disputeNotification:
      'A dispute has been opened for your product "{{productName}}".',
    resolutionPendingNotification:
      'A dispute for your product "{{productName}}" has reached the required votes. Please edit your product before the time expires, or the community will be able to edit it.',
  },
  blog: {
    title: "Dimsure Blog",
    subtitle:
      "Articles and tips about packaging, logistics and Dimsure updates.",
    noArticles: "No articles yet",
    noArticlesMessage: "There are no blog articles published yet.",
    backToBlog: "Back to blog",
    by: "By",
    on: "on",
    unknownDate: "Unknown date",
    admin: {
      notAuthorized: "Not authorized",
      loading: "Loading...",
      newPostTitle: "New Blog Post",
      titleLabel: "Title",
      titlePlaceholder: "Title",
      coverImageLabel: "Cover Image (JPG, PNG, WebP, max 5MB)",
      uploadingImage: "Uploading image...",
      imageError: "Image error: {{error}}",
      coverImagePreviewAlt: "Preview",
      contentLabel: "Content (Markdown, max {{max}} characters)",
      contentPlaceholder: `Example:\n# Title\n\n**Bold** and _italic_ and [a link](https://example.com)\n\n- List\n- Of\n- Items\n\n> A quote\n\ncode`,
      publishing: "Publishing...",
      publish: "Publish",
      success: "Post published!",
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
      like: "Like",
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
      previous: "Previous",
      next: "Next",
    },
    specifications: {
      title: "Product Specifications",
      packageWeight: "Package Weight:",
      weight: "Weight:",
      notSpecified: "Not specified",
      comment: "Submitter comments:",
    },
    alternatives: {
      noAlternatives: "No Alternative Dimensions",
      noAlternativesMessage:
        "This product currently has no alternative measurements submitted by the community.",
    },
    comments: {
      title: "Comments",
      noComments: "No comments yet.",
      loginToComment: "You must be logged in to view and write comments.",
      add: "Add comment",
      addPlaceholder: "Write your comment here...",
      errorAdd: "Could not add comment. Please try again.",
    },
    history: {
      title: "Version History",
      updated: "Updated dimensions and verified measurements",
      initialSubmission: "Initial submission with product dimensions",
    },
    suggestedCorrectionTitle: "Suggested correction for {{productName}}",
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
        description:
          "Optimize warehouse space, plan transportation capacity, and improve delivery efficiency.",
      },
      consumers: {
        title: "Consumers",
        description:
          "Make informed purchasing decisions and plan storage space before buying products online.",
      },
    },
    howItWorks: {
      title: "How Dimsure Works",
      step1: {
        title: "Community Contributes",
        description:
          "Users measure and submit packaging dimensions for products they own or handle.",
      },
      step2: {
        title: "Data Gets Verified",
        description:
          "Multiple submissions and community feedback ensure accuracy and reliability.",
      },
      step3: {
        title: "Everyone Benefits",
        description:
          "Free access to accurate, crowd-sourced packaging data for everyone.",
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
      description:
        "Ready to contribute to the future of packaging data? Join our community today.",
      addProduct: "Add Your First Product",
      contactUs: "Contact Us",
    },
  },
  contact: {
    title: "Contact Us",
    subtitle:
      "Have questions, suggestions, or want to collaborate? We'd love to hear from you.",
    email: {
      title: "Email Us",
      description:
        "For any questions, suggestions, or business inquiries, please reach out to us:",
      responseTime:
        "We typically respond within 24-48 hours during business days.",
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
        description:
          "Problems with the website, data accuracy, or account issues",
      },
      data: {
        title: "Data Contributions:",
        description:
          "Questions about adding products or measurement guidelines",
      },
      business: {
        title: "Business Partnerships:",
        description:
          "API access, bulk data needs, or collaboration opportunities",
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
          googleAccount:
            "Name, email address, and profile picture when you sign in with Google",
          username: "Custom username you choose for your public profile",
          contributions:
            "Product data, dimensions, and descriptions you submit",
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
        serviceProvision:
          "Enable you to contribute and access product dimension data",
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
          username:
            "Your username and product contributions are publicly visible",
          productData:
            "Product data you submit becomes part of our public database",
          comments:
            "Comments and interactions on products are publicly displayed",
        },
      },
      dataSecurity: {
        title: "Data Security",
        encryption: "All data is encrypted in transit and at rest",
        accessControl:
          "Limited access to personal data on a need-to-know basis",
        googleSecurity:
          "We leverage Google's enterprise-grade security infrastructure",
        regularUpdates:
          "Security measures are continuously updated and monitored",
        dataMinimization: "We only collect data necessary for our services",
      },
      yourRights: {
        title: "Your Rights and Choices",
        accountManagement: {
          title: "Account Management",
          access: "View and download your personal data",
          correction: "Update or correct your information",
          deactivation:
            "Deactivate your account (data preserved for reactivation)",
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
          description:
            "If you are located in the European Union, you have additional rights under GDPR:",
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
        description:
          "We use cookies and similar technologies to enhance your experience:",
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
        deactivatedAccounts:
          "Personal data preserved for potential reactivation",
        productContributions: "Retained indefinitely for community benefit",
        analyticsData: "Aggregated data retained for up to 26 months",
        legalRequirements:
          "Some data may be retained longer for legal compliance",
      },
      changesToPolicy: {
        title: "Changes to This Privacy Policy",
        description:
          'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.',
      },
      contact: {
        title: "Contact Us",
        description:
          "If you have any questions about this Privacy Policy or our data practices, please contact us:",
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
      followX: "Follow us on X",
    },
    copyright: "© {{year}} Dimsure. All rights reserved.",
    poweredBy: "Powered by",
  },
  disputes: {
    title: "Community Disputes",
    subtitle: "Help resolve measurement disagreements and improve data quality",
    reportIssue: "Report Issue",
    admin: "Admin",
    tabs: {
      all: "All",
      open: "Open",
      inReview: "In Review",
      resolved: "Resolved",
      rejected: "Rejected",
      myReports: "My Reports",
    },
    empty: {
      noDisputes: "No disputes found",
      noReportsYet: "You haven't reported any issues yet.",
      noMatchingFilter: "No disputes match the current filter.",
    },
    dispute: {
      untitled: "Untitled Dispute",
      product: "Product:",
      unknownProduct: "Unknown Product",
      noDescription: "No description provided",
      evidence: {
        current: "Current:",
        proposed: "Proposed:",
        evidence: "Evidence:",
        evidenceImage: "Evidence Image:",
      },
      createdBy: "By",
      unknownDate: "Unknown date",
      pendingCreatorAction: "Pending creator action",
      youCanEditProduct: "You can edit the product",
      editProduct: "Edit Product",
    },
    modal: {
      createTitle: "Report a Data Issue",
      suggestTitle: "Suggest a Correction",
      title: "Title",
      titlePlaceholder: "Brief description of the issue",
      titlePlaceholderSuggest: "Brief description of the correction",
      productSku: "Product SKU",
      skuPlaceholder: "e.g., APPLE-IPHONE15-128GB",
      issueType: "Issue Type",
      issueTypes: {
        measurement: "Incorrect Measurements",
        weight: "Wrong Weight",
        image: "Wrong/Missing Image",
        description: "Wrong Description",
        category: "Category Mismatch",
        other: "Other Issue",
      },
      currentValue: "Current Value",
      currentWeight: "Current Weight",
      currentValuePlaceholder: "Current measurement in the database",
      currentWeightPlaceholder:
        "Current weight in the database (e.g., 250g or 0.55lb)",
      proposedValue: "Proposed Value",
      correctValue: "Correct Value",
      proposedWeight: "Proposed Weight",
      correctWeight: "Correct Weight",
      proposedValuePlaceholder:
        "What the measurement should be (e.g., 150 × 75 × 8 mm)",
      proposedWeightPlaceholder:
        "What the weight should be (e.g., 300g or 0.66lb)",
      description: "Description",
      descriptionPlaceholder: "Explain the issue in detail...",
      descriptionPlaceholderSuggest:
        "Explain the issue and why you think it needs correction...",
      evidenceSource: "Evidence/Source",
      evidenceSourcePlaceholder:
        "Provide sources or evidence for your correction...",
      evidenceSourcePlaceholderSuggest:
        "Provide sources or evidence for your correction (e.g., official documentation, manual measurements)...",
      evidenceImage: "Evidence Image (Optional)",
      evidenceImageUpload: "Click to upload evidence image",
      evidenceImageFormats: "PNG, JPG up to 5MB",
      noMeasurements: "No measurements available",
      noWeight: "No weight available",
      cancel: "Cancel",
      submit: "Submit Report",
      submitSuggestion: "Submit Suggestion",
      submitting: "Submitting...",
      uploading: "Uploading...",
      validation: {
        titleRequired: "Please provide a title for the dispute.",
        titleRequiredSuggest: "Please provide a title for the suggestion.",
        descriptionRequired: "Please provide a description of the issue.",
        skuRequired: "Please provide a product SKU.",
        valueRequired: "Please provide the correct value.",
        valuesRequired:
          "For measurement/weight disputes, please provide both current and proposed values.",
        productNotFound: "Product not found. Please check the SKU.",
      },
      success: {
        disputeSubmitted: "Your dispute has been submitted successfully!",
        suggestionSubmitted:
          "Your suggestion has been submitted successfully! Thank you for helping improve our data quality.",
      },
      errors: {
        submitFailed: "Failed to submit dispute. Please try again.",
        submitFailedSuggest: "Failed to submit suggestion. Please try again.",
        imageUploadFailed: "Image Upload Failed",
        imageUploadFailedDesc:
          "Failed to upload evidence image, but dispute will be submitted without it.",
      },
    },
  },
  editProduct: {
    title: "Edit Product",
    subtitle: "Make changes to individual fields and save them one at a time",
    backToProduct: "Back to Product",
    backToContributions: "Back to My Contributions",
    saving: "Saving...",
    saved: "Saved",
    save: "Save",
    uploading: "Uploading...",
    overview: {
      title: "Product Overview",
    },
    fields: {
      name: "Product Name",
      namePlaceholder: "Enter product name",
      description: "Description",
      descriptionPlaceholder: "Enter product description",
      brand: "Brand",
      brandPlaceholder: "Select brand",
      category: "Category",
      categoryPlaceholder: "Select category",
      weight: "Weight",
      weightPlaceholder: "Enter weight (e.g., 250g, 1.5lb)",
      dimensionsTitle: "Dimensions",
      dimensions: {
        length: "Length",
        width: "Width",
        height: "Height",
      },
      images: "Images",
      image: "Image",
      mainImage: "Main Image",
      uploadImage: "Upload Image",
    },
    actions: {
      viewProductPage: "View Product Page",
      backToContributions: "Back to My Contributions",
      save: "Save",
      saving: "Saving...",
    },
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
    viewDetail: "View Detail",
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
    backToList: "Back to list",
    comingSoon: "Coming Soon",
  },
  units: {
    mm: "MM",
    inches: "Inches",
    metric: "Metric",
    imperial: "Imperial",
    g: "g",
    lb: "lb",
    metricSystem: "Metric System",
    imperialSystem: "Imperial System",
    convertToMetric: "Convert to Metric",
    convertToImperial: "Convert to Imperial",
    width: "Width",
    height: "Height",
    length: "Length",
  },
  notifications: {
    title: "Notifications",
    loading: "Loading...",
    empty: "You have no notifications.",
  },
  notFound: {
    title: "404 - Page Not Found",
    description:
      "Sorry, the page you are looking for does not exist or has been moved.",
    backToHome: "Back to Home",
    imageAlt: "Page not found",
  },
  admin: {
    products: {
      title: "Product Moderation",
      loading: "Loading products...",
      filterByStatus: "Filter by status:",
      status: {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
      },
      sku: "SKU",
      brand: "Brand",
      category: "Category",
      dimensions: "Dimensions",
      moderationDetail: "Moderation detail",
      approve: "Approve",
      reject: "Reject",
      imageAlt: "{{name}} image {{idx}}",
      modalImageAlt: "Large image",
    },
  },
  pendingApproval:
    "This product is pending approval and is not publicly visible.",
} as const;
