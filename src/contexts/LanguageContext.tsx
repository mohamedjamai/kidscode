'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'nl' | 'en' | 'fr' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation strings
const translations = {
  nl: {
    // Student Dashboard
    'student.dashboard': 'Studenten Dashboard',
    'student.welcome': 'Welkom terug',
    'student.studentNumber': 'Studentnummer',
    'student.class': 'Klas',
    'student.profile': 'Profiel',
    'student.logout': 'Uitloggen',
    'student.availableLessons': 'Beschikbare Lessen',
    'student.submitted': 'Ingeleverd',
    'student.reviewed': 'Beoordeeld',
    'student.avgGrade': 'Gem. Cijfer',
    'student.yourLessons': 'Jouw Lessen',
    'student.viewAll': 'Bekijk Alles',
    'student.loadingLessons': 'Lessen laden...',
    'student.tryAgain': 'Probeer Opnieuw',
    'student.yourRecentWork': 'Jouw Recente Werk',
    'student.viewReviews': 'Bekijk Beoordelingen',
    'student.noSubmissions': 'Nog geen inleveringen',
    'student.completeLesson': 'Voltooi een les om je werk hier te zien',
    'student.pendingReview': 'Wacht op Beoordeling',
    'student.reviewedBy': 'Beoordeeld door',
    'student.new': 'Nieuw!',
    'student.yourReviewedWork': 'Jouw Beoordeelde Werk',
    'student.grade': 'Cijfer',
    'student.teacherFeedback': 'Docent feedback',
    'student.noNewReviews': 'Nog geen nieuwe beoordelingen',
    'student.lesson': 'Les',

    // Teacher Dashboard
    'teacher.dashboard': 'Docenten Dashboard',
    'teacher.welcome': 'Welkom terug! Hier is je klasoverzicht.',
    'teacher.totalStudents': 'Totaal Studenten',
    'teacher.averageProgress': 'Gemiddelde Voortgang',
    'teacher.mostCommonLevel': 'Meest Voorkomende Niveau',
    'teacher.manageLessons': 'Beheer Lessen',
    'teacher.manageLessonsDesc': 'Bewerk, verwijder en bekijk lessen',
    'teacher.createNewLesson': 'Nieuwe Les Maken',
    'teacher.createNewLessonDesc': 'Ontwerp spannende programmeer avonturen',
    'teacher.reviewSubmissions': 'Beoordeel Inleveringen',
    'teacher.reviewSubmissionsDesc': 'Geef cijfers en feedback op studentenwerk',
    'teacher.studentProgress': 'Studenten Voortgang',
    'teacher.student': 'Student',
    'teacher.currentLevel': 'Huidig Niveau',
    'teacher.progress': 'Voortgang',
    'teacher.actions': 'Acties',
    'teacher.viewDetails': 'Bekijk Details',
    'teacher.teachingTip': 'Onderwijstip van de Dag',
    'teacher.tipText': 'Moedig studenten aan om te experimenteren met de code! Fouten maken is een cruciaal onderdeel van het leren programmeren.',
    'teacher.mode': 'Docent Modus',
    'teacher.logout': 'Uitloggen',
    'teacher.secureSession': 'Beveiligde Sessie',
    'teacher.sessionActive': 'Sessie: Actief',

    // Student Management
    'teacher.students': 'Studenten',
    'teacher.studentsOverview': 'Studenten Overzicht',
    'teacher.manageStudents': 'Beheer en monitor je studenten en hun voortgang',
    'teacher.studentsTotal': 'Totaal Studenten',
    'teacher.activeStudents': 'Actieve Studenten',
    'teacher.averageGradeShort': 'Gem. Cijfer',
    'teacher.search': 'Zoeken',
    'teacher.searchPlaceholder': 'Naam, email of studentnummer...',
    'teacher.classFilter': 'Klas Filter',
    'teacher.allClasses': 'Alle klassen',
    'teacher.sortBy': 'Sorteer op',
    'teacher.sortByName': 'Naam',
    'teacher.sortByProgress': 'Voortgang',
    'teacher.sortByGrade': 'Gemiddeld Cijfer',
    'teacher.sortByLastActive': 'Laatst Actief',
    'teacher.sortOrder': 'Volgorde',
    'teacher.ascending': 'Oplopend',
    'teacher.descending': 'Aflopend',
    'teacher.class': 'Klas',
    'teacher.status': 'Status',
    'teacher.active': 'Actief',
    'teacher.inactive': 'Inactief',
    'teacher.lastActive': 'Laatst Actief',
    'teacher.today': 'Vandaag',
    'teacher.yesterday': 'Gisteren',
    'teacher.daysAgo': 'dagen geleden',
    'teacher.never': 'Nooit',
    'teacher.details': 'Details',
    'teacher.noStudentsFound': 'Geen studenten gevonden met de huidige filters',
    'teacher.transferStudent': 'Student Verplaatsen',
    'teacher.transferTo': 'Verplaats naar een andere klas',
    'teacher.selectNewClass': 'Selecteer nieuwe klas',
    'teacher.chooseClass': 'Kies een klas...',
    'teacher.cancel': 'Annuleren',
    'teacher.transfer': 'Verplaatsen',
    'teacher.transferring': 'Verplaatsen...',
    'teacher.submissionDetails': 'Inlevering Details',
    'teacher.submittedOn': 'Ingeleverd',
    'teacher.htmlCode': 'HTML Code',
    'teacher.cssCode': 'CSS Code',
    'teacher.javascriptCode': 'JavaScript Code',
    'teacher.preview': 'Preview',
    'teacher.feedback': 'Feedback',
    'teacher.noCode': 'Geen code',
    'teacher.backToDashboard': 'Terug naar Dashboard',
    'teacher.studentNumber': 'Studentnummer',
    'teacher.schoolId': 'School ID',
    'teacher.enrolledOn': 'Ingeschreven',
    'teacher.level': 'Niveau',
    'teacher.submissions': 'Inleveringen',
    'teacher.total': 'Totaal',
    'teacher.reviewed': 'Beoordeeld',
    'teacher.submissionsFrom': 'Inleveringen van',
    'teacher.noSubmissions': 'Nog geen inleveringen',
    'teacher.waitingForReview': 'Wacht op beoordeling',
    'teacher.completedLessons': 'van %{total} lessen voltooid',

    // Common
    'language.select': 'Taal kiezen',
    'language.dutch': 'Nederlands',
    'language.english': 'Engels',
    'language.french': 'Frans',
    'language.german': 'Duits',
  },
  en: {
    // Student Dashboard
    'student.dashboard': 'Student Dashboard',
    'student.welcome': 'Welcome back',
    'student.studentNumber': 'Student #',
    'student.class': 'Class',
    'student.profile': 'Profile',
    'student.logout': 'Log Out',
    'student.availableLessons': 'Available Lessons',
    'student.submitted': 'Submitted',
    'student.reviewed': 'Reviewed',
    'student.avgGrade': 'Avg Grade',
    'student.yourLessons': 'Your Lessons',
    'student.viewAll': 'View All',
    'student.loadingLessons': 'Loading lessons...',
    'student.tryAgain': 'Try Again',
    'student.yourRecentWork': 'Your Recent Work',
    'student.viewReviews': 'View Reviews',
    'student.noSubmissions': 'No submissions yet',
    'student.completeLesson': 'Complete a lesson to see your work here',
    'student.pendingReview': 'Pending Review',
    'student.reviewedBy': 'Reviewed by',
    'student.new': 'New!',
    'student.yourReviewedWork': 'Your Reviewed Work',
    'student.grade': 'Grade',
    'student.teacherFeedback': 'Teacher feedback',
    'student.noNewReviews': 'No new reviews yet',
    'student.lesson': 'Lesson',

    // Teacher Dashboard
    'teacher.dashboard': 'Teacher Dashboard',
    'teacher.welcome': 'Welcome back! Here\'s your class overview.',
    'teacher.totalStudents': 'Total Students',
    'teacher.averageProgress': 'Average Progress',
    'teacher.mostCommonLevel': 'Most Common Level',
    'teacher.manageLessons': 'Manage Lessons',
    'teacher.manageLessonsDesc': 'Edit, delete, and preview lessons',
    'teacher.createNewLesson': 'Create New Lesson',
    'teacher.createNewLessonDesc': 'Design exciting coding adventures',
    'teacher.reviewSubmissions': 'Review Submissions',
    'teacher.reviewSubmissionsDesc': 'Grade and provide feedback on student work',
    'teacher.studentProgress': 'Student Progress',
    'teacher.student': 'Student',
    'teacher.currentLevel': 'Current Level',
    'teacher.progress': 'Progress',
    'teacher.actions': 'Actions',
    'teacher.viewDetails': 'View Details',
    'teacher.teachingTip': 'Teaching Tip of the Day',
    'teacher.tipText': 'Encourage students to experiment with the code! Making mistakes is a crucial part of learning programming.',
    'teacher.mode': 'Teacher Mode',
    'teacher.logout': 'Log Out',
    'teacher.secureSession': 'Secure Session',
    'teacher.sessionActive': 'Session: Active',

    // Student Management
    'teacher.students': 'Students',
    'teacher.studentsOverview': 'Students Overview',
    'teacher.manageStudents': 'Manage and monitor your students and their progress',
    'teacher.activeStudents': 'Active Students',
    'teacher.averageGradeShort': 'Avg Grade',
    'teacher.search': 'Search',
    'teacher.searchPlaceholder': 'Name, email or student number...',
    'teacher.classFilter': 'Class Filter',
    'teacher.allClasses': 'All classes',
    'teacher.sortBy': 'Sort by',
    'teacher.sortByName': 'Name',
    'teacher.sortByProgress': 'Progress',
    'teacher.sortByGrade': 'Average Grade',
    'teacher.sortByLastActive': 'Last Active',
    'teacher.sortOrder': 'Order',
    'teacher.ascending': 'Ascending',
    'teacher.descending': 'Descending',
    'teacher.class': 'Class',
    'teacher.status': 'Status',
    'teacher.active': 'Active',
    'teacher.inactive': 'Inactive',
    'teacher.lastActive': 'Last Active',
    'teacher.today': 'Today',
    'teacher.yesterday': 'Yesterday',
    'teacher.daysAgo': 'days ago',
    'teacher.never': 'Never',
    'teacher.details': 'Details',
    'teacher.noStudentsFound': 'No students found with the current filters',
    'teacher.transferStudent': 'Transfer Student',
    'teacher.transferTo': 'Transfer to another class',
    'teacher.selectNewClass': 'Select new class',
    'teacher.chooseClass': 'Choose a class...',
    'teacher.cancel': 'Cancel',
    'teacher.transfer': 'Transfer',
    'teacher.transferring': 'Transferring...',
    'teacher.submissionDetails': 'Submission Details',
    'teacher.submittedOn': 'Submitted',
    'teacher.htmlCode': 'HTML Code',
    'teacher.cssCode': 'CSS Code',
    'teacher.javascriptCode': 'JavaScript Code',
    'teacher.preview': 'Preview',
    'teacher.feedback': 'Feedback',
    'teacher.noCode': 'No code',
    'teacher.backToDashboard': 'Back to Dashboard',
    'teacher.studentNumber': 'Student Number',
    'teacher.schoolId': 'School ID',
    'teacher.enrolledOn': 'Enrolled',
    'teacher.level': 'Level',
    'teacher.submissions': 'Submissions',
    'teacher.total': 'Total',
    'teacher.reviewed': 'Reviewed',
    'teacher.submissionsFrom': 'Submissions from',
    'teacher.noSubmissions': 'No submissions yet',
    'teacher.waitingForReview': 'Waiting for review',
    'teacher.completedLessons': 'of %{total} lessons completed',

    // Common
    'language.select': 'Select Language',
    'language.dutch': 'Dutch',
    'language.english': 'English',
    'language.french': 'French',
    'language.german': 'German',
  },
  fr: {
    // Student Dashboard
    'student.dashboard': 'Tableau de Bord Étudiant',
    'student.welcome': 'Bon retour',
    'student.studentNumber': 'N° Étudiant',
    'student.class': 'Classe',
    'student.profile': 'Profil',
    'student.logout': 'Se Déconnecter',
    'student.availableLessons': 'Leçons Disponibles',
    'student.submitted': 'Soumis',
    'student.reviewed': 'Évalué',
    'student.avgGrade': 'Note Moy.',
    'student.yourLessons': 'Vos Leçons',
    'student.viewAll': 'Voir Tout',
    'student.loadingLessons': 'Chargement des leçons...',
    'student.tryAgain': 'Réessayer',
    'student.yourRecentWork': 'Votre Travail Récent',
    'student.viewReviews': 'Voir les Évaluations',
    'student.noSubmissions': 'Aucune soumission encore',
    'student.completeLesson': 'Complétez une leçon pour voir votre travail ici',
    'student.pendingReview': 'En Attente d\'Évaluation',
    'student.reviewedBy': 'Évalué par',
    'student.new': 'Nouveau!',
    'student.yourReviewedWork': 'Votre Travail Évalué',
    'student.grade': 'Note',
    'student.teacherFeedback': 'Commentaire du professeur',
    'student.noNewReviews': 'Aucune nouvelle évaluation',
    'student.lesson': 'Leçon',

    // Teacher Dashboard
    'teacher.dashboard': 'Tableau de Bord Professeur',
    'teacher.welcome': 'Bon retour! Voici l\'aperçu de votre classe.',
    'teacher.totalStudents': 'Total Étudiants',
    'teacher.averageProgress': 'Progrès Moyen',
    'teacher.mostCommonLevel': 'Niveau le Plus Commun',
    'teacher.manageLessons': 'Gérer les Leçons',
    'teacher.manageLessonsDesc': 'Modifier, supprimer et prévisualiser les leçons',
    'teacher.createNewLesson': 'Créer une Nouvelle Leçon',
    'teacher.createNewLessonDesc': 'Concevez des aventures de codage passionnantes',
    'teacher.reviewSubmissions': 'Évaluer les Soumissions',
    'teacher.reviewSubmissionsDesc': 'Noter et donner des commentaires sur le travail des étudiants',
    'teacher.studentProgress': 'Progrès des Étudiants',
    'teacher.student': 'Étudiant',
    'teacher.currentLevel': 'Niveau Actuel',
    'teacher.progress': 'Progrès',
    'teacher.actions': 'Actions',
    'teacher.viewDetails': 'Voir les Détails',
    'teacher.teachingTip': 'Conseil Pédagogique du Jour',
    'teacher.tipText': 'Encouragez les étudiants à expérimenter avec le code! Faire des erreurs est une partie cruciale de l\'apprentissage de la programmation.',
    'teacher.mode': 'Mode Professeur',
    'teacher.logout': 'Se Déconnecter',
    'teacher.secureSession': 'Session Sécurisée',
    'teacher.sessionActive': 'Session: Active',

    // Student Management
    'teacher.students': 'Étudiants',
    'teacher.studentsOverview': 'Aperçu des Étudiants',
    'teacher.manageStudents': 'Gérer et surveiller vos étudiants et leur progression',
    'teacher.activeStudents': 'Étudiants Actifs',
    'teacher.averageGradeShort': 'Note Moy.',
    'teacher.search': 'Rechercher',
    'teacher.searchPlaceholder': 'Nom, email ou numéro d\'étudiant...',
    'teacher.classFilter': 'Filtre de Classe',
    'teacher.allClasses': 'Toutes les classes',
    'teacher.sortBy': 'Trier par',
    'teacher.sortByName': 'Nom',
    'teacher.sortByProgress': 'Progression',
    'teacher.sortByGrade': 'Note Moyenne',
    'teacher.sortByLastActive': 'Dernière Activité',
    'teacher.sortOrder': 'Ordre',
    'teacher.ascending': 'Croissant',
    'teacher.descending': 'Décroissant',
    'teacher.class': 'Classe',
    'teacher.status': 'État',
    'teacher.active': 'Actif',
    'teacher.inactive': 'Inactif',
    'teacher.lastActive': 'Dernière Activité',
    'teacher.today': 'Aujourd\'hui',
    'teacher.yesterday': 'Hier',
    'teacher.daysAgo': 'jours',
    'teacher.never': 'Jamais',
    'teacher.details': 'Détails',
    'teacher.noStudentsFound': 'Aucun étudiant trouvé avec les filtres actuels',
    'teacher.transferStudent': 'Transférer Étudiant',
    'teacher.transferTo': 'Transférer vers une autre classe',
    'teacher.selectNewClass': 'Sélectionner une nouvelle classe',
    'teacher.chooseClass': 'Choisir une classe...',
    'teacher.cancel': 'Annuler',
    'teacher.transfer': 'Transférer',
    'teacher.transferring': 'Transférer...',
    'teacher.submissionDetails': 'Détails de Soumission',
    'teacher.submittedOn': 'Soumis',
    'teacher.htmlCode': 'Code HTML',
    'teacher.cssCode': 'Code CSS',
    'teacher.javascriptCode': 'Code JavaScript',
    'teacher.preview': 'Aperçu',
    'teacher.feedback': 'Retour',
    'teacher.noCode': 'Pas de code',
    'teacher.backToDashboard': 'Retour au Tableau de Bord',
    'teacher.studentNumber': 'Numéro Étudiant',
    'teacher.schoolId': 'ID École',
    'teacher.enrolledOn': 'Inscrit',
    'teacher.level': 'Niveau',
    'teacher.submissions': 'Soumissions',
    'teacher.total': 'Total',
    'teacher.reviewed': 'Évalué',
    'teacher.submissionsFrom': 'Soumissions de',
    'teacher.noSubmissions': 'Aucune soumission encore',
    'teacher.waitingForReview': 'En attente d\'évaluation',
    'teacher.completedLessons': 'de %{total} leçons terminées',

    // Common
    'language.select': 'Choisir la Langue',
    'language.dutch': 'Néerlandais',
    'language.english': 'Anglais',
    'language.french': 'Français',
    'language.german': 'Allemand',
  },
  de: {
    // Student Dashboard
    'student.dashboard': 'Schüler Dashboard',
    'student.welcome': 'Willkommen zurück',
    'student.studentNumber': 'Schüler-Nr.',
    'student.class': 'Klasse',
    'student.profile': 'Profil',
    'student.logout': 'Abmelden',
    'student.availableLessons': 'Verfügbare Lektionen',
    'student.submitted': 'Eingereicht',
    'student.reviewed': 'Bewertet',
    'student.avgGrade': 'Durchschn. Note',
    'student.yourLessons': 'Ihre Lektionen',
    'student.viewAll': 'Alle Anzeigen',
    'student.loadingLessons': 'Lektionen laden...',
    'student.tryAgain': 'Nochmal Versuchen',
    'student.yourRecentWork': 'Ihre Neueste Arbeit',
    'student.viewReviews': 'Bewertungen Anzeigen',
    'student.noSubmissions': 'Noch keine Einreichungen',
    'student.completeLesson': 'Schließen Sie eine Lektion ab, um Ihre Arbeit hier zu sehen',
    'student.pendingReview': 'Warten auf Bewertung',
    'student.reviewedBy': 'Bewertet von',
    'student.new': 'Neu!',
    'student.yourReviewedWork': 'Ihre Bewertete Arbeit',
    'student.grade': 'Note',
    'student.teacherFeedback': 'Lehrer Feedback',
    'student.noNewReviews': 'Noch keine neuen Bewertungen',
    'student.lesson': 'Lektion',

    // Teacher Dashboard
    'teacher.dashboard': 'Lehrer Dashboard',
    'teacher.welcome': 'Willkommen zurück! Hier ist Ihre Klassenübersicht.',
    'teacher.totalStudents': 'Gesamte Schüler',
    'teacher.averageProgress': 'Durchschnittlicher Fortschritt',
    'teacher.mostCommonLevel': 'Häufigstes Niveau',
    'teacher.manageLessons': 'Lektionen Verwalten',
    'teacher.manageLessonsDesc': 'Lektionen bearbeiten, löschen und vorschauen',
    'teacher.createNewLesson': 'Neue Lektion Erstellen',
    'teacher.createNewLessonDesc': 'Aufregende Programmierabenteuer entwerfen',
    'teacher.reviewSubmissions': 'Einreichungen Bewerten',
    'teacher.reviewSubmissionsDesc': 'Schülerarbeiten bewerten und Feedback geben',
    'teacher.studentProgress': 'Schülerfortschritt',
    'teacher.student': 'Schüler',
    'teacher.currentLevel': 'Aktuelles Niveau',
    'teacher.progress': 'Fortschritt',
    'teacher.actions': 'Aktionen',
    'teacher.viewDetails': 'Details Anzeigen',
    'teacher.teachingTip': 'Unterrichtstipp des Tages',
    'teacher.tipText': 'Ermutigen Sie Schüler, mit dem Code zu experimentieren! Fehler zu machen ist ein wichtiger Teil des Programmierenlernens.',
    'teacher.mode': 'Lehrer Modus',
    'teacher.logout': 'Abmelden',
    'teacher.secureSession': 'Sichere Sitzung',
    'teacher.sessionActive': 'Sitzung: Aktiv',

    // Student Management
    'teacher.students': 'Schüler',
    'teacher.studentsOverview': 'Schüler Übersicht',
    'teacher.manageStudents': 'Schüler verwalten und ihren Fortschritt überwachen',
    'teacher.activeStudents': 'Aktive Schüler',
    'teacher.averageGradeShort': 'Durchschn. Note',
    'teacher.search': 'Suchen',
    'teacher.searchPlaceholder': 'Name, E-Mail oder Schüler-Nr...',
    'teacher.classFilter': 'Klassenfilter',
    'teacher.allClasses': 'Alle Klassen',
    'teacher.sortBy': 'Sortieren nach',
    'teacher.sortByName': 'Name',
    'teacher.sortByProgress': 'Fortschritt',
    'teacher.sortByGrade': 'Durchschnittliche Note',
    'teacher.sortByLastActive': 'Letzte Aktivität',
    'teacher.sortOrder': 'Reihenfolge',
    'teacher.ascending': 'Aufsteigend',
    'teacher.descending': 'Absteigend',
    'teacher.class': 'Klasse',
    'teacher.status': 'Status',
    'teacher.active': 'Aktiv',
    'teacher.inactive': 'Inaktiv',
    'teacher.lastActive': 'Letzte Aktivität',
    'teacher.today': 'Heute',
    'teacher.yesterday': 'Gestern',
    'teacher.daysAgo': 'Tage',
    'teacher.never': 'Nie',
    'teacher.details': 'Details',
    'teacher.noStudentsFound': 'Keine Schüler gefunden mit den aktuellen Filtern',
    'teacher.transferStudent': 'Schüler übertragen',
    'teacher.transferTo': 'Übertragen zu einer anderen Klasse',
    'teacher.selectNewClass': 'Neue Klasse auswählen',
    'teacher.chooseClass': 'Klasse auswählen...',
    'teacher.cancel': 'Abbrechen',
    'teacher.transfer': 'Übertragen',
    'teacher.transferring': 'Übertragen...',
    'teacher.submissionDetails': 'Einreichung Details',
    'teacher.submittedOn': 'Eingereicht',
    'teacher.htmlCode': 'HTML Code',
    'teacher.cssCode': 'CSS Code',
    'teacher.javascriptCode': 'JavaScript Code',
    'teacher.preview': 'Vorschau',
    'teacher.feedback': 'Feedback',
    'teacher.noCode': 'Kein Code',
    'teacher.backToDashboard': 'Zurück zum Dashboard',
    'teacher.studentNumber': 'Schüler-Nr.',
    'teacher.schoolId': 'Schul-ID',
    'teacher.enrolledOn': 'Eingeschrieben',
    'teacher.level': 'Niveau',
    'teacher.submissions': 'Einreichungen',
    'teacher.total': 'Gesamt',
    'teacher.reviewed': 'Bewertet',
    'teacher.submissionsFrom': 'Einreichungen von',
    'teacher.noSubmissions': 'Noch keine Einreichungen',
    'teacher.waitingForReview': 'Warten auf Bewertung',
    'teacher.completedLessons': 'von %{total} Lektionen abgeschlossen',

    // Common
    'language.select': 'Sprache Wählen',
    'language.dutch': 'Niederländisch',
    'language.english': 'Englisch',
    'language.french': 'Französisch',
    'language.german': 'Deutsch',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('nl'); // Dutch as default

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('kidscode-language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kidscode-language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    const currentTranslations = translations[language] as Record<string, string>;
    return currentTranslations?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 