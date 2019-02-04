'use strict'

var gBooks;
const PAGE_SIZE = 6
var currPageIdx = 0
var gView = 'table';
var gSortReverse = false;
var gSortBy = 'id';
const BOOKS_KEY = 'books'

function getBooks(pageIdx) {
    var fromIdx = pageIdx * PAGE_SIZE
    var books = gBooks.slice(fromIdx, fromIdx + PAGE_SIZE)
    return books
}

function getGView() {
    return gView;
}

function createBooks() {
    var books = loadFromLocalStorage(BOOKS_KEY);
    if (!books || books.length === 0) {
        books = []
        var titles = ['Fox in Socks', 'The Cat in the Hat', 'On Beyond Zebra', 'Horton Hatches the Egg', "Dr. Seuss's ABC", 'If I Ran the Zoo', 'Marvin K. Mooney will you Please Go Now!', 'Scrambled Eggs Super!', 'The 500 Hats of Bartholomew Cubbins', 'Hunches in Bunches']
        var authors = ['Dr. Seuss', 'Dr. Seuss', 'Dr. Seuss', 'Dr. Seuss','Dr. Seuss','Dr. Seuss','Dr. Seuss','Dr. Seuss','Dr. Seuss','Dr. Seuss']
        var imgs = ['pics/foxinsocks.jpg', 'pics/The-Cat-in-the-Hat jpg.jpg', 'pics/On-Beyond-Zebra.jpg', 'pics/Horton-Hatches-the-Egg.jpg', "pics/Dr.-Seuss's-ABC.jpg", 'pics/If-I-Ran-the-Zoo.jpg', 'pics/Marvin-K. Mooney-will-you-Please-Go-Now!.jpg', 'pics/Scrambled-Eggs-Super!.jpg', 'pics/The-500-Hats of-Bartholomew-Cubbins.jpg', 'pics/Hunches-in-Bunches.jpg']
        for (let i = 0; i < 10; i++) {
            var author = authors[i];
            var title = titles[i];
            var price = 5*(i+1) + '$'
            var img = imgs[i];
            books.push(createBook(author, title, price, img, 0))
        }
    }
    return books
}

function createBook(author, title, price, img = "pics/book1.jpg", rate = 0) {
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
    })
    gBooks.splice(bookIdx, 1);
    saveToLocalStorage(BOOKS_KEY, gBooks);
}

function addBook(author, title, price, img = "", rate = 0) {
    var book = createBook(author, title, price, img, rate);
    gBooks.push(book);
    saveToLocalStorage(BOOKS_KEY, gBooks);
    var pageIdx = getCurrPageIdx();
    renderBooks(pageIdx);
}

function getBookById(bookId) {
    var book = gBooks.find(function (book) {
        return bookId === book.id
    })
    return book
}

function updateBook(bookId, bookPrice) {
    var bookIdx = gBooks.findIndex(function(book){
        return book.id === bookId;
    })
    gBooks[bookIdx].price = bookPrice;
    saveToLocalStorage(BOOKS_KEY, gBooks);
}

function getGBooks() {
    return gBooks
}

function nextPage() {
    if (currPageIdx < totalPageNum()-1) {
        currPageIdx++;
    };
}
function prevPage() {
    if (currPageIdx >= 0) {
        currPageIdx--;
    };
}

function getCurrPageIdx() {
    return currPageIdx;
}

function setCurrPageIdx(pageId) {
    currPageIdx = pageId;
}

function totalPageNum() {
    return Math.ceil(gBooks.length / PAGE_SIZE);
}

function setView(view) {
    gView = view;
}

function orderBy(filterByTxt) {
    if (filterByTxt === 'none') return;
    if (gSortBy === filterByTxt && !gSortReverse) gSortReverse = true;
    else gSortReverse = false;
    gSortBy = filterByTxt;
    renderBooks(currPageIdx);
}

function sortBooks(a,b) {
    var num =1;
    if (gSortReverse) num = -1;
    if (gSortBy === 'price') {
        var c = a[gSortBy].replace(/(^\d+)(.+$)/i,'$1');
        var d = b[gSortBy].replace(/(^\d+)(.+$)/i,'$1');
        return (d - c)*num;
    }
    if (a[gSortBy] < b[gSortBy]) return -1*num;
    if (a[gSortBy] > b[gSortBy]) return  1*num;
    return 0;
}

function sortGBooks(){
    gBooks = gBooks.sort(sortBooks);
}