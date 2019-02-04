
function init() {
    gBooks = createBooks()
    var pageIdx = getCurrPageIdx();
    renderBooks(pageIdx);
}


function renderBooks(pageIdx) {
    sortGBooks()
    var books = getBooks(pageIdx)
    if (getGView() === 'shelf') {
        renderShelf(books);
    } else {
        renderTable(books);
    }
    var pageNumbersStr = `<a onclick="onPrevPage()">&laquo;</a>`;
    for (var j = 0; j < totalPageNum(); j++) {
        pageNumbersStr += `<a id="page-${j + 1}" onclick="selectPage(${j})">${j + 1}</a>`;
    }
    pageNumbersStr += `<a onclick="onNextPage()">&raquo;</a>`;
    $('.pagination').html(pageNumbersStr);
    $(`#page-${+pageIdx + 1}`).addClass('active');
    saveToLocalStorage(BOOKS_KEY, getGBooks());
}

function renderShelf(books) {
    var counter = 1;
    var strHtmls = books.map(function (book) {
        var currCounter = counter++;
        return `
        <div class="card book book-item${currCounter}">
        <img class="card-img-top" src="${book.img}" onclick="onReadBook('${book.id}')" onerror="imgSolver('${book.title}','${book.author}', 'book-item${currCounter}')">
        <div class="btn delete-btn" onclick="onDeleteBook('${book.id}')">&#10006;</div>
            <div class = "img-info" onclick="onReadBook('${book.id}')">
                <div class = "img-title"></div>
                <div class = "img-Author"></div>
            </div>
            <div class="lower">
                <div class="card-Price">Book Price: ${book.price}</div>
                <div class="lower-btn">
                    <div class="btn btn-update shelf-update" onclick="readAndUpdateBook('${book.id}')">Update</div>
                </div>
            </div>
        </div> 
        `
    })
    strRow1 = '';
    strRow2 = '';
    for (var i = 0; i < strHtmls.length; i++) {
        if (i < 3) strRow1 += strHtmls[i];
        else strRow2 += strHtmls[i];
    }
    $('.row-1 .loc').html(strRow1);
    $('.row-2 .loc').html(strRow2);
    $('table').hide();
    $('.shelf').show();
}

function renderTable(books) {
    var strHtmls = books.map(function (book) {
        return `
        <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.price}</td>
            <td>
                <button class="btn btn-read" onclick="onReadBook('${book.id}')">Read</button>
            </td>
            <td>
                <button class="btn btn-update" onclick="readAndUpdateBook('${book.id}')">Update</button>
            </td>
            <td>
                <button class="btn btn-delete" onclick="onDeleteBook('${book.id}')">Delete</button>
            </td>
        </tr>
        `
    })
    $('tbody').html(strHtmls.join(''));
    $('table').show();
    $('.shelf').hide();
}

function imgSolver(title, author, className) {
    $(`.${className} img`).hide();
    $(`.${className} .img-info .img-title`).text(title);
    $(`.${className} .img-info .img-Author`).text(author);
}

function onReadBook(bookId) {
    var book = getBookById(bookId);
    var popStr = `
    <div class="box small-6 large-centered">
    <a onclick="closePopup()" class="close-button">&#10006;</a>
        <h3>Book Details</h3>
        <div class="main-pop">
            <div class="img-upload">
                <label class="btn upload-label" for="image_uploads" style="display: none">Choose images to upload</label>
                <input id="image_uploads" type="file" onchange="previewFile()" accept="image/*" style="opacity:0"><br>
                <img class="small-img" src="${book.img}" height="115px" width="83px" onerror="onImgMissing()">
            </div>
            <div class="info-container">
                <div class="pop-title">Book Title: ${book.title}</div>
                <div class="pop-author">Author: ${book.author}</div>
                <div class="pop-price">Price: ${book.price}</div>
                <div class="pop-rate">Rate: 
                    <div class="rate-change">
                        <a onclick="onRateChange(-1, '${book.id}')">-</a> 
                        <span>${book.rate}</span> 
                        <a onclick="onRateChange(1, '${book.id}')">+</a>
                    </div>
                </div>
                <a onclick="updateImg('${book.id}')" class="btn button1" style="display: none">Update Img</a>
            </div>
        </div>
    </div>`
    var $model = $('.pop-up');
    $model.html(popStr);
    $model.show();
}

function updateImg(bookId) {
    var book = getBookById(bookId);
    book.img = $('img').attr('src');
    closePopup();
    renderBooks(getCurrPageIdx());
}

function onImgMissing() {
    $('.img-upload label').show();
    $('.button1').show()
}

function onRateChange(num, bookId) {
    var book = getBookById(bookId);
    book.rate += +num;
    var rate = book.rate
    if (rate <= 10 && rate >= 0) $('.pop-rate span').text(rate);
    else{book.rate -= +num;}
    saveToLocalStorage(BOOKS_KEY, getGBooks());
}

