export type Locale = 'fr-FR' | 'en-US' | 'es-ES' | 'de-DE' | 'pt-PT';

export interface Translations {
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    filter: string;
    export: string;
    import: string;
    loading: string;
    error: string;
    success: string;
    confirm: string;
    yes: string;
    no: string;
    all: string;
    none: string;
    optional: string;
    required: string;
    from: string;
    to: string;
    min: string;
    max: string;
  };

  // Search
  search: {
    intelligentPlaceholder: string;
    advancedFilters: string;
    clearFilters: string;
    birthDateRange: string;
    weightRange: string;
    tips: string;
    tip1: string;
    tip2: string;
    tip3: string;
  };

  nav: {
    dashboard: string;
    animals: string;
    litters: string;
    treatments: string;
    cages: string;
    tags: string;
    statistics: string;
    settings: string;
    planning: string;
    reproduction: string;
  };

  // Animals
  animals: {
    title: string;
    addAnimal: string;
    editAnimal: string;
    animalDetails: string;
    name: string;
    identifier: string;
    sex: string;
    breed: string;
    birthDate: string;
    origin: string;
    cage: string;
    status: string;
    tags: string;
    notes: string;
    mother: string;
    father: string;
    weights: string;
    treatments: string;
    offspring: string;
    consumedDate: string;
    consumedWeight: string;
    markConsumed: string;
    confirmConsumption: string;
  };

  // Sex values
  sex: {
    M: string;
    F: string;
    U: string;
  };

  // Status values
  status: {
    REPRO: string;
    GROW: string;
    RETIRED: string;
    DEAD: string;
    CONSUMED: string;
  };

  // Origin values
  origin: {
    BORN_HERE: string;
    PURCHASED: string;
  };

  // Cages
  cages: {
    title: string;
    addCage: string;
    editCage: string;
    cageDetails: string;
    name: string;
    description: string;
    capacity: string;
    location: string;
    occupants: string;
    availability: string;
  };

  // Tags
  tags: {
    title: string;
    addTag: string;
    editTag: string;
    name: string;
    color: string;
    description: string;
    usage: string;
  };

  // Statistics
  stats: {
    title: string;
    overview: string;
    performance: string;
    reproduction: string;
    growth: string;
    totalAnimals: string;
    reproductors: string;
    growing: string;
    consumed: string;
    averageWeight: string;
    reproductionRate: string;
    survivalRate: string;
    averageLitterSize: string;
    subtitles: {
      animalsRegistered: string;
      littersRegistered: string;
      littersPerFemalePerYear: string;
      animals: string;
      activeAnimals: string;
    };
  };

  // Settings
  settings: {
    title: string;
    general: string;
    appearance: string;
    data: string;
    breeding: string;
    theme: string;
    language: string;
    units: string;
    gestationDuration: string;
    weaningDuration: string;
    reproductionReadyDuration: string;
    slaughterReadyDuration: string;
    exportFormat: string;
    exportData: string;
    importData: string;
    clearData: string;
    confirmClearData: string;
  };

  // Time units
  time: {
    days: string;
    weeks: string;
    months: string;
    years: string;
  };

  // Messages
  messages: {
    animalSaved: string;
    animalDeleted: string;
    cageSaved: string;
    cageDeleted: string;
    tagSaved: string;
    tagDeleted: string;
    dataExported: string;
    dataImported: string;
    dataCleared: string;
    invalidFile: string;
    operationFailed: string;
  };

  // Error handling
  errors: {
    title: string;
    unexpected: string;
    reload: string;
    goHome: string;
    developmentDetails: string;
  };

  // Charts
  charts: {
    weightEvolution: string;
    noWeightData: string;
    currentWeight: string;
    totalGain: string;
    averageDailyGain: string;
    initialWeight: string;
    weight: string;
    weightUnit: string;
    month: string;
    births: string;
    males: string;
    females: string;
    retired: string;
  };

  // PrintableSheet
  printableSheet: {
    generalInfo: string;
    generatedOn: string;
    by: string;
    unknownCage: string;
    notSpecified: string;
  };

  // Modals
  modals: {
    mortality: {
      title: string;
      deathDate: string;
      deathDateHelperText: string;
      suspectedCause: string;
      suspectedCausePlaceholder: string;
      necropsyPerformed: string;
      notes: string;
      notesPlaceholder: string;
      errorEnterDate: string;
      errorFutureDate: string;
      errorBeforeBirth: string;
      errorSavingDeath: string;
    };
    litter: {
      title: string;
      titleRecord: string;
      kindlingDate: string;
      bornAlive: string;
      stillborn: string;
      malesToCreate: string;
      femalesToCreate: string;
      notes: string;
      notesPlaceholder: string;
      autoCreateRabbits: string;
      totalVersus: string;
      mother: string;
      father: string;
      motherNotSpecified: string;
      fatherNotSpecified: string;
      breedingInfo: string;
      expectedKindlingDate: string;
      saveLitter: string;
      errorMotherNotFound: string;
      errorEnterKindlingDate: string;
      errorNegativeNumbers: string;
      errorTotalExceeds: string;
      errorSavingLitter: string;
    };
    quickWeight: {
      title: string;
      animal: string;
      animalPlaceholder: string;
      weightGrams: string;
      notesOptional: string;
      weightPlaceholder: string;
      notesPlaceholder: string;
      errorValidWeight: string;
      errorSavingWeight: string;
    };
    treatment: {
      title: string;
      animal: string;
      animalPlaceholder: string;
      product: string;
      productPlaceholder: string;
      dose: string;
      dosePlaceholder: string;
      route: string;
      reason: string;
      reasonPlaceholder: string;
      withdrawalDays: string;
      withdrawalPlaceholder: string;
      withdrawalHelperText: string;
      notesOptional: string;
      notesPlaceholder: string;
      routes: {
        oral: string;
        subcutaneous: string;
        intramuscular: string;
        other: string;
      };
      errorSelectAnimal: string;
      errorEnterProduct: string;
      errorSavingTreatment: string;
    };
    breeding: {
      title: string;
      female: string;
      male: string;
      method: string;
      date: string;
      notes: string;
      notesPlaceholder: string;
      expectedKindlingDate: string;
      gestationDays: string;
      methods: {
        natural: string;
        artificialInsemination: string;
      };
      animalName: {
        noName: string;
      };
      errorSelectFemale: string;
      errorEnterDate: string;
      errorSavingBreeding: string;
    };
  };

  // Litters
  litters: {
    title: string;
    searchPlaceholder: string;
    sortBy: string;
    order: string;
    sortOptions: {
      date: string;
      mother: string;
      offspring: string;
    };
    orderOptions: {
      descending: string;
      ascending: string;
    };
    status: {
      weaned: string;
      lactating: string;
      toWean: string;
    };
    labels: {
      mother: string;
      father: string;
      unknown: string;
      offspringCreated: string;
      weaning: string;
      estimatedWeaning: string;
      weaned: string;
    };
  };

  // Validation
  validation: {
    invalidDate: string;
    invalidId: string;
    nameRequired: string;
    nameTooLong: string;
    sexRequired: string;
    statusRequired: string;
    birthDateFuture: string;
    diagnosisAfterBreeding: string;
    weaningAfterKindling: string;
    weanedExceedsAlive: string;
    weightPositive: string;
    productRequired: string;
    withdrawalAfterTreatment: string;
  };

  // Export
  export: {
    animals: string;
    weights: string;
    litters: string;
    treatments: string;
    cages: string;
    tags: string;
    headers: {
      id: string;
      name: string;
      identifier: string;
      sex: string;
      breed: string;
      birthDate: string;
      origin: string;
      motherId: string;
      fatherId: string;
      cage: string;
      status: string;
      tags: string;
      consumedDate: string;
      consumedWeight: string;
      notes: string;
      animalId: string;
      date: string;
      weight: string;
      kindlingDate: string;
      bornAlive: string;
      stillborn: string;
      weaningDate: string;
      weanedCount: string;
      product: string;
      lotNumber: string;
      dose: string;
      route: string;
      reason: string;
      withdrawalUntil: string;
      description: string;
      capacity: string;
      location: string;
      color: string;
    };
  };

  // Dashboard
  dashboard: {
    title: string;
    welcomeTitle: string;
    welcomeMessage: string;
    loadSampleData: string;
    createFirstAnimal: string;
    viewDetails: string;
    overview: string;
    kpis: {
      liveAnimals: string;
      femalesAndMales: string;
      reproductors: string;
      reproductorsSubtitle: string;
      reproductionPlanning: string;
      reproductionPlanningSubtitle: string;
      quickActions: string;
      quickActionsSubtitle: string;
      activeTreatments: string;
      activeTreatmentsSubtitle: string;
      statistics: string;
      statisticsSubtitle: string;
    };
    quickActions: {
      newAnimal: string;
      quickWeighing: string;
      newLitter: string;
      treatment: string;
      qrCodes: string;
    };
  };

  // Statistics page
  statisticsPage: {
    title: string;
    overview: string;
    reproduction: string;
    consumption: string;
    health: string;
    otherMetrics: string;
    reportGenerated: string;
    cards: {
      totalAnimals: string;
      totalAnimalsSubtitle: string;
      activeAnimals: string;
      activeAnimalsSubtitle: string;
      reproductors: string;
      reproductorsSubtitle: string;
      growing: string;
      growingSubtitle: string;
      totalLitters: string;
      totalLittersSubtitle: string;
      averageSize: string;
      averageSizeSubtitle: string;
      survivalRate: string;
      survivalRateSubtitle: string;
      efficiency: string;
      efficiencySubtitle: string;
      totalConsumed: string;
      totalConsumedSubtitle: string;
      totalWeight: string;
      totalWeightSubtitle: string;
      averageWeight: string;
      averageWeightSubtitle: string;
      totalTreatments: string;
      totalTreatmentsSubtitle: string;
      activeWithdrawals: string;
      activeWithdrawalsSubtitle: string;
      commonTreatments: string;
      averageAge: string;
      averageAgeSubtitle: string;
      averageAnimalWeight: string;
      averageAnimalWeightSubtitle: string;
      cageOccupancy: string;
      cageOccupancySubtitle: string;
    };
  };
}

