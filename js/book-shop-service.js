'use strict';

var gBooks;
const PAGE_SIZE = 6;
var currPageIdx = 0;
var gView = 'table';
var gSortReverse = false;
var gSortBy = 'id';
const BOOKS_KEY = 'books';


function getBooksForDisply(pageIdx) {
    var fromIdx = pageIdx * PAGE_SIZE;
    var books = gBooks.slice(fromIdx, fromIdx + PAGE_SIZE);
    return books.map(function (book) {
        return {
            id: book.id,
            author: book.author,
            title: book.title,
            price: transPrice(book.price),
            rate: book.rate,
            img: book.img
        }
    });
}

function getGView() {
    return gView;
}

function createBooks() {
    var books = loadFromLocalStorage(BOOKS_KEY);
    if (!books || books.length === 0) {
        books = [];
        var authors = ['Dr. Seuss', 'Dr. Seuss', 'Dr. Seuss', 'Dr. Seuss', 'Dr. Seuss', 'Dr. Seuss', 'Dr. Seuss', 'Dr. Seuss', 'Dr. Seuss', 'Dr. Seuss'];
        var titles = ['Fox in Socks', 'The Cat in the Hat', 'On Beyond Zebra', 'Horton Hatches the Egg', "Dr. Seuss's ABC", 'If I Ran the Zoo', 'Marvin K.Mooney will you Please Go Now!', 'Scrambled Eggs Super!', 'The 500 Hats of Bartholomew Cubbins', 'Hunches in Bunches'];
        for (let i = 0; i < titles.length; i++) {
            books.push(createBook(authors[i], titles[i], 5 * (i + 1), `pics/${titles[i]}.jpg`, 0));
        }
    }
    return books
}

function createBook(author, title, price, img = "", rate = 0) {
    return {
        id: makeId(),
        author: author,
        title: title,
        price: price,
        rate: rate,
        img: img
    }
}

function deletebook(bookId) {
    var bookIdx = gBooks.findIndex(function (book) {
        return bookId === book.id;
    });
    gBooks.splice(bookIdx, 1);
    saveToLocalStorage(BOOKS_KEY, gBooks);
}

function addBook(author, title, price, img = "", rate = 0) {
    var numPrice = getChangeRate(+(price.replace(/\D+/g, '')), true);
    var book = createBook(author, title, numPrice, img, rate);
    gBooks.push(book);
    saveToLocalStorage(BOOKS_KEY, gBooks);
    var pageIdx = getCurrPageIdx();
    renderBooks(pageIdx);
}

function getBookById(bookId) {
    return gBooks.find(function (book) {
        return bookId === book.id
    });
}

function updateBook(bookId, bookPrice) {
    var bookIdx = gBooks.findIndex(function (book) {
        return book.id === bookId;
    });
    gBooks[bookIdx].price = bookPrice;
    saveToLocalStorage(BOOKS_KEY, gBooks);
}

function getGBooks() {
    return gBooks
}

function getCurrPageIdx() {
    return currPageIdx;
}

function setCurrPageIdx(pageId) {
    currPageIdx = pageId;
    renderBooks(currPageIdx);
}

function getTotalPages() {
    return Math.ceil(gBooks.length / PAGE_SIZE);
}

function setView(view) {
    gView = view;
}

function getSortBy() {
    return gSortBy;
}

function orderBy(filterByTxt) {
    if (filterByTxt === 'none') return;
    gSortReverse = gSortBy === filterByTxt && !gSortReverse;
    gSortBy = filterByTxt;
    renderBooks(currPageIdx);
}

function sortBooks(a, b) {
    var num = 1;
    if (gSortReverse) num = -1;
    if (gSortBy === 'price') {
        return (b[gSortBy] - a[gSortBy]) * num;
    }
    if (a[gSortBy] < b[gSortBy]) return -1 * num;
    if (a[gSortBy] > b[gSortBy]) return num;
    return 0;
}

function sortGBooks() {
    gBooks = gBooks.sort(sortBooks);
}

function transPrice(price, reverse = false) {
    return new Intl.NumberFormat(getCurrLang(), {
        style: 'currency',
        currency: getCurrency()
    }).format(getChangeRate(price, reverse))
}