function addRateChange(num) {
    var rate = +$('.rate-change span').text()
    rate += +num;
    if (rate <= 10 && rate >= 0) $('.pop-rate span').text(rate);
    else{rate -= +num;}
}

function onDeleteBook(bookId) {
    deletebook(bookId)
    var pageIdx = getCurrPageIdx()
    renderBooks(pageIdx)
}

function readAndAddNewBook() {
    var popStr = `
    <div class="box small-6 large-centered">
        <a onclick="closePopup()" class="close-button">&#10006;</a>
        <h3>Book Update</h3>
        <div class="main-pop">
            <div class="img-upload">
                <label class="btn upload-label" for="image_uploads" style="display: none">Choose images to upload</label>
                <input id="image_uploads" type="file" onchange="previewFile()" accept="image/*" style="opacity:0"><br>
                <img class="small-img" src="" height="115px" width="83px" onerror="onImgMissing()">
            </div>
            <div class="info-container">
                <div class="pop-title">Book Title: 
                <input class="pop-new-title" type="text" value="" placeholder="Book Title" required></div>
                <div class="pop-author">Author:
                <input class="pop-new-author" type="text" value="" placeholder="Author" required></div>
                <div class="pop-price">Price: 
                    <input class="pop-new-price" type="text" value="" placeholder="0$" >
                    </div>
                    <div class="pop-rate">Rate: 
                        <div class="rate-change">
                            <a onclick="addRateChange(-1)">-</a> 
                            <span>0</span> 
                            <a onclick="addRateChange(1)">+</a>
                        </div>
                    </div>
                <a onclick="addNewBook()" class="button1">Add</a>
            </div>
        </div>
    </div>`
    var $model = $('.pop-up');
    $model.html(popStr);
    $model.show();
    
}

function addNewBook() {
    closePopup()
    var author = $('.pop-new-author').val();
    var title = $('.pop-new-title').val();
    var price = $('.pop-new-price').val();
    var img = $('img').attr('src');
    var rate = +$('.rate-change span').text();
    addBook(author, title, price, img, rate);
}


function readAndUpdateBook(bookId) {
    var book = getBookById(bookId);
    var popStr = `
    <div class="box small-6 large-centered">
        <a onclick="closePopup()" class="close-button">&#10006;</a>
        <h3>Book Update</h3>
        <div class="main-pop">
            <div class="img-upload">
                <label class="btn upload-label" for="image_uploads" style="display: none">Choose images to upload</label>
                <input id="image_uploads" type="file" onchange="previewFile()" accept="image/*" style="opacity:0"><br>
                <img class="small-img" src="${book.img}" height="115px" width="83px" onerror="onImgMissing()">
            </div>
            <div class="info-container">
                <div class="pop-title">Book Title: ${book.title}</div>
                <div class="pop-author">Author: ${book.author}</div>
                <div class="pop-price">Price: 
                    <input class="pop-new-price" type="text" value="${book.price}" placeholder="${book.price}" size="4">
                </div>
                <div class="pop-rate">Rate: 
                    <div class="rate-change">
                        <a onclick="onRateChange(-1, '${book.id}')">-</a> 
                        <span>${book.rate}</span> 
                        <a onclick="onRateChange(1, '${book.id}')">+</a>
                    </div>
                </div>
                <a onclick="updatePrice('${book.id}')" class="button1">Update</a>
            </div>
        </div>
    </div>`
    var $model = $('.pop-up');
    $model.html(popStr);
    $model.show();
}

function updatePrice(bookId) {
    var $model = $('.pop-up');
    $model.hide();
    var book = getBookById(bookId);
    var newPrice = $('.pop-new-price').val();
    book.price = newPrice;
    updateBook(bookId, newPrice);
    var pageIdx = getCurrPageIdx();
    renderBooks(pageIdx);
}

function onNextPage() {
    nextPage();
    var pageIdx = getCurrPageIdx();
    renderBooks(pageIdx);
}

function selectPage(pageId) {
    setCurrPageIdx(pageId);
    renderBooks(pageId);
}

function onPrevPage() {
    prevPage();
    var pageIdx = getCurrPageIdx();
    renderBooks(pageIdx);
}

function closePopup() {
    $(".pop-up").hide();
}

function handleView(view) {
    setView(view);
    $('.view-table').toggleClass('active');
    $('.view-shelf').toggleClass('active');
    var pageIdx = getCurrPageIdx();
    renderBooks(pageIdx);
}

function onFilterChange(filterByTxt) {
    orderBy(filterByTxt);
}

function previewFile() {
    var preview = document.querySelector('img');
    var file    = $('input[type=file]').attr('files').files[0];
    var reader  = new FileReader();
    
    reader.addEventListener("load", function () {
        preview.src = reader.result;
    }, false);
    
    if (file) {
      reader.readAsDataURL(file);
    }
  }