const frTranslations: Translations = {
  common: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    import: 'Importer',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    confirm: 'Confirmer',
    yes: 'Oui',
    no: 'Non',
    all: 'Tous',
    none: 'Aucun',
    optional: 'Optionnel',
    required: 'Obligatoire',
    from: 'De',
    to: 'À',
    min: 'Min',
    max: 'Max',
  },
  search: {
    intelligentPlaceholder: 'Recherche intelligente : nom, identifiant, race, cage, notes...',
    advancedFilters: 'Filtres avancés',
    clearFilters: 'Effacer tous les filtres',
    birthDateRange: 'Plage de dates de naissance',
    weightRange: 'Plage de poids',
    tips: 'Conseils de recherche',
    tip1: 'La recherche intelligente tolère les fautes de frappe et les correspondances partielles',
    tip2: 'Combinez les filtres pour affiner vos résultats',
    tip3: 'Les résultats sont classés par pertinence avec les correspondances exactes en premier',
  },
  nav: {
    dashboard: 'Tableau de bord',
    animals: 'Animaux',
    litters: 'Portées',
    treatments: 'Traitements',
    cages: 'Cages',
    tags: 'Étiquettes',
    statistics: 'Statistiques',
    settings: 'Paramètres',
    planning: 'Planning',
    reproduction: 'Reproduction',
  },
  animals: {
    title: 'Gestion des animaux',
    addAnimal: 'Ajouter un animal',
    editAnimal: 'Modifier l\'animal',
    animalDetails: 'Détails de l\'animal',
    name: 'Nom',
    identifier: 'Identifiant',
    sex: 'Sexe',
    breed: 'Race',
    birthDate: 'Date de naissance',
    origin: 'Origine',
    cage: 'Cage',
    status: 'Statut',
    tags: 'Étiquettes',
    notes: 'Notes',
    mother: 'Mère',
    father: 'Père',
    weights: 'Pesées',
    treatments: 'Traitements',
    offspring: 'Descendance',
    consumedDate: 'Date de consommation',
    consumedWeight: 'Poids à la consommation',
    markConsumed: 'Marquer comme consommé',
    confirmConsumption: 'Êtes-vous sûr de vouloir marquer cet animal comme consommé ?',
  },
  sex: {
    M: 'Mâle',
    F: 'Femelle',
    U: 'Inconnu',
  },
  status: {
    REPRO: 'Reproducteur',
    GROW: 'Croissance',
    RETIRED: 'Retraité',
    DEAD: 'Décédé',
    CONSUMED: 'Consommé',
  },
  origin: {
    BORN_HERE: 'Né ici',
    PURCHASED: 'Acheté',
  },
  cages: {
    title: 'Gestion des cages',
    addCage: 'Ajouter une cage',
    editCage: 'Modifier la cage',
    cageDetails: 'Détails de la cage',
    name: 'Nom',
    description: 'Description',
    capacity: 'Capacité',
    location: 'Emplacement',
    occupants: 'Occupants',
    availability: 'Disponibilité',
  },
  tags: {
    title: 'Gestion des étiquettes',
    addTag: 'Ajouter une étiquette',
    editTag: 'Modifier l\'étiquette',
    name: 'Nom',
    color: 'Couleur',
    description: 'Description',
    usage: 'Utilisation',
  },
  stats: {
    title: 'Statistiques',
    overview: 'Vue d\'ensemble',
    performance: 'Performance',
    reproduction: 'Reproduction',
    growth: 'Croissance',
    totalAnimals: 'Total animaux',
    reproductors: 'Reproducteurs',
    growing: 'En croissance',
    consumed: 'Consommés',
    averageWeight: 'Poids moyen',
    reproductionRate: 'Taux de reproduction',
    survivalRate: 'Taux de survie',
    averageLitterSize: 'Taille moyenne des portées',
    subtitles: {
      animalsRegistered: 'animaux enregistrés',
      littersRegistered: 'portées enregistrées',
      littersPerFemalePerYear: 'portées/femelle/an',
      animals: 'animaux',
      activeAnimals: 'animaux actifs',
    },
  },
  settings: {
    title: 'Paramètres',
    general: 'Général',
    appearance: 'Apparence',
    data: 'Données',
    breeding: 'Élevage',
    theme: 'Thème',
    language: 'Langue',
    units: 'Unités',
    gestationDuration: 'Durée de gestation',
    weaningDuration: 'Durée de sevrage',
    reproductionReadyDuration: 'Durée avant reproduction',
    slaughterReadyDuration: 'Durée avant abattage',
    exportFormat: 'Format d\'export',
    exportData: 'Exporter les données',
    importData: 'Importer les données',
    clearData: 'Effacer les données',
    confirmClearData: 'Êtes-vous sûr de vouloir effacer toutes les données ?',
  },
  time: {
    days: 'jours',
    weeks: 'semaines',
    months: 'mois',
    years: 'années',
  },
  messages: {
    animalSaved: 'Animal enregistré avec succès',
    animalDeleted: 'Animal supprimé avec succès',
    cageSaved: 'Cage enregistrée avec succès',
    cageDeleted: 'Cage supprimée avec succès',
    tagSaved: 'Étiquette enregistrée avec succès',
    tagDeleted: 'Étiquette supprimée avec succès',
    dataExported: 'Données exportées avec succès',
    dataImported: 'Données importées avec succès',
    dataCleared: 'Données effacées avec succès',
    invalidFile: 'Fichier invalide',
    operationFailed: 'Opération échouée',
  },

  // Error handling
  errors: {
    title: 'Oups ! Une erreur s\'est produite',
    unexpected: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
    reload: 'Réessayer',
    goHome: 'Retour à l\'accueil',
    developmentDetails: 'Détails de l\'erreur (développement uniquement):',
  },
  charts: {
    weightEvolution: 'Évolution du poids',
    noWeightData: 'Aucune donnée de poids disponible',
    currentWeight: 'Poids actuel',
    totalGain: 'Gain total',
    averageDailyGain: 'Gain moyen/jour',
    initialWeight: 'Poids initial',
    weight: 'Poids',
    weightUnit: 'g',
    month: 'Mois',
    births: 'Naissances',
    males: 'Mâles',
    females: 'Femelles',
    retired: 'Retraités',
  },

  // PrintableSheet
  printableSheet: {
    generalInfo: 'Informations générales',
    generatedOn: 'Fiche générée le',
    by: 'par',
    unknownCage: 'Cage inconnue',
    notSpecified: 'Non renseignée',
  },
  modals: {
    mortality: {
      title: 'Déclarer un décès',
      deathDate: 'Date de décès',
      deathDateHelperText: 'Ne peut pas être dans le futur',
      suspectedCause: 'Cause suspectée',
      suspectedCausePlaceholder: 'Maladie, accident, vieillesse...',
      necropsyPerformed: 'Nécropsie réalisée',
      notes: 'Notes',
      notesPlaceholder: 'Circonstances, observations...',
      errorEnterDate: 'Veuillez entrer une date de décès',
      errorFutureDate: 'La date de décès ne peut pas être dans le futur',
      errorBeforeBirth: 'La date de décès ne peut pas être antérieure à la naissance',
      errorSavingDeath: 'Erreur lors de l\'enregistrement du décès',
    },
    litter: {
      title: 'Nouvelle portée',
      titleRecord: 'Enregistrer la mise bas',
      kindlingDate: 'Date de mise bas',
      bornAlive: 'Nés vivants',
      stillborn: 'Mort-nés',
      malesToCreate: 'Mâles à créer',
      femalesToCreate: 'Femelles à créer',
      notes: 'Notes',
      notesPlaceholder: 'Observations sur la mise bas, santé des petits...',
      autoCreateRabbits: 'Créer automatiquement les lapereaux',
      totalVersus: 'Total',
      mother: 'Mère',
      father: 'Père',
      motherNotSpecified: 'Non spécifiée',
      fatherNotSpecified: 'Non spécifié',
      breedingInfo: 'Saillie du',
      expectedKindlingDate: 'Mise bas prévue le',
      saveLitter: 'Enregistrer la portée',
      errorMotherNotFound: 'Mère non trouvée',
      errorEnterKindlingDate: 'Veuillez entrer une date de mise bas',
      errorNegativeNumbers: 'Les nombres ne peuvent pas être négatifs',
      errorTotalExceeds: 'Le nombre total de petits à créer ne peut pas dépasser les nés vivants',
      errorSavingLitter: 'Erreur lors de l\'enregistrement de la portée',
    },
    quickWeight: {
      title: 'Pesée rapide',
      animal: 'Animal',
      animalPlaceholder: 'Sélectionner un animal',
      weightGrams: 'Poids (en grammes)',
      notesOptional: 'Notes (optionnel)',
      weightPlaceholder: 'ex: 2500',
      notesPlaceholder: 'Commentaires sur la pesée...',
      errorValidWeight: 'Veuillez entrer un poids valide',
      errorSavingWeight: 'Erreur lors de l\'enregistrement de la pesée',
    },
    treatment: {
      title: 'Traitement rapide',
      animal: 'Animal',
      animalPlaceholder: 'Sélectionner un animal',
      product: 'Produit',
      productPlaceholder: 'Nom du médicament ou traitement',
      dose: 'Dose',
      dosePlaceholder: 'ex: 0.5ml, 1 comprimé',
      route: 'Voie d\'administration',
      reason: 'Motif',
      reasonPlaceholder: 'Raison du traitement',
      withdrawalDays: 'Délai d\'attente (jours)',
      withdrawalPlaceholder: 'ex: 30',
      withdrawalHelperText: 'Nombre de jours d\'attente avant consommation',
      notesOptional: 'Notes (optionnel)',
      notesPlaceholder: 'Commentaires sur le traitement...',
      routes: {
        oral: 'Oral',
        subcutaneous: 'Sous-cutané',
        intramuscular: 'Intramusculaire',
        other: 'Autre',
      },
      errorSelectAnimal: 'Veuillez sélectionner un animal',
      errorEnterProduct: 'Veuillez entrer le nom du produit',
      errorSavingTreatment: 'Erreur lors de l\'enregistrement du traitement',
    },
    breeding: {
      title: 'Nouvelle saillie',
      female: 'Femelle',
      male: 'Mâle',
      method: 'Méthode',
      date: 'Date de saillie',
      notes: 'Notes',
      notesPlaceholder: 'Observations, conditions particulières...',
      expectedKindlingDate: 'Date de mise bas estimée',
      gestationDays: 'Gestation',
      methods: {
        natural: 'Naturelle',
        artificialInsemination: 'Insémination artificielle',
      },
      animalName: {
        noName: 'Sans nom',
      },
      errorSelectFemale: 'Veuillez sélectionner une femelle',
      errorEnterDate: 'Veuillez entrer une date de saillie',
      errorSavingBreeding: 'Erreur lors de l\'enregistrement de la saillie',
    },
  },

  // Litters
  litters: {
    title: 'Gestion des portées',
    searchPlaceholder: 'Rechercher par mère, père ou notes...',
    sortBy: 'Trier par',
    order: 'Ordre',
    sortOptions: {
      date: 'Date de naissance',
      mother: 'Mère',
      offspring: 'Nombre de petits',
    },
    orderOptions: {
      descending: 'Décroissant',
      ascending: 'Croissant',
    },
    status: {
      weaned: 'Sevrée',
      lactating: 'En lactation',
      toWean: 'À sevrer',
    },
    labels: {
      mother: 'Mère',
      father: 'Père',
      unknown: 'Inconnue',
      offspringCreated: 'Descendants créés',
      weaning: 'Sevrage',
      estimatedWeaning: 'Sevrage estimé',
      weaned: 'sevrés',
    },
  },

  // Validation
  validation: {
    invalidDate: 'Date invalide',
    invalidId: 'ID invalide',
    nameRequired: 'Le nom est requis',
    nameTooLong: 'Nom trop long',
    sexRequired: 'Sexe requis',
    statusRequired: 'Statut requis',
    birthDateFuture: 'La date de naissance ne peut pas être dans le futur',
    diagnosisAfterBreeding: 'La date de diagnostic doit être après la saillie',
    weaningAfterKindling: 'La date de sevrage doit être après la mise bas',
    weanedExceedsAlive: 'Le nombre de sevrés ne peut pas dépasser les nés vivants',
    weightPositive: 'Le poids doit être supérieur à 0',
    productRequired: 'Le produit est requis',
    withdrawalAfterTreatment: 'La fin du délai d\'attente doit être après le traitement',
  },

  // Export
  export: {
    animals: 'ANIMAUX',
    weights: 'PESÉES',
    litters: 'PORTÉES',
    treatments: 'TRAITEMENTS',
    cages: 'CAGES',
    tags: 'ÉTIQUETTES',
    headers: {
      id: 'ID',
      name: 'Nom',
      identifier: 'Identifiant',
      sex: 'Sexe',
      breed: 'Race',
      birthDate: 'Date de naissance',
      origin: 'Origine',
      motherId: 'ID Mère',
      fatherId: 'ID Père',
      cage: 'Cage',
      status: 'Statut',
      tags: 'Étiquettes',
      consumedDate: 'Date de consommation',
      consumedWeight: 'Poids à la consommation',
      notes: 'Notes',
      animalId: 'ID Animal',
      date: 'Date',
      weight: 'Poids (g)',
      kindlingDate: 'Date de mise bas',
      bornAlive: 'Nés vivants',
      stillborn: 'Mort-nés',
      weaningDate: 'Date de sevrage',
      weanedCount: 'Nombre sevrés',
      product: 'Produit',
      lotNumber: 'Numéro de lot',
      dose: 'Dose',
      route: 'Voie',
      reason: 'Motif',
      withdrawalUntil: 'Délai jusqu\'au',
      description: 'Description',
      capacity: 'Capacité',
      location: 'Emplacement',
      color: 'Couleur',
    },
  },

  // Dashboard
  dashboard: {
    title: 'Tableau de bord',
    welcomeTitle: 'Bienvenue dans Garenne !',
    welcomeMessage: 'Votre élevage semble vide. Voulez-vous charger des données d\'exemple pour découvrir l\'application ?',
    loadSampleData: 'Charger des données d\'exemple',
    createFirstAnimal: 'Créer mon premier animal',
    viewDetails: 'Voir détails',
    overview: 'Vue d\'ensemble',
    kpis: {
      liveAnimals: 'Animaux vivants',
      femalesAndMales: 'femelles, mâles',
      reproductors: 'Reproducteurs',
      reproductorsSubtitle: 'Animaux reproducteurs',
      reproductionPlanning: 'Planning reproduction',
      reproductionPlanningSubtitle: 'Calendrier élevage',
      quickActions: 'Actions rapides',
      quickActionsSubtitle: 'Accès rapide terrain',
      activeTreatments: 'Traitements actifs',
      activeTreatmentsSubtitle: 'Sous délai d\'attente',
      statistics: 'Statistiques',
      statisticsSubtitle: 'Analyse de performance',
    },
    quickActions: {
      newAnimal: 'Nouvel animal',
      quickWeighing: 'Pesée rapide',
      newLitter: 'Nouvelle portée',
      treatment: 'Traitement',
      qrCodes: 'Codes QR',
    },
  },

  // Statistics page
  statisticsPage: {
    title: 'Statistiques',
    overview: 'Vue d\'ensemble',
    reproduction: 'Reproduction',
    consumption: 'Consommation',
    health: 'Santé',
    otherMetrics: 'Autres Métriques',
    reportGenerated: 'Rapport généré le',
    cards: {
      totalAnimals: 'Total Animaux',
      totalAnimalsSubtitle: 'animaux enregistrés',
      activeAnimals: 'Animaux Actifs',
      activeAnimalsSubtitle: 'vivants',
      reproductors: 'Reproducteurs',
      reproductorsSubtitle: 'en reproduction',
      growing: 'En Croissance',
      growingSubtitle: 'jeunes',
      totalLitters: 'Total Portées',
      totalLittersSubtitle: 'portées enregistrées',
      averageSize: 'Taille Moyenne',
      averageSizeSubtitle: 'lapereaux par portée',
      survivalRate: 'Taux de Survie',
      survivalRateSubtitle: 'sevrage réussi',
      efficiency: 'Efficacité',
      efficiencySubtitle: 'portées/femelle/an',
      totalConsumed: 'Total Consommés',
      totalConsumedSubtitle: 'animaux',
      totalWeight: 'Poids Total',
      totalWeightSubtitle: 'viande produite',
      averageWeight: 'Poids Moyen',
      averageWeightSubtitle: 'par animal',
      totalTreatments: 'Total Traitements',
      totalTreatmentsSubtitle: 'enregistrés',
      activeWithdrawals: 'Délais Actifs',
      activeWithdrawalsSubtitle: 'en cours',
      commonTreatments: 'Traitements Fréquents',
      averageAge: 'Âge Moyen',
      averageAgeSubtitle: 'jours',
      averageAnimalWeight: 'Poids Moyen',
      averageAnimalWeightSubtitle: 'animaux actifs',
      cageOccupancy: 'Occupation Cages',
      cageOccupancySubtitle: 'taux d\'occupation',
    },
  },
};

