// Enhanced museum-specific translations
// frontend/src/i18n/it/index.ts (enhanced version)
import type { BaseTranslation } from "typesafe-i18n";

const it: BaseTranslation = {
    common: {
        loading: 'Caricamento in corso...',
        submit: 'Invia',
        cancel: 'Annulla',
        error: 'Si è verificato un errore',
        tryAgain: 'Riprova',
        close: 'Chiudi',
        next: 'Successivo',
        previous: 'Precedente',
        readMore: 'Leggi di più',
        showLess: 'Mostra meno'
    },

    navigation: {
        home: 'Home',
        about: 'Chi Siamo',
        visit: 'Pianifica la Visita',
        contact: 'Contatti',
        book: 'Prenota Biglietti',
        shop: 'Negozio del Museo',
        exhibitions: 'Mostre',
        collections: 'Collezioni',
        events: 'Eventi',
        news: 'Notizie'
    },

    languages: {
        en: 'English',
        it: 'Italiano',
        de: 'Deutsch'
    },

    // Museum-specific sections
    museum: {
        welcomeTitle: 'Benvenuti al Museo di Zungri',
        welcomeSubtitle: 'Scopri la ricca storia e tradizioni del Sud Italia',
        openingHours: 'Orari di Apertura',
        admissionFees: 'Prezzi dei Biglietti',
        location: 'Come Raggiungerci',
        accessibility: 'Accessibilità'
    },

    exhibitions: {
        current: 'Mostre Attuali',
        upcoming: 'Prossime Mostre',
        past: 'Mostre Passate',
        permanent: 'Collezione Permanente',
        temporary: 'Mostre Temporanee',
        featured: 'Mostra in Evidenza',
        viewDetails: 'Vedi Dettagli',
        duration: 'Durata',
        curator: 'Curatore',
        sponsors: 'Sponsor'
    },

    booking: {
        title: 'Prenota la Tua Visita',
        selectDate: 'Seleziona Data',
        selectTime: 'Seleziona Orario',
        adults: 'Adulti',
        children: 'Bambini',
        students: 'Studenti',
        seniors: 'Anziani',
        groups: 'Gruppi',
        guidedTour: 'Visita Guidata',
        audioGuide: 'Audioguida',
        total: 'Totale',
        proceed: 'Procedi al Pagamento',
        confirmation: 'Conferma Prenotazione'
    },

    visit: {
        planYourVisit: 'Pianifica la Tua Visita',
        beforeYouCome: 'Prima di Venire',
        whatToExpect: 'Cosa Aspettarsi',
        facilities: 'Servizi',
        cafeteria: 'Caffetteria',
        giftShop: 'Negozio di Souvenir',
        parking: 'Parcheggio',
        wheelchairAccess: 'Accesso per Sedie a Rotelle',
        familyFriendly: 'Adatto alle Famiglie'
    },

    contact: {
        getInTouch: 'Contattaci',
        address: 'Indirizzo',
        phone: 'Telefono',
        email: 'Email',
        socialMedia: 'Social Media',
        sendMessage: 'Invia Messaggio',
        yourName: 'Il Tuo Nome',
        yourEmail: 'La Tua Email',
        subject: 'Oggetto',
        message: 'Messaggio',
        messageSent: 'Messaggio Inviato con Successo'
    },

    footer: {
        copyright: '© 2025 Museo di Zungri. Tutti i diritti riservati.',
        privacy: 'Privacy Policy',
        terms: 'Termini e Condizioni',
        newsletter: 'Iscriviti alla Newsletter',
        followUs: 'Seguici',
        supportedBy: 'Con il sostegno di'
    }
};

export default it;