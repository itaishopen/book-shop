var gCurrLocale = 'en';
const gTrans = {
    en: {
        SITE_TITLE: 'Books',
        TABLE: 'table',
        SHELF: 'shelf',
        ID: 'Book Id',
        TITLE: 'Book Title',
        PRICE: 'Book Price',
        AUTHOR: 'Author',
        ACTION: 'Action',
        READ: 'Read',
        UPDATE: 'Update',
        DELETE: 'Delete',
        ADD: 'Add',
        RATE: 'Rate',
        CHOOSE: 'Upload an image',
        BOOK_UPDATE: 'Book Update',
        BOOK_DETAILS: 'Book Details',
        BOOK_DELETE: 'Confirm Action',
        YES: 'Yes',
        NO: 'No',
        CONFIRM: 'Are you sure you want to delete the book',
        BY: 'by',
    },
    de: {
        SITE_TITLE: 'Bücher',
        TABLE: 'Tabelle',
        SHELF: 'Regal',
        ID: 'Buch Id',
        TITLE: 'Buchtitel',
        PRICE: 'Preis Buchen',
        AUTHOR: 'Autor',
        ACTION: 'Aktion',
        READ: 'Lesen',
        UPDATE: 'Aktualisieren',
        DELETE: 'Löschen',
        ADD: 'Hinzufügen',
        RATE: 'Bewertung',
        CHOOSE: 'Lade Ein Bild Hoch',
        BOOK_UPDATE: 'Buch Update',
        BOOK_DETAILS: 'Buchdetails',
        BOOK_DELETE: 'Aktion bestätigen',
        YES: 'Ja',
        NO: 'Nein',
        CONFIRM: 'Möchten Sie das Buch wirklich löschen',
        BY: 'Geschrieben von',
    },
    he: {
        SITE_TITLE: 'ספרים',
        TABLE: 'טבלה',
        SHELF: 'מדף',
        ID: 'מק"ט',
        TITLE: 'שם הספר',
        PRICE: 'מחיר הספר',
        AUTHOR: 'סופר',
        ACTION: 'פעולה',
        DELETE: 'מחק',
        READ: 'לקרוא',
        UPDATE: 'לעדכן',
        ADD: 'הוסף',
        RATE: 'דירוג',
        CHOOSE: 'בחר תמונה להעלאה',
        BOOK_UPDATE: 'עדכון',
        BOOK_DETAILS: 'פרטי הספר',
        BOOK_DELETE: 'אשר את הפעולה',
        YES: 'כן',
        NO: 'לא',
        CONFIRM: 'האם אתה בטוח שברצונך למחוק את',
        BY: 'שנכתב על ידי',
    }
};

const gCurrency = {
    en: 'USD',
    de: 'EUR',
    he: 'ILS'
};

function getTrans(transKey) {
    return gTrans[gCurrLocale][transKey];
}

function getCurrency() {
    return gCurrency[gCurrLocale];
}

function getCurrLang() {
    return gCurrLocale;
}

function setLang(lang) {
    gCurrLocale = lang;
}

function getChangeRate(price, reverse = false) {
    if (reverse) return price / exchangeRate();
    return price * exchangeRate();
}

function exchangeRate() {
    switch (getCurrLang()) {
        case 'he':
            return 3.6;
        case 'de':
            return 0.9;
        case 'en':
            return 1;
    }
}