// English translations
const enTranslations: Translations = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    all: 'All',
    none: 'None',
    optional: 'Optional',
    required: 'Required',
    from: 'From',
    to: 'To',
    min: 'Min',
    max: 'Max',
  },
  search: {
    intelligentPlaceholder: 'Intelligent search: name, identifier, breed, cage, notes...',
    advancedFilters: 'Advanced filters',
    clearFilters: 'Clear all filters',
    birthDateRange: 'Birth date range',
    weightRange: 'Weight range',
    tips: 'Search tips',
    tip1: 'Intelligent search tolerates typos and partial matches',
    tip2: 'Combine filters to refine your results',
    tip3: 'Results are ranked by relevance with exact matches first',
  },
  nav: {
    dashboard: 'Dashboard',
    animals: 'Animals',
    litters: 'Litters',
    treatments: 'Treatments',
    cages: 'Cages',
    tags: 'Tags',
    statistics: 'Statistics',
    settings: 'Settings',
    planning: 'Planning',
    reproduction: 'Reproduction',
  },
  animals: {
    title: 'Animal Management',
    addAnimal: 'Add Animal',
    editAnimal: 'Edit Animal',
    animalDetails: 'Animal Details',
    name: 'Name',
    identifier: 'Identifier',
    sex: 'Sex',
    breed: 'Breed',
    birthDate: 'Birth Date',
    origin: 'Origin',
    cage: 'Cage',
    status: 'Status',
    tags: 'Tags',
    notes: 'Notes',
    mother: 'Mother',
    father: 'Father',
    weights: 'Weights',
    treatments: 'Treatments',
    offspring: 'Offspring',
    consumedDate: 'Consumption Date',
    consumedWeight: 'Consumption Weight',
    markConsumed: 'Mark as Consumed',
    confirmConsumption: 'Are you sure you want to mark this animal as consumed?',
  },
  sex: {
    M: 'Male',
    F: 'Female',
    U: 'Unknown',
  },
  status: {
    REPRO: 'Breeder',
    GROW: 'Growing',
    RETIRED: 'Retired',
    DEAD: 'Deceased',
    CONSUMED: 'Consumed',
  },
  origin: {
    BORN_HERE: 'Born Here',
    PURCHASED: 'Purchased',
  },
  cages: {
    title: 'Cage Management',
    addCage: 'Add Cage',
    editCage: 'Edit Cage',
    cageDetails: 'Cage Details',
    name: 'Name',
    description: 'Description',
    capacity: 'Capacity',
    location: 'Location',
    occupants: 'Occupants',
    availability: 'Availability',
  },
  tags: {
    title: 'Tag Management',
    addTag: 'Add Tag',
    editTag: 'Edit Tag',
    name: 'Name',
    color: 'Color',
    description: 'Description',
    usage: 'Usage',
  },
  stats: {
    title: 'Statistics',
    overview: 'Overview',
    performance: 'Performance',
    reproduction: 'Reproduction',
    growth: 'Growth',
    totalAnimals: 'Total Animals',
    reproductors: 'Breeders',
    growing: 'Growing',
    consumed: 'Consumed',
    averageWeight: 'Average Weight',
    reproductionRate: 'Reproduction Rate',
    survivalRate: 'Survival Rate',
    averageLitterSize: 'Average Litter Size',
    subtitles: {
      animalsRegistered: 'animals registered',
      littersRegistered: 'litters registered',
      littersPerFemalePerYear: 'litters/female/year',
      animals: 'animals',
      activeAnimals: 'active animals',
    },
  },
  settings: {
    title: 'Settings',
    general: 'General',
    appearance: 'Appearance',
    data: 'Data',
    breeding: 'Breeding',
    theme: 'Theme',
    language: 'Language',
    units: 'Units',
    gestationDuration: 'Gestation Duration',
    weaningDuration: 'Weaning Duration',
    reproductionReadyDuration: 'Ready for Breeding Duration',
    slaughterReadyDuration: 'Ready for Slaughter Duration',
    exportFormat: 'Export Format',
    exportData: 'Export Data',
    importData: 'Import Data',
    clearData: 'Clear Data',
    confirmClearData: 'Are you sure you want to clear all data?',
  },
  time: {
    days: 'days',
    weeks: 'weeks',
    months: 'months',
    years: 'years',
  },
  messages: {
    animalSaved: 'Animal saved successfully',
    animalDeleted: 'Animal deleted successfully',
    cageSaved: 'Cage saved successfully',
    cageDeleted: 'Cage deleted successfully',
    tagSaved: 'Tag saved successfully',
    tagDeleted: 'Tag deleted successfully',
    dataExported: 'Data exported successfully',
    dataImported: 'Data imported successfully',
    dataCleared: 'Data cleared successfully',
    invalidFile: 'Invalid file',
    operationFailed: 'Operation failed',
  },

  // Error handling
  errors: {
    title: 'Oops! An error occurred',
    unexpected: 'An unexpected error occurred. Please try again.',
    reload: 'Retry',
    goHome: 'Go Home',
    developmentDetails: 'Error details (development only):',
  },
  charts: {
    weightEvolution: 'Weight Evolution',
    noWeightData: 'No weight data available',
    currentWeight: 'Current Weight',
    totalGain: 'Total Gain',
    averageDailyGain: 'Average Daily Gain',
    initialWeight: 'Initial Weight',
    weight: 'Weight',
    weightUnit: 'g',
    month: 'Month',
    births: 'Births',
    males: 'Males',
    females: 'Females',
    retired: 'Retired',
  },

  // PrintableSheet
  printableSheet: {
    generalInfo: 'General Information',
    generatedOn: 'Sheet generated on',
    by: 'by',
    unknownCage: 'Unknown cage',
    notSpecified: 'Not specified',
  },
  modals: {
    mortality: {
      title: 'Record Death',
      deathDate: 'Death Date',
      deathDateHelperText: 'Cannot be in the future',
      suspectedCause: 'Suspected Cause',
      suspectedCausePlaceholder: 'Disease, accident, old age...',
      necropsyPerformed: 'Necropsy Performed',
      notes: 'Notes',
      notesPlaceholder: 'Circumstances, observations...',
      errorEnterDate: 'Please enter a death date',
      errorFutureDate: 'Death date cannot be in the future',
      errorBeforeBirth: 'Death date cannot be before birth date',
      errorSavingDeath: 'Error saving death record',
    },
    litter: {
      title: 'New Litter',
      titleRecord: 'Record Kindling',
      kindlingDate: 'Kindling Date',
      bornAlive: 'Born Alive',
      stillborn: 'Stillborn',
      malesToCreate: 'Males to Create',
      femalesToCreate: 'Females to Create',
      notes: 'Notes',
      notesPlaceholder: 'Kindling observations, health of the young...',
      autoCreateRabbits: 'Automatically create rabbits',
      totalVersus: 'Total',
      mother: 'Mother',
      father: 'Father',
      motherNotSpecified: 'Not specified',
      fatherNotSpecified: 'Not specified',
      breedingInfo: 'Breeding on',
      expectedKindlingDate: 'Expected kindling on',
      saveLitter: 'Save Litter',
      errorMotherNotFound: 'Mother not found',
      errorEnterKindlingDate: 'Please enter a kindling date',
      errorNegativeNumbers: 'Numbers cannot be negative',
      errorTotalExceeds: 'Total number of offspring to create cannot exceed live births',
      errorSavingLitter: 'Error saving litter',
    },
    quickWeight: {
      title: 'Quick Weighing',
      animal: 'Animal',
      animalPlaceholder: 'Select an animal',
      weightGrams: 'Weight (in grams)',
      notesOptional: 'Notes (optional)',
      weightPlaceholder: 'e.g.: 2500',
      notesPlaceholder: 'Comments on the weighing...',
      errorValidWeight: 'Please enter a valid weight',
      errorSavingWeight: 'Error saving weight',
    },
    treatment: {
      title: 'Quick Treatment',
      animal: 'Animal',
      animalPlaceholder: 'Select an animal',
      product: 'Product',
      productPlaceholder: 'Name of medication or treatment',
      dose: 'Dose',
      dosePlaceholder: 'e.g.: 0.5ml, 1 tablet',
      route: 'Route of Administration',
      reason: 'Reason',
      reasonPlaceholder: 'Reason for treatment',
      withdrawalDays: 'Withdrawal Period (days)',
      withdrawalPlaceholder: 'e.g.: 30',
      withdrawalHelperText: 'Number of days to wait before consumption',
      notesOptional: 'Notes (optional)',
      notesPlaceholder: 'Comments on the treatment...',
      routes: {
        oral: 'Oral',
        subcutaneous: 'Subcutaneous',
        intramuscular: 'Intramuscular',
        other: 'Other',
      },
      errorSelectAnimal: 'Please select an animal',
      errorEnterProduct: 'Please enter the product name',
      errorSavingTreatment: 'Error saving treatment',
    },
    breeding: {
      title: 'New Breeding',
      female: 'Female',
      male: 'Male',
      method: 'Method',
      date: 'Breeding Date',
      notes: 'Notes',
      notesPlaceholder: 'Observations, special conditions...',
      expectedKindlingDate: 'Expected kindling date',
      gestationDays: 'Gestation',
      methods: {
        natural: 'Natural',
        artificialInsemination: 'Artificial Insemination',
      },
      animalName: {
        noName: 'Unnamed',
      },
      errorSelectFemale: 'Please select a female',
      errorEnterDate: 'Please enter a breeding date',
      errorSavingBreeding: 'Error saving breeding',
    },
  },

  // Litters
  litters: {
    title: 'Litter Management',
    searchPlaceholder: 'Search by mother, father or notes...',
    sortBy: 'Sort by',
    order: 'Order',
    sortOptions: {
      date: 'Birth Date',
      mother: 'Mother',
      offspring: 'Number of Offspring',
    },
    orderOptions: {
      descending: 'Descending',
      ascending: 'Ascending',
    },
    status: {
      weaned: 'Weaned',
      lactating: 'Lactating',
      toWean: 'To Wean',
    },
    labels: {
      mother: 'Mother',
      father: 'Father',
      unknown: 'Unknown',
      offspringCreated: 'Offspring Created',
      weaning: 'Weaning',
      estimatedWeaning: 'Estimated Weaning',
      weaned: 'weaned',
    },
  },

  // Validation
  validation: {
    invalidDate: 'Invalid date',
    invalidId: 'Invalid ID',
    nameRequired: 'Name is required',
    nameTooLong: 'Name too long',
    sexRequired: 'Sex is required',
    statusRequired: 'Status is required',
    birthDateFuture: 'Birth date cannot be in the future',
    diagnosisAfterBreeding: 'Diagnosis date must be after breeding date',
    weaningAfterKindling: 'Weaning date must be after kindling date',
    weanedExceedsAlive: 'Weaned count cannot exceed live births',
    weightPositive: 'Weight must be greater than 0',
    productRequired: 'Product is required',
    withdrawalAfterTreatment: 'Withdrawal end date must be after treatment date',
  },

  // Export
  export: {
    animals: 'ANIMALS',
    weights: 'WEIGHTS',
    litters: 'LITTERS',
    treatments: 'TREATMENTS',
    cages: 'CAGES',
    tags: 'TAGS',
    headers: {
      id: 'ID',
      name: 'Name',
      identifier: 'Identifier',
      sex: 'Sex',
      breed: 'Breed',
      birthDate: 'Birth Date',
      origin: 'Origin',
      motherId: 'Mother ID',
      fatherId: 'Father ID',
      cage: 'Cage',
      status: 'Status',
      tags: 'Tags',
      consumedDate: 'Consumed Date',
      consumedWeight: 'Consumed Weight',
      notes: 'Notes',
      animalId: 'Animal ID',
      date: 'Date',
      weight: 'Weight (g)',
      kindlingDate: 'Kindling Date',
      bornAlive: 'Born Alive',
      stillborn: 'Stillborn',
      weaningDate: 'Weaning Date',
      weanedCount: 'Weaned Count',
      product: 'Product',
      lotNumber: 'Lot Number',
      dose: 'Dose',
      route: 'Route',
      reason: 'Reason',
      withdrawalUntil: 'Withdrawal Until',
      description: 'Description',
      capacity: 'Capacity',
      location: 'Location',
      color: 'Color',
    },
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcomeTitle: 'Welcome to Garenne!',
    welcomeMessage: 'Your farm seems empty. Would you like to load sample data to discover the application?',
    loadSampleData: 'Load sample data',
    createFirstAnimal: 'Create my first animal',
    viewDetails: 'View details',
    overview: 'Overview',
    kpis: {
      liveAnimals: 'Live Animals',
      femalesAndMales: 'females, males',
      reproductors: 'Breeders',
      reproductorsSubtitle: 'Breeding animals',
      reproductionPlanning: 'Reproduction Planning',
      reproductionPlanningSubtitle: 'Breeding calendar',
      quickActions: 'Quick Actions',
      quickActionsSubtitle: 'Field quick access',
      activeTreatments: 'Active Treatments',
      activeTreatmentsSubtitle: 'Under withdrawal period',
      statistics: 'Statistics',
      statisticsSubtitle: 'Performance analysis',
    },
    quickActions: {
      newAnimal: 'New animal',
      quickWeighing: 'Quick weighing',
      newLitter: 'New litter',
      treatment: 'Treatment',
      qrCodes: 'QR Codes',
    },
  },

  // Statistics page
  statisticsPage: {
    title: 'Statistics',
    overview: 'Overview',
    reproduction: 'Reproduction',
    consumption: 'Consumption',
    health: 'Health',
    otherMetrics: 'Other Metrics',
    reportGenerated: 'Report generated on',
    cards: {
      totalAnimals: 'Total Animals',
      totalAnimalsSubtitle: 'animals registered',
      activeAnimals: 'Active Animals',
      activeAnimalsSubtitle: 'alive',
      reproductors: 'Breeders',
      reproductorsSubtitle: 'breeding',
      growing: 'Growing',
      growingSubtitle: 'young',
      totalLitters: 'Total Litters',
      totalLittersSubtitle: 'litters registered',
      averageSize: 'Average Size',
      averageSizeSubtitle: 'kits per litter',
      survivalRate: 'Survival Rate',
      survivalRateSubtitle: 'successful weaning',
      efficiency: 'Efficiency',
      efficiencySubtitle: 'litters/female/year',
      totalConsumed: 'Total Consumed',
      totalConsumedSubtitle: 'animals',
      totalWeight: 'Total Weight',
      totalWeightSubtitle: 'meat produced',
      averageWeight: 'Average Weight',
      averageWeightSubtitle: 'per animal',
      totalTreatments: 'Total Treatments',
      totalTreatmentsSubtitle: 'registered',
      activeWithdrawals: 'Active Withdrawals',
      activeWithdrawalsSubtitle: 'in progress',
      commonTreatments: 'Common Treatments',
      averageAge: 'Average Age',
      averageAgeSubtitle: 'days',
      averageAnimalWeight: 'Average Weight',
      averageAnimalWeightSubtitle: 'active animals',
      cageOccupancy: 'Cage Occupancy',
      cageOccupancySubtitle: 'occupancy rate',
    },
  },
};

