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
  charts: {
    weightEvolution: 'Évolution du poids',
    noWeightData: 'Aucune donnée de poids disponible',
    currentWeight: 'Poids actuel',
    totalGain: 'Gain total',
    averageDailyGain: 'Gain moyen/jour',
    initialWeight: 'Poids initial',
    weight: 'Poids',
    weightUnit: 'g',
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
  charts: {
    weightEvolution: 'Weight Evolution',
    noWeightData: 'No weight data available',
    currentWeight: 'Current Weight',
    totalGain: 'Total Gain',
    averageDailyGain: 'Average Daily Gain',
    initialWeight: 'Initial Weight',
    weight: 'Weight',
    weightUnit: 'g',
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
  charts: {
    weightEvolution: 'Evolución del Peso',
    noWeightData: 'No hay datos de peso disponibles',
    currentWeight: 'Peso Actual',
    totalGain: 'Ganancia Total',
    averageDailyGain: 'Ganancia Promedio Diaria',
    initialWeight: 'Peso Inicial',
    weight: 'Peso',
    weightUnit: 'g',
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
  charts: {
    weightEvolution: 'Gewichtsentwicklung',
    noWeightData: 'Keine Gewichtsdaten verfügbar',
    currentWeight: 'Aktuelles Gewicht',
    totalGain: 'Gesamtzunahme',
    averageDailyGain: 'Durchschnittl. Tageszunahme',
    initialWeight: 'Anfangsgewicht',
    weight: 'Gewicht',
    weightUnit: 'g',
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
  charts: {
    weightEvolution: 'Evolução do Peso',
    noWeightData: 'Nenhum dado de peso disponível',
    currentWeight: 'Peso Atual',
    totalGain: 'Ganho Total',
    averageDailyGain: 'Ganho Médio Diário',
    initialWeight: 'Peso Inicial',
    weight: 'Peso',
    weightUnit: 'g',
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