// Spanish translations
const esTranslations: Translations = {
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Añadir',
    search: 'Buscar',
    filter: 'Filtrar',
    export: 'Exportar',
    import: 'Importar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    confirm: 'Confirmar',
    yes: 'Sí',
    no: 'No',
    all: 'Todos',
    none: 'Ninguno',
    optional: 'Opcional',
    required: 'Obligatorio',
    from: 'Desde',
    to: 'Hasta',
    min: 'Mín',
    max: 'Máx',
  },
  search: {
    intelligentPlaceholder: 'Búsqueda inteligente: nombre, identificador, raza, jaula, notas...',
    advancedFilters: 'Filtros avanzados',
    clearFilters: 'Limpiar todos los filtros',
    birthDateRange: 'Rango de fechas de nacimiento',
    weightRange: 'Rango de peso',
    tips: 'Consejos de búsqueda',
    tip1: 'La búsqueda inteligente tolera errores tipográficos y coincidencias parciales',
    tip2: 'Combina filtros para refinar tus resultados',
    tip3: 'Los resultados se clasifican por relevancia con coincidencias exactas primero',
  },
  nav: {
    dashboard: 'Panel de Control',
    animals: 'Animales',
    litters: 'Camadas',
    treatments: 'Tratamientos',
    cages: 'Jaulas',
    tags: 'Etiquetas',
    statistics: 'Estadísticas',
    settings: 'Configuración',
    planning: 'Planificación',
    reproduction: 'Reproducción',
  },
  animals: {
    title: 'Gestión de Animales',
    addAnimal: 'Añadir Animal',
    editAnimal: 'Editar Animal',
    animalDetails: 'Detalles del Animal',
    name: 'Nombre',
    identifier: 'Identificador',
    sex: 'Sexo',
    breed: 'Raza',
    birthDate: 'Fecha de Nacimiento',
    origin: 'Origen',
    cage: 'Jaula',
    status: 'Estado',
    tags: 'Etiquetas',
    notes: 'Notas',
    mother: 'Madre',
    father: 'Padre',
    weights: 'Pesos',
    treatments: 'Tratamientos',
    offspring: 'Descendencia',
    consumedDate: 'Fecha de Consumo',
    consumedWeight: 'Peso al Consumo',
    markConsumed: 'Marcar como Consumido',
    confirmConsumption: '¿Está seguro de que quiere marcar este animal como consumido?',
  },
  sex: {
    M: 'Macho',
    F: 'Hembra',
    U: 'Desconocido',
  },
  status: {
    REPRO: 'Reproductor',
    GROW: 'Crecimiento',
    RETIRED: 'Retirado',
    DEAD: 'Fallecido',
    CONSUMED: 'Consumido',
  },
  origin: {
    BORN_HERE: 'Nacido Aquí',
    PURCHASED: 'Comprado',
  },
  cages: {
    title: 'Gestión de Jaulas',
    addCage: 'Añadir Jaula',
    editCage: 'Editar Jaula',
    cageDetails: 'Detalles de la Jaula',
    name: 'Nombre',
    description: 'Descripción',
    capacity: 'Capacidad',
    location: 'Ubicación',
    occupants: 'Ocupantes',
    availability: 'Disponibilidad',
  },
  tags: {
    title: 'Gestión de Etiquetas',
    addTag: 'Añadir Etiqueta',
    editTag: 'Editar Etiqueta',
    name: 'Nombre',
    color: 'Color',
    description: 'Descripción',
    usage: 'Uso',
  },
  stats: {
    title: 'Estadísticas',
    overview: 'Resumen',
    performance: 'Rendimiento',
    reproduction: 'Reproducción',
    growth: 'Crecimiento',
    totalAnimals: 'Total de Animales',
    reproductors: 'Reproductores',
    growing: 'En Crecimiento',
    consumed: 'Consumidos',
    averageWeight: 'Peso Promedio',
    reproductionRate: 'Tasa de Reproducción',
    survivalRate: 'Tasa de Supervivencia',
    averageLitterSize: 'Tamaño Promedio de Camada',
    subtitles: {
      animalsRegistered: 'animales registrados',
      littersRegistered: 'camadas registradas',
      littersPerFemalePerYear: 'camadas/hembra/año',
      animals: 'animales',
      activeAnimals: 'animales activos',
    },
  },
  settings: {
    title: 'Configuración',
    general: 'General',
    appearance: 'Apariencia',
    data: 'Datos',
    breeding: 'Cría',
    theme: 'Tema',
    language: 'Idioma',
    units: 'Unidades',
    gestationDuration: 'Duración de Gestación',
    weaningDuration: 'Duración de Destete',
    reproductionReadyDuration: 'Duración para Reproducción',
    slaughterReadyDuration: 'Duración para Sacrificio',
    exportFormat: 'Formato de Exportación',
    exportData: 'Exportar Datos',
    importData: 'Importar Datos',
    clearData: 'Limpiar Datos',
    confirmClearData: '¿Está seguro de que quiere limpiar todos los datos?',
  },
  time: {
    days: 'días',
    weeks: 'semanas',
    months: 'meses',
    years: 'años',
  },
  messages: {
    animalSaved: 'Animal guardado exitosamente',
    animalDeleted: 'Animal eliminado exitosamente',
    cageSaved: 'Jaula guardada exitosamente',
    cageDeleted: 'Jaula eliminada exitosamente',
    tagSaved: 'Etiqueta guardada exitosamente',
    tagDeleted: 'Etiqueta eliminada exitosamente',
    dataExported: 'Datos exportados exitosamente',
    dataImported: 'Datos importados exitosamente',
    dataCleared: 'Datos limpiados exitosamente',
    invalidFile: 'Archivo inválido',
    operationFailed: 'Operación falló',
  },

  // Error handling
  errors: {
    title: '¡Ups! Ocurrió un error',
    unexpected: 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.',
    reload: 'Reintentar',
    goHome: 'Ir al Inicio',
    developmentDetails: 'Detalles del error (solo desarrollo):',
  },
  charts: {
    weightEvolution: 'Evolución del Peso',
    noWeightData: 'No hay datos de peso disponibles',
    currentWeight: 'Peso Actual',
    totalGain: 'Ganancia Total',
    averageDailyGain: 'Ganancia Promedio Diaria',
    initialWeight: 'Peso Inicial',
    weight: 'Peso',
    weightUnit: 'g',
    month: 'Mes',
    births: 'Nacimientos',
    males: 'Machos',
    females: 'Hembras',
    retired: 'Retirados',
  },

  // PrintableSheet
  printableSheet: {
    generalInfo: 'Información General',
    generatedOn: 'Hoja generada el',
    by: 'por',
    unknownCage: 'Jaula desconocida',
    notSpecified: 'No especificado',
  },
  modals: {
    mortality: {
      title: 'Registrar Muerte',
      deathDate: 'Fecha de Muerte',
      deathDateHelperText: 'No puede estar en el futuro',
      suspectedCause: 'Causa Sospechada',
      suspectedCausePlaceholder: 'Enfermedad, accidente, vejez...',
      necropsyPerformed: 'Necropsia Realizada',
      notes: 'Notas',
      notesPlaceholder: 'Circunstancias, observaciones...',
      errorEnterDate: 'Por favor ingrese una fecha de muerte',
      errorFutureDate: 'La fecha de muerte no puede estar en el futuro',
      errorBeforeBirth: 'La fecha de muerte no puede ser anterior al nacimiento',
      errorSavingDeath: 'Error al guardar el registro de muerte',
    },
    litter: {
      title: 'Nueva Camada',
      titleRecord: 'Registrar Parto',
      kindlingDate: 'Fecha de Parto',
      bornAlive: 'Nacidos Vivos',
      stillborn: 'Nacidos Muertos',
      malesToCreate: 'Machos a Crear',
      femalesToCreate: 'Hembras a Crear',
      notes: 'Notas',
      notesPlaceholder: 'Observaciones del parto, salud de las crías...',
      autoCreateRabbits: 'Crear automáticamente los conejos',
      totalVersus: 'Total',
      mother: 'Madre',
      father: 'Padre',
      motherNotSpecified: 'No especificada',
      fatherNotSpecified: 'No especificado',
      breedingInfo: 'Cruce del',
      expectedKindlingDate: 'Parto esperado el',
      saveLitter: 'Guardar Camada',
      errorMotherNotFound: 'Madre no encontrada',
      errorEnterKindlingDate: 'Por favor ingrese una fecha de parto',
      errorNegativeNumbers: 'Los números no pueden ser negativos',
      errorTotalExceeds: 'El número total de crías a crear no puede exceder los nacidos vivos',
      errorSavingLitter: 'Error al guardar la camada',
    },
    quickWeight: {
      title: 'Pesaje Rápido',
      animal: 'Animal',
      animalPlaceholder: 'Seleccionar un animal',
      weightGrams: 'Peso (en gramos)',
      notesOptional: 'Notas (opcional)',
      weightPlaceholder: 'ej: 2500',
      notesPlaceholder: 'Comentarios sobre el pesaje...',
      errorValidWeight: 'Por favor ingrese un peso válido',
      errorSavingWeight: 'Error al guardar el peso',
    },
    treatment: {
      title: 'Tratamiento Rápido',
      animal: 'Animal',
      animalPlaceholder: 'Seleccionar un animal',
      product: 'Producto',
      productPlaceholder: 'Nombre del medicamento o tratamiento',
      dose: 'Dosis',
      dosePlaceholder: 'ej: 0.5ml, 1 comprimido',
      route: 'Vía de Administración',
      reason: 'Motivo',
      reasonPlaceholder: 'Razón del tratamiento',
      withdrawalDays: 'Período de Retiro (días)',
      withdrawalPlaceholder: 'ej: 30',
      withdrawalHelperText: 'Número de días de espera antes del consumo',
      notesOptional: 'Notas (opcional)',
      notesPlaceholder: 'Comentarios sobre el tratamiento...',
      routes: {
        oral: 'Oral',
        subcutaneous: 'Subcutáneo',
        intramuscular: 'Intramuscular',
        other: 'Otro',
      },
      errorSelectAnimal: 'Por favor seleccione un animal',
      errorEnterProduct: 'Por favor ingrese el nombre del producto',
      errorSavingTreatment: 'Error al guardar el tratamiento',
    },
    breeding: {
      title: 'Nuevo Cruce',
      female: 'Hembra',
      male: 'Macho',
      method: 'Método',
      date: 'Fecha de Cruce',
      notes: 'Notas',
      notesPlaceholder: 'Observaciones, condiciones especiales...',
      expectedKindlingDate: 'Fecha de parto esperada',
      gestationDays: 'Gestación',
      methods: {
        natural: 'Natural',
        artificialInsemination: 'Inseminación Artificial',
      },
      animalName: {
        noName: 'Sin nombre',
      },
      errorSelectFemale: 'Por favor seleccione una hembra',
      errorEnterDate: 'Por favor ingrese una fecha de cruce',
      errorSavingBreeding: 'Error al guardar el cruce',
    },
  },

  // Litters
  litters: {
    title: 'Gestión de Camadas',
    searchPlaceholder: 'Buscar por madre, padre o notas...',
    sortBy: 'Ordenar por',
    order: 'Orden',
    sortOptions: {
      date: 'Fecha de Nacimiento',
      mother: 'Madre',
      offspring: 'Número de Crías',
    },
    orderOptions: {
      descending: 'Descendente',
      ascending: 'Ascendente',
    },
    status: {
      weaned: 'Destetada',
      lactating: 'Lactando',
      toWean: 'A Destetar',
    },
    labels: {
      mother: 'Madre',
      father: 'Padre',
      unknown: 'Desconocida',
      offspringCreated: 'Descendientes Creados',
      weaning: 'Destete',
      estimatedWeaning: 'Destete Estimado',
      weaned: 'destetados',
    },
  },

  // Validation
  validation: {
    invalidDate: 'Fecha inválida',
    invalidId: 'ID inválido',
    nameRequired: 'El nombre es obligatorio',
    nameTooLong: 'Nombre demasiado largo',
    sexRequired: 'El sexo es obligatorio',
    statusRequired: 'El estado es obligatorio',
    birthDateFuture: 'La fecha de nacimiento no puede estar en el futuro',
    diagnosisAfterBreeding: 'La fecha de diagnóstico debe ser posterior al cruce',
    weaningAfterKindling: 'La fecha de destete debe ser posterior al parto',
    weanedExceedsAlive: 'El número de destetados no puede exceder los nacidos vivos',
    weightPositive: 'El peso debe ser mayor que 0',
    productRequired: 'El producto es obligatorio',
    withdrawalAfterTreatment: 'La fecha de fin del período de retiro debe ser posterior al tratamiento',
  },

  // Export
  export: {
    animals: 'ANIMALES',
    weights: 'PESOS',
    litters: 'CAMADAS',
    treatments: 'TRATAMIENTOS',
    cages: 'JAULAS',
    tags: 'ETIQUETAS',
    headers: {
      id: 'ID',
      name: 'Nombre',
      identifier: 'Identificador',
      sex: 'Sexo',
      breed: 'Raza',
      birthDate: 'Fecha de Nacimiento',
      origin: 'Origen',
      motherId: 'ID Madre',
      fatherId: 'ID Padre',
      cage: 'Jaula',
      status: 'Estado',
      tags: 'Etiquetas',
      consumedDate: 'Fecha de Consumo',
      consumedWeight: 'Peso al Consumo',
      notes: 'Notas',
      animalId: 'ID Animal',
      date: 'Fecha',
      weight: 'Peso (g)',
      kindlingDate: 'Fecha de Parto',
      bornAlive: 'Nacidos Vivos',
      stillborn: 'Nacidos Muertos',
      weaningDate: 'Fecha de Destete',
      weanedCount: 'Número Destetados',
      product: 'Producto',
      lotNumber: 'Número de Lote',
      dose: 'Dosis',
      route: 'Vía',
      reason: 'Motivo',
      withdrawalUntil: 'Retiro Hasta',
      description: 'Descripción',
      capacity: 'Capacidad',
      location: 'Ubicación',
      color: 'Color',
    },
  },

  // Dashboard
  dashboard: {
    title: 'Panel de Control',
    welcomeTitle: '¡Bienvenido a Garenne!',
    welcomeMessage: 'Su granja parece vacía. ¿Le gustaría cargar datos de ejemplo para descubrir la aplicación?',
    loadSampleData: 'Cargar datos de ejemplo',
    createFirstAnimal: 'Crear mi primer animal',
    viewDetails: 'Ver detalles',
    overview: 'Resumen',
    kpis: {
      liveAnimals: 'Animales Vivos',
      femalesAndMales: 'hembras, machos',
      reproductors: 'Reproductores',
      reproductorsSubtitle: 'Animales reproductores',
      reproductionPlanning: 'Planificación Reproductiva',
      reproductionPlanningSubtitle: 'Calendario de cría',
      quickActions: 'Acciones Rápidas',
      quickActionsSubtitle: 'Acceso rápido campo',
      activeTreatments: 'Tratamientos Activos',
      activeTreatmentsSubtitle: 'Bajo período de retiro',
      statistics: 'Estadísticas',
      statisticsSubtitle: 'Análisis de rendimiento',
    },
    quickActions: {
      newAnimal: 'Nuevo animal',
      quickWeighing: 'Pesaje rápido',
      newLitter: 'Nueva camada',
      treatment: 'Tratamiento',
      qrCodes: 'Códigos QR',
    },
  },

  // Statistics page
  statisticsPage: {
    title: 'Estadísticas',
    overview: 'Resumen',
    reproduction: 'Reproducción',
    consumption: 'Consumo',
    health: 'Salud',
    otherMetrics: 'Otras Métricas',
    reportGenerated: 'Informe generado el',
    cards: {
      totalAnimals: 'Total de Animales',
      totalAnimalsSubtitle: 'animales registrados',
      activeAnimals: 'Animales Activos',
      activeAnimalsSubtitle: 'vivos',
      reproductors: 'Reproductores',
      reproductorsSubtitle: 'en reproducción',
      growing: 'En Crecimiento',
      growingSubtitle: 'jóvenes',
      totalLitters: 'Total de Camadas',
      totalLittersSubtitle: 'camadas registradas',
      averageSize: 'Tamaño Promedio',
      averageSizeSubtitle: 'crías por camada',
      survivalRate: 'Tasa de Supervivencia',
      survivalRateSubtitle: 'destete exitoso',
      efficiency: 'Eficiencia',
      efficiencySubtitle: 'camadas/hembra/año',
      totalConsumed: 'Total Consumidos',
      totalConsumedSubtitle: 'animales',
      totalWeight: 'Peso Total',
      totalWeightSubtitle: 'carne producida',
      averageWeight: 'Peso Promedio',
      averageWeightSubtitle: 'por animal',
      totalTreatments: 'Total Tratamientos',
      totalTreatmentsSubtitle: 'registrados',
      activeWithdrawals: 'Retiros Activos',
      activeWithdrawalsSubtitle: 'en progreso',
      commonTreatments: 'Tratamientos Comunes',
      averageAge: 'Edad Promedio',
      averageAgeSubtitle: 'días',
      averageAnimalWeight: 'Peso Promedio',
      averageAnimalWeightSubtitle: 'animales activos',
      cageOccupancy: 'Ocupación de Jaulas',
      cageOccupancySubtitle: 'tasa de ocupación',
    },
  },
};

// German translations
const deTranslations: Translations = {
  common: {
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    search: 'Suchen',
    filter: 'Filtern',
    export: 'Exportieren',
    import: 'Importieren',
    loading: 'Lädt...',
    error: 'Fehler',
    success: 'Erfolg',
    confirm: 'Bestätigen',
    yes: 'Ja',
    no: 'Nein',
    all: 'Alle',
    none: 'Keine',
    optional: 'Optional',
    required: 'Erforderlich',
    from: 'Von',
    to: 'Bis',
    min: 'Min',
    max: 'Max',
  },
  search: {
    intelligentPlaceholder: 'Intelligente Suche: Name, Kennung, Rasse, Käfig, Notizen...',
    advancedFilters: 'Erweiterte Filter',
    clearFilters: 'Alle Filter löschen',
    birthDateRange: 'Geburtsdatumsbereich',
    weightRange: 'Gewichtsbereich',
    tips: 'Suchtipps',
    tip1: 'Die intelligente Suche toleriert Tippfehler und Teilübereinstimmungen',
    tip2: 'Kombinieren Sie Filter, um Ihre Ergebnisse zu verfeinern',
    tip3: 'Ergebnisse werden nach Relevanz sortiert, exakte Übereinstimmungen zuerst',
  },
  nav: {
    dashboard: 'Dashboard',
    animals: 'Tiere',
    litters: 'Würfe',
    treatments: 'Behandlungen',
    cages: 'Käfige',
    tags: 'Etiketten',
    statistics: 'Statistiken',
    settings: 'Einstellungen',
    planning: 'Planung',
    reproduction: 'Fortpflanzung',
  },
  animals: {
    title: 'Tierverwaltung',
    addAnimal: 'Tier hinzufügen',
    editAnimal: 'Tier bearbeiten',
    animalDetails: 'Tierdetails',
    name: 'Name',
    identifier: 'Kennung',
    sex: 'Geschlecht',
    breed: 'Rasse',
    birthDate: 'Geburtsdatum',
    origin: 'Herkunft',
    cage: 'Käfig',
    status: 'Status',
    tags: 'Etiketten',
    notes: 'Notizen',
    mother: 'Mutter',
    father: 'Vater',
    weights: 'Gewichte',
    treatments: 'Behandlungen',
    offspring: 'Nachkommen',
    consumedDate: 'Verbrauchsdatum',
    consumedWeight: 'Verbrauchsgewicht',
    markConsumed: 'Als verbraucht markieren',
    confirmConsumption: 'Sind Sie sicher, dass Sie dieses Tier als verbraucht markieren möchten?',
  },
  sex: {
    M: 'Männlich',
    F: 'Weiblich',
    U: 'Unbekannt',
  },
  status: {
    REPRO: 'Züchter',
    GROW: 'Wachstum',
    RETIRED: 'Im Ruhestand',
    DEAD: 'Verstorben',
    CONSUMED: 'Verbraucht',
  },
  origin: {
    BORN_HERE: 'Hier geboren',
    PURCHASED: 'Gekauft',
  },
  cages: {
    title: 'Käfigverwaltung',
    addCage: 'Käfig hinzufügen',
    editCage: 'Käfig bearbeiten',
    cageDetails: 'Käfigdetails',
    name: 'Name',
    description: 'Beschreibung',
    capacity: 'Kapazität',
    location: 'Standort',
    occupants: 'Bewohner',
    availability: 'Verfügbarkeit',
  },
  tags: {
    title: 'Etikettenverwaltung',
    addTag: 'Etikett hinzufügen',
    editTag: 'Etikett bearbeiten',
    name: 'Name',
    color: 'Farbe',
    description: 'Beschreibung',
    usage: 'Verwendung',
  },
  stats: {
    title: 'Statistiken',
    overview: 'Übersicht',
    performance: 'Leistung',
    reproduction: 'Fortpflanzung',
    growth: 'Wachstum',
    totalAnimals: 'Tiere gesamt',
    reproductors: 'Züchter',
    growing: 'Wachsend',
    consumed: 'Verbraucht',
    averageWeight: 'Durchschnittsgewicht',
    reproductionRate: 'Fortpflanzungsrate',
    survivalRate: 'Überlebensrate',
    averageLitterSize: 'Durchschnittliche Wurfgröße',
    subtitles: {
      animalsRegistered: 'Tiere registriert',
      littersRegistered: 'Würfe registriert',
      littersPerFemalePerYear: 'Würfe/Weibchen/Jahr',
      animals: 'Tiere',
      activeAnimals: 'aktive Tiere',
    },
  },
  settings: {
    title: 'Einstellungen',
    general: 'Allgemein',
    appearance: 'Erscheinungsbild',
    data: 'Daten',
    breeding: 'Zucht',
    theme: 'Theme',
    language: 'Sprache',
    units: 'Einheiten',
    gestationDuration: 'Trächtigkeitsdauer',
    weaningDuration: 'Entwöhnungsdauer',
    reproductionReadyDuration: 'Zuchtbereitschaftsdauer',
    slaughterReadyDuration: 'Schlachtbereitschaftsdauer',
    exportFormat: 'Exportformat',
    exportData: 'Daten exportieren',
    importData: 'Daten importieren',
    clearData: 'Daten löschen',
    confirmClearData: 'Sind Sie sicher, dass Sie alle Daten löschen möchten?',
  },
  time: {
    days: 'Tage',
    weeks: 'Wochen',
    months: 'Monate',
    years: 'Jahre',
  },
  messages: {
    animalSaved: 'Tier erfolgreich gespeichert',
    animalDeleted: 'Tier erfolgreich gelöscht',
    cageSaved: 'Käfig erfolgreich gespeichert',
    cageDeleted: 'Käfig erfolgreich gelöscht',
    tagSaved: 'Etikett erfolgreich gespeichert',
    tagDeleted: 'Etikett erfolgreich gelöscht',
    dataExported: 'Daten erfolgreich exportiert',
    dataImported: 'Daten erfolgreich importiert',
    dataCleared: 'Daten erfolgreich gelöscht',
    invalidFile: 'Ungültige Datei',
    operationFailed: 'Operation fehlgeschlagen',
  },

  // Error handling
  errors: {
    title: 'Ups! Ein Fehler ist aufgetreten',
    unexpected: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    reload: 'Erneut versuchen',
    goHome: 'Zur Startseite',
    developmentDetails: 'Fehlerdetails (nur Entwicklung):',
  },
  charts: {
    weightEvolution: 'Gewichtsentwicklung',
    noWeightData: 'Keine Gewichtsdaten verfügbar',
    currentWeight: 'Aktuelles Gewicht',
    totalGain: 'Gesamtzunahme',
    averageDailyGain: 'Durchschnittl. Tageszunahme',
    initialWeight: 'Anfangsgewicht',
    weight: 'Gewicht',
    weightUnit: 'g',
    month: 'Monat',
    births: 'Geburten',
    males: 'Männchen',
    females: 'Weibchen',
    retired: 'Im Ruhestand',
  },

  // PrintableSheet
  printableSheet: {
    generalInfo: 'Allgemeine Informationen',
    generatedOn: 'Blatt erstellt am',
    by: 'von',
    unknownCage: 'Unbekannter Käfig',
    notSpecified: 'Nicht angegeben',
  },
  modals: {
    mortality: {
      title: 'Tod melden',
      deathDate: 'Todesdatum',
      deathDateHelperText: 'Kann nicht in der Zukunft liegen',
      suspectedCause: 'Vermutete Ursache',
      suspectedCausePlaceholder: 'Krankheit, Unfall, Alter...',
      necropsyPerformed: 'Autopsie durchgeführt',
      notes: 'Notizen',
      notesPlaceholder: 'Umstände, Beobachtungen...',
      errorEnterDate: 'Bitte geben Sie ein Todesdatum ein',
      errorFutureDate: 'Todesdatum kann nicht in der Zukunft liegen',
      errorBeforeBirth: 'Todesdatum kann nicht vor dem Geburtsdatum liegen',
      errorSavingDeath: 'Fehler beim Speichern des Todesdatensatzes',
    },
    litter: {
      title: 'Neuer Wurf',
      titleRecord: 'Geburt erfassen',
      kindlingDate: 'Geburtsdatum',
      bornAlive: 'Lebend Geboren',
      stillborn: 'Totgeboren',
      malesToCreate: 'Männchen zu erstellen',
      femalesToCreate: 'Weibchen zu erstellen',
      notes: 'Notizen',
      notesPlaceholder: 'Geburtsbeobachtungen, Gesundheit der Jungen...',
      autoCreateRabbits: 'Kaninchen automatisch erstellen',
      totalVersus: 'Gesamt',
      mother: 'Mutter',
      father: 'Vater',
      motherNotSpecified: 'Nicht angegeben',
      fatherNotSpecified: 'Nicht angegeben',
      breedingInfo: 'Paarung vom',
      expectedKindlingDate: 'Erwartete Geburt am',
      saveLitter: 'Wurf speichern',
      errorMotherNotFound: 'Mutter nicht gefunden',
      errorEnterKindlingDate: 'Bitte geben Sie ein Geburtsdatum ein',
      errorNegativeNumbers: 'Zahlen können nicht negativ sein',
      errorTotalExceeds: 'Die Gesamtzahl der zu erstellenden Nachkommen kann die Lebendgeburten nicht überschreiten',
      errorSavingLitter: 'Fehler beim Speichern des Wurfs',
    },
    quickWeight: {
      title: 'Schnellwiegung',
      animal: 'Tier',
      animalPlaceholder: 'Tier auswählen',
      weightGrams: 'Gewicht (in Gramm)',
      notesOptional: 'Notizen (optional)',
      weightPlaceholder: 'z.B.: 2500',
      notesPlaceholder: 'Kommentare zur Wiegung...',
      errorValidWeight: 'Bitte geben Sie ein gültiges Gewicht ein',
      errorSavingWeight: 'Fehler beim Speichern des Gewichts',
    },
    treatment: {
      title: 'Schnellbehandlung',
      animal: 'Tier',
      animalPlaceholder: 'Tier auswählen',
      product: 'Produkt',
      productPlaceholder: 'Name des Medikaments oder der Behandlung',
      dose: 'Dosis',
      dosePlaceholder: 'z.B.: 0,5ml, 1 Tablette',
      route: 'Verabreichungsweg',
      reason: 'Grund',
      reasonPlaceholder: 'Grund für die Behandlung',
      withdrawalDays: 'Wartezeit (Tage)',
      withdrawalPlaceholder: 'z.B.: 30',
      withdrawalHelperText: 'Anzahl Tage bis zum Verzehr warten',
      notesOptional: 'Notizen (optional)',
      notesPlaceholder: 'Kommentare zur Behandlung...',
      routes: {
        oral: 'Oral',
        subcutaneous: 'Subkutan',
        intramuscular: 'Intramuskulär',
        other: 'Andere',
      },
      errorSelectAnimal: 'Bitte wählen Sie ein Tier aus',
      errorEnterProduct: 'Bitte geben Sie den Produktnamen ein',
      errorSavingTreatment: 'Fehler beim Speichern der Behandlung',
    },
    breeding: {
      title: 'Neue Paarung',
      female: 'Weibchen',
      male: 'Männchen',
      method: 'Methode',
      date: 'Paarungsdatum',
      notes: 'Notizen',
      notesPlaceholder: 'Beobachtungen, besondere Umstände...',
      expectedKindlingDate: 'Erwartetes Geburtsdatum',
      gestationDays: 'Trächtigkeit',
      methods: {
        natural: 'Natürlich',
        artificialInsemination: 'Künstliche Befruchtung',
      },
      animalName: {
        noName: 'Unbenannt',
      },
      errorSelectFemale: 'Bitte wählen Sie ein Weibchen aus',
      errorEnterDate: 'Bitte geben Sie ein Paarungsdatum ein',
      errorSavingBreeding: 'Fehler beim Speichern der Paarung',
    },
  },

  // Litters
  litters: {
    title: 'Wurfverwaltung',
    searchPlaceholder: 'Nach Mutter, Vater oder Notizen suchen...',
    sortBy: 'Sortieren nach',
    order: 'Reihenfolge',
    sortOptions: {
      date: 'Geburtsdatum',
      mother: 'Mutter',
      offspring: 'Anzahl Nachkommen',
    },
    orderOptions: {
      descending: 'Absteigend',
      ascending: 'Aufsteigend',
    },
    status: {
      weaned: 'Entwöhnt',
      lactating: 'Säugend',
      toWean: 'Zu entwöhnen',
    },
    labels: {
      mother: 'Mutter',
      father: 'Vater',
      unknown: 'Unbekannt',
      offspringCreated: 'Nachkommen erstellt',
      weaning: 'Entwöhnung',
      estimatedWeaning: 'Geschätzte Entwöhnung',
      weaned: 'entwöhnt',
    },
  },

  // Validation
  validation: {
    invalidDate: 'Ungültiges Datum',
    invalidId: 'Ungültige ID',
    nameRequired: 'Name ist erforderlich',
    nameTooLong: 'Name zu lang',
    sexRequired: 'Geschlecht ist erforderlich',
    statusRequired: 'Status ist erforderlich',
    birthDateFuture: 'Geburtsdatum kann nicht in der Zukunft liegen',
    diagnosisAfterBreeding: 'Diagnosedatum muss nach der Paarung liegen',
    weaningAfterKindling: 'Entwöhnungsdatum muss nach der Geburt liegen',
    weanedExceedsAlive: 'Anzahl entwöhnter Tiere kann Lebendgeburten nicht überschreiten',
    weightPositive: 'Gewicht muss größer als 0 sein',
    productRequired: 'Produkt ist erforderlich',
    withdrawalAfterTreatment: 'Ende der Wartezeit muss nach der Behandlung liegen',
  },

  // Export
  export: {
    animals: 'TIERE',
    weights: 'GEWICHTE',
    litters: 'WÜRFE',
    treatments: 'BEHANDLUNGEN',
    cages: 'KÄFIGE',
    tags: 'ETIKETTEN',
    headers: {
      id: 'ID',
      name: 'Name',
      identifier: 'Kennung',
      sex: 'Geschlecht',
      breed: 'Rasse',
      birthDate: 'Geburtsdatum',
      origin: 'Herkunft',
      motherId: 'Mutter ID',
      fatherId: 'Vater ID',
      cage: 'Käfig',
      status: 'Status',
      tags: 'Etiketten',
      consumedDate: 'Verbrauchsdatum',
      consumedWeight: 'Verbrauchsgewicht',
      notes: 'Notizen',
      animalId: 'Tier ID',
      date: 'Datum',
      weight: 'Gewicht (g)',
      kindlingDate: 'Geburtsdatum',
      bornAlive: 'Lebend Geboren',
      stillborn: 'Totgeboren',
      weaningDate: 'Entwöhnungsdatum',
      weanedCount: 'Anzahl Entwöhnt',
      product: 'Produkt',
      lotNumber: 'Losnummer',
      dose: 'Dosis',
      route: 'Weg',
      reason: 'Grund',
      withdrawalUntil: 'Wartezeit Bis',
      description: 'Beschreibung',
      capacity: 'Kapazität',
      location: 'Standort',
      color: 'Farbe',
    },
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcomeTitle: 'Willkommen bei Garenne!',
    welcomeMessage: 'Ihre Farm scheint leer zu sein. Möchten Sie Beispieldaten laden, um die Anwendung zu entdecken?',
    loadSampleData: 'Beispieldaten laden',
    createFirstAnimal: 'Mein erstes Tier erstellen',
    viewDetails: 'Details anzeigen',
    overview: 'Übersicht',
    kpis: {
      liveAnimals: 'Lebende Tiere',
      femalesAndMales: 'Weibchen, Männchen',
      reproductors: 'Züchter',
      reproductorsSubtitle: 'Zuchttiere',
      reproductionPlanning: 'Zuchtplanung',
      reproductionPlanningSubtitle: 'Zuchtkalender',
      quickActions: 'Schnellaktionen',
      quickActionsSubtitle: 'Schneller Feldzugang',
      activeTreatments: 'Aktive Behandlungen',
      activeTreatmentsSubtitle: 'Unter Wartezeit',
      statistics: 'Statistiken',
      statisticsSubtitle: 'Leistungsanalyse',
    },
    quickActions: {
      newAnimal: 'Neues Tier',
      quickWeighing: 'Schnellwiegung',
      newLitter: 'Neuer Wurf',
      treatment: 'Behandlung',
      qrCodes: 'QR-Codes',
    },
  },

  // Statistics page
  statisticsPage: {
    title: 'Statistiken',
    overview: 'Übersicht',
    reproduction: 'Fortpflanzung',
    consumption: 'Verbrauch',
    health: 'Gesundheit',
    otherMetrics: 'Andere Metriken',
    reportGenerated: 'Bericht erstellt am',
    cards: {
      totalAnimals: 'Tiere Gesamt',
      totalAnimalsSubtitle: 'Tiere registriert',
      activeAnimals: 'Aktive Tiere',
      activeAnimalsSubtitle: 'lebend',
      reproductors: 'Züchter',
      reproductorsSubtitle: 'züchtend',
      growing: 'Wachsend',
      growingSubtitle: 'jung',
      totalLitters: 'Würfe Gesamt',
      totalLittersSubtitle: 'Würfe registriert',
      averageSize: 'Durchschnittsgröße',
      averageSizeSubtitle: 'Junge pro Wurf',
      survivalRate: 'Überlebensrate',
      survivalRateSubtitle: 'erfolgreich entwöhnt',
      efficiency: 'Effizienz',
      efficiencySubtitle: 'Würfe/Weibchen/Jahr',
      totalConsumed: 'Verbraucht Gesamt',
      totalConsumedSubtitle: 'Tiere',
      totalWeight: 'Gesamtgewicht',
      totalWeightSubtitle: 'Fleisch produziert',
      averageWeight: 'Durchschnittsgewicht',
      averageWeightSubtitle: 'pro Tier',
      totalTreatments: 'Behandlungen Gesamt',
      totalTreatmentsSubtitle: 'registriert',
      activeWithdrawals: 'Aktive Wartezeiten',
      activeWithdrawalsSubtitle: 'in Bearbeitung',
      commonTreatments: 'Häufige Behandlungen',
      averageAge: 'Durchschnittsalter',
      averageAgeSubtitle: 'Tage',
      averageAnimalWeight: 'Durchschnittsgewicht',
      averageAnimalWeightSubtitle: 'aktive Tiere',
      cageOccupancy: 'Käfigbelegung',
      cageOccupancySubtitle: 'Belegungsrate',
    },
  },
};

// Portuguese translations  
const ptTranslations: Translations = {
  common: {
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    add: 'Adicionar',
    search: 'Pesquisar',
    filter: 'Filtrar',
    export: 'Exportar',
    import: 'Importar',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    confirm: 'Confirmar',
    yes: 'Sim',
    no: 'Não',
    all: 'Todos',
    none: 'Nenhum',
    optional: 'Opcional',
    required: 'Obrigatório',
    from: 'De',
    to: 'Para',
    min: 'Mín',
    max: 'Máx',
  },
  search: {
    intelligentPlaceholder: 'Pesquisa inteligente: nome, identificador, raça, gaiola, notas...',
    advancedFilters: 'Filtros avançados',
    clearFilters: 'Limpar todos os filtros',
    birthDateRange: 'Intervalo de datas de nascimento',
    weightRange: 'Intervalo de peso',
    tips: 'Dicas de pesquisa',
    tip1: 'A pesquisa inteligente tolera erros de digitação e correspondências parciais',
    tip2: 'Combine filtros para refinar seus resultados',
    tip3: 'Os resultados são classificados por relevância com correspondências exatas primeiro',
  },
  nav: {
    dashboard: 'Painel',
    animals: 'Animais',
    litters: 'Ninhadas',
    treatments: 'Tratamentos',
    cages: 'Gaiolas',
    tags: 'Etiquetas',
    statistics: 'Estatísticas',
    settings: 'Configurações',
    planning: 'Planejamento',
    reproduction: 'Reprodução',
  },
  animals: {
    title: 'Gestão de Animais',
    addAnimal: 'Adicionar Animal',
    editAnimal: 'Editar Animal',
    animalDetails: 'Detalhes do Animal',
    name: 'Nome',
    identifier: 'Identificador',
    sex: 'Sexo',
    breed: 'Raça',
    birthDate: 'Data de Nascimento',
    origin: 'Origem',
    cage: 'Gaiola',
    status: 'Status',
    tags: 'Etiquetas',
    notes: 'Notas',
    mother: 'Mãe',
    father: 'Pai',
    weights: 'Pesos',
    treatments: 'Tratamentos',
    offspring: 'Descendência',
    consumedDate: 'Data de Consumo',
    consumedWeight: 'Peso no Consumo',
    markConsumed: 'Marcar como Consumido',
    confirmConsumption: 'Tem certeza de que deseja marcar este animal como consumido?',
  },
  sex: {
    M: 'Macho',
    F: 'Fêmea',
    U: 'Desconhecido',
  },
  status: {
    REPRO: 'Reprodutor',
    GROW: 'Crescimento',
    RETIRED: 'Aposentado',
    DEAD: 'Falecido',
    CONSUMED: 'Consumido',
  },
  origin: {
    BORN_HERE: 'Nascido Aqui',
    PURCHASED: 'Comprado',
  },
  cages: {
    title: 'Gestão de Gaiolas',
    addCage: 'Adicionar Gaiola',
    editCage: 'Editar Gaiola',
    cageDetails: 'Detalhes da Gaiola',
    name: 'Nome',
    description: 'Descrição',
    capacity: 'Capacidade',
    location: 'Localização',
    occupants: 'Ocupantes',
    availability: 'Disponibilidade',
  },
  tags: {
    title: 'Gestão de Etiquetas',
    addTag: 'Adicionar Etiqueta',
    editTag: 'Editar Etiqueta',
    name: 'Nome',
    color: 'Cor',
    description: 'Descrição',
    usage: 'Uso',
  },
  stats: {
    title: 'Estatísticas',
    overview: 'Visão Geral',
    performance: 'Desempenho',
    reproduction: 'Reprodução',
    growth: 'Crescimento',
    totalAnimals: 'Total de Animais',
    reproductors: 'Reprodutores',
    growing: 'Em Crescimento',
    consumed: 'Consumidos',
    averageWeight: 'Peso Médio',
    reproductionRate: 'Taxa de Reprodução',
    survivalRate: 'Taxa de Sobrevivência',
    averageLitterSize: 'Tamanho Médio da Ninhada',
    subtitles: {
      animalsRegistered: 'animais registrados',
      littersRegistered: 'ninhadas registradas',
      littersPerFemalePerYear: 'ninhadas/fêmea/ano',
      animals: 'animais',
      activeAnimals: 'animais ativos',
    },
  },
  settings: {
    title: 'Configurações',
    general: 'Geral',
    appearance: 'Aparência',
    data: 'Dados',
    breeding: 'Criação',
    theme: 'Tema',
    language: 'Idioma',
    units: 'Unidades',
    gestationDuration: 'Duração da Gestação',
    weaningDuration: 'Duração do Desmame',
    reproductionReadyDuration: 'Duração para Reprodução',
    slaughterReadyDuration: 'Duração para Abate',
    exportFormat: 'Formato de Exportação',
    exportData: 'Exportar Dados',
    importData: 'Importar Dados',
    clearData: 'Limpar Dados',
    confirmClearData: 'Tem certeza de que deseja limpar todos os dados?',
  },
  time: {
    days: 'dias',
    weeks: 'semanas',
    months: 'meses',
    years: 'anos',
  },
  messages: {
    animalSaved: 'Animal salvo com sucesso',
    animalDeleted: 'Animal excluído com sucesso',
    cageSaved: 'Gaiola salva com sucesso',
    cageDeleted: 'Gaiola excluída com sucesso',
    tagSaved: 'Etiqueta salva com sucesso',
    tagDeleted: 'Etiqueta excluída com sucesso',
    dataExported: 'Dados exportados com sucesso',
    dataImported: 'Dados importados com sucesso',
    dataCleared: 'Dados limpos com sucesso',
    invalidFile: 'Arquivo inválido',
    operationFailed: 'Operação falhou',
  },

  // Error handling
  errors: {
    title: 'Ops! Ocorreu um erro',
    unexpected: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
    reload: 'Tentar Novamente',
    goHome: 'Ir para o Início',
    developmentDetails: 'Detalhes do erro (apenas desenvolvimento):',
  },
  charts: {
    weightEvolution: 'Evolução do Peso',
    noWeightData: 'Nenhum dado de peso disponível',
    currentWeight: 'Peso Atual',
    totalGain: 'Ganho Total',
    averageDailyGain: 'Ganho Médio Diário',
    initialWeight: 'Peso Inicial',
    weight: 'Peso',
    weightUnit: 'g',
    month: 'Mês',
    births: 'Nascimentos',
    males: 'Machos',
    females: 'Fêmeas',
    retired: 'Aposentados',
  },

  // PrintableSheet
  printableSheet: {
    generalInfo: 'Informações Gerais',
    generatedOn: 'Folha gerada em',
    by: 'por',
    unknownCage: 'Gaiola desconhecida',
    notSpecified: 'Não especificado',
  },
  modals: {
    mortality: {
      title: 'Registrar Morte',
      deathDate: 'Data da Morte',
      deathDateHelperText: 'Não pode estar no futuro',
      suspectedCause: 'Causa Suspeita',
      suspectedCausePlaceholder: 'Doença, acidente, velhice...',
      necropsyPerformed: 'Necrópsia Realizada',
      notes: 'Notas',
      notesPlaceholder: 'Circunstâncias, observações...',
      errorEnterDate: 'Por favor, insira uma data de morte',
      errorFutureDate: 'A data da morte não pode estar no futuro',
      errorBeforeBirth: 'A data da morte não pode ser anterior à data de nascimento',
      errorSavingDeath: 'Erro ao salvar o registro de morte',
    },
    litter: {
      title: 'Nova Ninhada',
      titleRecord: 'Registrar Parto',
      kindlingDate: 'Data do Parto',
      bornAlive: 'Nascidos Vivos',
      stillborn: 'Natimortos',
      malesToCreate: 'Machos a Criar',
      femalesToCreate: 'Fêmeas a Criar',
      notes: 'Notas',
      notesPlaceholder: 'Observações do parto, saúde dos filhotes...',
      autoCreateRabbits: 'Criar coelhos automaticamente',
      totalVersus: 'Total',
      mother: 'Mãe',
      father: 'Pai',
      motherNotSpecified: 'Não especificada',
      fatherNotSpecified: 'Não especificado',
      breedingInfo: 'Acasalamento de',
      expectedKindlingDate: 'Parto esperado em',
      saveLitter: 'Salvar Ninhada',
      errorMotherNotFound: 'Mãe não encontrada',
      errorEnterKindlingDate: 'Por favor, insira uma data de parto',
      errorNegativeNumbers: 'Os números não podem ser negativos',
      errorTotalExceeds: 'O número total de filhotes a criar não pode exceder os nascidos vivos',
      errorSavingLitter: 'Erro ao salvar a ninhada',
    },
    quickWeight: {
      title: 'Pesagem Rápida',
      animal: 'Animal',
      animalPlaceholder: 'Selecionar um animal',
      weightGrams: 'Peso (em gramas)',
      notesOptional: 'Notas (opcional)',
      weightPlaceholder: 'ex: 2500',
      notesPlaceholder: 'Comentários sobre a pesagem...',
      errorValidWeight: 'Por favor, insira um peso válido',
      errorSavingWeight: 'Erro ao salvar o peso',
    },
    treatment: {
      title: 'Tratamento Rápido',
      animal: 'Animal',
      animalPlaceholder: 'Selecionar um animal',
      product: 'Produto',
      productPlaceholder: 'Nome do medicamento ou tratamento',
      dose: 'Dose',
      dosePlaceholder: 'ex: 0,5ml, 1 comprimido',
      route: 'Via de Administração',
      reason: 'Motivo',
      reasonPlaceholder: 'Razão do tratamento',
      withdrawalDays: 'Período de Carência (dias)',
      withdrawalPlaceholder: 'ex: 30',
      withdrawalHelperText: 'Número de dias para aguardar antes do consumo',
      notesOptional: 'Notas (opcional)',
      notesPlaceholder: 'Comentários sobre o tratamento...',
      routes: {
        oral: 'Oral',
        subcutaneous: 'Subcutâneo',
        intramuscular: 'Intramuscular',
        other: 'Outro',
      },
      errorSelectAnimal: 'Por favor, selecione um animal',
      errorEnterProduct: 'Por favor, insira o nome do produto',
      errorSavingTreatment: 'Erro ao salvar o tratamento',
    },
    breeding: {
      title: 'Novo Acasalamento',
      female: 'Fêmea',
      male: 'Macho',
      method: 'Método',
      date: 'Data do Acasalamento',
      notes: 'Notas',
      notesPlaceholder: 'Observações, condições especiais...',
      expectedKindlingDate: 'Data esperada do parto',
      gestationDays: 'Gestação',
      methods: {
        natural: 'Natural',
        artificialInsemination: 'Inseminação Artificial',
      },
      animalName: {
        noName: 'Sem nome',
      },
      errorSelectFemale: 'Por favor, selecione uma fêmea',
      errorEnterDate: 'Por favor, insira uma data de acasalamento',
      errorSavingBreeding: 'Erro ao salvar o acasalamento',
    },
  },

  // Litters
  litters: {
    title: 'Gestão de Ninhadas',
    searchPlaceholder: 'Pesquisar por mãe, pai ou notas...',
    sortBy: 'Ordenar por',
    order: 'Ordem',
    sortOptions: {
      date: 'Data de Nascimento',
      mother: 'Mãe',
      offspring: 'Número de Filhotes',
    },
    orderOptions: {
      descending: 'Decrescente',
      ascending: 'Crescente',
    },
    status: {
      weaned: 'Desmamada',
      lactating: 'Amamentando',
      toWean: 'A Desmamar',
    },
    labels: {
      mother: 'Mãe',
      father: 'Pai',
      unknown: 'Desconhecida',
      offspringCreated: 'Descendentes Criados',
      weaning: 'Desmame',
      estimatedWeaning: 'Desmame Estimado',
      weaned: 'desmamados',
    },
  },

  // Validation
  validation: {
    invalidDate: 'Data inválida',
    invalidId: 'ID inválido',
    nameRequired: 'Nome é obrigatório',
    nameTooLong: 'Nome muito longo',
    sexRequired: 'Sexo é obrigatório',
    statusRequired: 'Status é obrigatório',
    birthDateFuture: 'Data de nascimento não pode estar no futuro',
    diagnosisAfterBreeding: 'Data de diagnóstico deve ser após o acasalamento',
    weaningAfterKindling: 'Data de desmame deve ser após o parto',
    weanedExceedsAlive: 'Número de desmamados não pode exceder os nascidos vivos',
    weightPositive: 'Peso deve ser maior que 0',
    productRequired: 'Produto é obrigatório',
    withdrawalAfterTreatment: 'Data de fim da carência deve ser após o tratamento',
  },

  // Export
  export: {
    animals: 'ANIMAIS',
    weights: 'PESOS',
    litters: 'NINHADAS',
    treatments: 'TRATAMENTOS',
    cages: 'GAIOLAS',
    tags: 'ETIQUETAS',
    headers: {
      id: 'ID',
      name: 'Nome',
      identifier: 'Identificador',
      sex: 'Sexo',
      breed: 'Raça',
      birthDate: 'Data de Nascimento',
      origin: 'Origem',
      motherId: 'ID Mãe',
      fatherId: 'ID Pai',
      cage: 'Gaiola',
      status: 'Status',
      tags: 'Etiquetas',
      consumedDate: 'Data de Consumo',
      consumedWeight: 'Peso no Consumo',
      notes: 'Notas',
      animalId: 'ID Animal',
      date: 'Data',
      weight: 'Peso (g)',
      kindlingDate: 'Data do Parto',
      bornAlive: 'Nascidos Vivos',
      stillborn: 'Natimortos',
      weaningDate: 'Data de Desmame',
      weanedCount: 'Número Desmamados',
      product: 'Produto',
      lotNumber: 'Número do Lote',
      dose: 'Dose',
      route: 'Via',
      reason: 'Motivo',
      withdrawalUntil: 'Carência Até',
      description: 'Descrição',
      capacity: 'Capacidade',
      location: 'Localização',
      color: 'Cor',
    },
  },

  // Dashboard
  dashboard: {
    title: 'Painel',
    welcomeTitle: 'Bem-vindo ao Garenne!',
    welcomeMessage: 'Sua fazenda parece vazia. Gostaria de carregar dados de exemplo para descobrir a aplicação?',
    loadSampleData: 'Carregar dados de exemplo',
    createFirstAnimal: 'Criar meu primeiro animal',
    viewDetails: 'Ver detalhes',
    overview: 'Visão Geral',
    kpis: {
      liveAnimals: 'Animais Vivos',
      femalesAndMales: 'fêmeas, machos',
      reproductors: 'Reprodutores',
      reproductorsSubtitle: 'Animais reprodutores',
      reproductionPlanning: 'Planejamento Reprodutivo',
      reproductionPlanningSubtitle: 'Calendário de criação',
      quickActions: 'Ações Rápidas',
      quickActionsSubtitle: 'Acesso rápido campo',
      activeTreatments: 'Tratamentos Ativos',
      activeTreatmentsSubtitle: 'Sob período de carência',
      statistics: 'Estatísticas',
      statisticsSubtitle: 'Análise de desempenho',
    },
    quickActions: {
      newAnimal: 'Novo animal',
      quickWeighing: 'Pesagem rápida',
      newLitter: 'Nova ninhada',
      treatment: 'Tratamento',
      qrCodes: 'Códigos QR',
    },
  },

  // Statistics page
  statisticsPage: {
    title: 'Estatísticas',
    overview: 'Visão Geral',
    reproduction: 'Reprodução',
    consumption: 'Consumo',
    health: 'Saúde',
    otherMetrics: 'Outras Métricas',
    reportGenerated: 'Relatório gerado em',
    cards: {
      totalAnimals: 'Total de Animais',
      totalAnimalsSubtitle: 'animais registrados',
      activeAnimals: 'Animais Ativos',
      activeAnimalsSubtitle: 'vivos',
      reproductors: 'Reprodutores',
      reproductorsSubtitle: 'reproduzindo',
      growing: 'Em Crescimento',
      growingSubtitle: 'jovens',
      totalLitters: 'Total de Ninhadas',
      totalLittersSubtitle: 'ninhadas registradas',
      averageSize: 'Tamanho Médio',
      averageSizeSubtitle: 'filhotes por ninhada',
      survivalRate: 'Taxa de Sobrevivência',
      survivalRateSubtitle: 'desmame bem-sucedido',
      efficiency: 'Eficiência',
      efficiencySubtitle: 'ninhadas/fêmea/ano',
      totalConsumed: 'Total Consumidos',
      totalConsumedSubtitle: 'animais',
      totalWeight: 'Peso Total',
      totalWeightSubtitle: 'carne produzida',
      averageWeight: 'Peso Médio',
      averageWeightSubtitle: 'por animal',
      totalTreatments: 'Total Tratamentos',
      totalTreatmentsSubtitle: 'registrados',
      activeWithdrawals: 'Carências Ativas',
      activeWithdrawalsSubtitle: 'em andamento',
      commonTreatments: 'Tratamentos Comuns',
      averageAge: 'Idade Média',
      averageAgeSubtitle: 'dias',
      averageAnimalWeight: 'Peso Médio',
      averageAnimalWeightSubtitle: 'animais ativos',
      cageOccupancy: 'Ocupação das Gaiolas',
      cageOccupancySubtitle: 'taxa de ocupação',
    },
  },
};

const translations: Record<Locale, Translations> = {
  'fr-FR': frTranslations,
  'en-US': enTranslations,
  'es-ES': esTranslations,
  'de-DE': deTranslations,
  'pt-PT': ptTranslations,
};

export class I18nService {
  private static currentLocale: Locale = 'fr-FR';

  static setLocale(locale: Locale) {
    this.currentLocale = locale;
  }

  static detectBrowserLocale(): Locale {
    // Get browser language preference
    const browserLang = navigator.language || navigator.languages?.[0] || 'fr-FR';
    
    // Map browser language to supported locales
    const langMap: Record<string, Locale> = {
      'fr': 'fr-FR',
      'fr-FR': 'fr-FR',
      'fr-CA': 'fr-FR',
      'en': 'en-US',
      'en-US': 'en-US',
      'en-GB': 'en-US',
      'en-CA': 'en-US',
      'es': 'es-ES',
      'es-ES': 'es-ES',
      'es-MX': 'es-ES',
      'es-AR': 'es-ES',
      'de': 'de-DE',
      'de-DE': 'de-DE',
      'de-AT': 'de-DE',
      'de-CH': 'de-DE',
      'pt': 'pt-PT',
      'pt-PT': 'pt-PT',
      'pt-BR': 'pt-PT',
    };

    // Try exact match first
    if (langMap[browserLang]) {
      return langMap[browserLang];
    }

    // Try language code without region
    const langCode = browserLang.split('-')[0];
    if (langMap[langCode]) {
      return langMap[langCode];
    }

    // Default to French
    return 'fr-FR';
  }

  static getCurrentLocale(): Locale {
    return this.currentLocale;
  }

  static getTranslations(): Translations {
    return translations[this.currentLocale];
  }

  static t(key: string): string {
    const keys = key.split('.');
    let value: any = translations[this.currentLocale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  }

  static formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(this.currentLocale, options);
  }

  static formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    return number.toLocaleString(this.currentLocale, options);
  }

  static getAvailableLocales(): { code: Locale; name: string }[] {
    return [
      { code: 'fr-FR', name: 'Français' },
      { code: 'en-US', name: 'English' },
      { code: 'es-ES', name: 'Español' },
      { code: 'de-DE', name: 'Deutsch' },
      { code: 'pt-PT', name: 'Português' },
    ];
  }
}