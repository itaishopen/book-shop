function init() {
    gBooks = createBooks();
    // var langParam = getParamFromURL('lang');
    // if (langParam) {
    //     onLangSet(langParam);
    //     $('.langSelector').val(langParam);
    // }
    var pageIdx = getCurrPageIdx();
    renderBooks(pageIdx);
    pageTranslation();
}

function pageTranslation() {
    $('[data-trans]').each(function (key, value) {
        var tran = $(value).attr('data-trans');
        $(value).text(getTrans(tran));
    });
}

function holderTranslation() {
    $('[data-trans-holder]').each(function (key, value) {
        var tran = $(value).attr('data-trans-holder');
        $(value).attr("placeholder", getTrans(tran));
    });
}

function onLangSet(lang) {
    setLang(lang);
    if (lang === 'he') {
        $('body').addClass('rtl');
    } else {
        $('body').removeClass('rtl');
    }
    var pageIdx = getCurrPageIdx();
    renderBooks(pageIdx);
    pageTranslation();
}

function renderBooks(pageIdx) {
    sortGBooks();
    var books = getBooksForDisply(pageIdx);
    if (getGView() === 'shelf') {
        renderShelf(books);
    } else {
        renderTable(books);
    }
    var leftArrow = '&laquo;';
    var rightArrow = '&raquo;';
    if ($('body').hasClass('rtl')) {
        leftArrow = '&raquo;';
        rightArrow = '&laquo;';
    }
    var pageNumbersStr = `<a onclick="onPageChange(-1)">${leftArrow}</a>`;
    for (var j = 0; j < getTotalPages(); j++) {
        pageNumbersStr += `<a id="page-${j + 1}" onclick="selectPage(${j})">${j + 1}</a>`;
    }
    pageNumbersStr += `<a onclick="onPageChange(1)">${rightArrow}</a>`;
    $('.pagination').html(pageNumbersStr);
    $(`#page-${+pageIdx + 1}`).addClass('active');
    pageTranslation();
    saveToLocalStorage(BOOKS_KEY, getGBooks());
}

function renderShelf(books) {
    var counter = 1;
    var strHtmls = books.map(function (book) {
        var currCounter = counter++;
        return `
        <div class="card book book-item${currCounter}">
        <img class="card-img-top" src="${book.img}" onclick="onReadBook('${book.id}')" 
        onerror="imgSolver('${book.title}','${book.author}', 'book-item${currCounter}')">
        <div class="btn delete-btn" onclick="confirmDelete('${book.id}')">&#10006;</div>
            <div class = "img-info" onclick="onReadBook('${book.id}')">
                <div class = "img-title"></div>
                <div class = "img-Author"></div>
            </div>
            <div class="lower">
                <div class="card-Price"><span data-trans="PRICE">Book Price</span>: ${book.price}</div>
                <div class="lower-btn">
                    <div class="btn btn-update shelf-update" onclick="readAndUpdateBook('${book.id}')" data-trans="UPDATE">Update</div>
                </div>
            </div>
        </div> 
        `
    });
    strRow1 = '';
    strRow2 = '';
    for (var i = 0; i < strHtmls.length; i++) {
        if (i < 3) strRow1 += strHtmls[i];
        else strRow2 += strHtmls[i];
    }
    $('.row-1 .loc').html(strRow1);
    $('.row-2 .loc').html(strRow2);
    $('table').hide();
    $(`.book-${getSortBy()}`).addClass('active');
    $('.shelf').show();
    $('.order-by-selector').show();
}

function renderTable(books) {
    var strHtmls = books.map(function (book) {
        return `
        <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.price}</td>
            <td>
                <button class="btn btn-read" onclick="onReadBook('${book.id}')" data-trans="READ">Read</button>
            </td>
            <td>
                <button class="btn btn-update" onclick="readAndUpdateBook('${book.id}')" data-trans="UPDATE">Update</button>
            </td>
            <td>
                <button class="btn btn-delete" onclick="confirmDelete('${book.id}')" data-trans="DELETE">Delete</button>
            </td>
        </tr>
        `
    });
    $('tbody').html(strHtmls.join(''));
    $('table').show();
    $('.order-by-selector').hide();
    $('.shelf').hide();
}

function imgSolver(title, author, className) {
    $(`.${className} img`).hide();
    $(`.${className} .img-info .img-title`).text(title);
    $(`.${className} .img-info .img-Author`).text(author);
}

function onReadBook(bookId) {
    var book = getBookById(bookId);
    var bookPrice = transPrice(book.price);
    var popStr = `
    <div class="box small-6 large-centered">
    <a onclick="closePopup()" class="close-button">&#10006;</a>
        <h3 data-trans="BOOK_DETAILS">Book Details</h3>
        <div class="main-pop">
            <div class="img-upload">
                <label class="btn upload-label" for="image_uploads" style="display: none" data-trans="CHOOSE">Upload an image</label>
                <input id="image_uploads" type="file" onchange="onFileLoad()" accept="image/*" style="opacity:0"><br>
                <img class="small-img" src="${book.img}" height="115px" width="83px" onerror="onImgMissing()">
            </div>
            <div class="info-container">
                <div class="pop-title" ><span data-trans="TITLE">Book Title</span>: ${book.title}</div>
                <div class="pop-author"><span data-trans="AUTHOR">Author</span>: ${book.author}</div>
                <div class="pop-price"><span data-trans="PRICE">Book Price</span>: ${bookPrice}</div>
                <div class="pop-rate"><span data-trans="RATE">Rate</span>: 
                    <div class="rate-change">
                        <a onclick="onRateChange(-1, '${book.id}')">-</a> 
                        <span>${book.rate}</span> 
                        <a onclick="onRateChange(1, '${book.id}')">+</a>
                    </div>
                </div>
                <a onclick="updateImg('${book.id}')" class="btn button1" style="display: none" data-trans="UPDATE">Update</a>
            </div>
        </div>
    </div>`;
    var $model = $('.pop-up');
    $model.html(popStr);
    pageTranslation();
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
    $('.button1').show();
}

function onPageChange(num) {
    var pageId = getCurrPageIdx() + num;
    if (pageId < getTotalPages() && pageId >= 0) {
        setCurrPageIdx(pageId);
    }
}

function onRateChange(num, bookId) {
    var book = getBookById(bookId);
    book.rate += +num;
    var rate = book.rate;
    if (rate < 10 && rate >= 0) $('.rate-change span').text(rate);
    else { book.rate -= +num; }
    saveToLocalStorage(BOOKS_KEY, getGBooks());
}

function addRateChange(num) {
    var rate = +$('.rate-change span').text();
    rate += +num;
    if (rate <= 10 && rate >= 0) $('.pop-rate span').text(rate);
}

function confirmDelete(bookId) {
    var book = getBookById(bookId);
    var popStr = `
    <div class="box small-6 large-centered">
        <a onclick="closePopup()" class="close-button">&#10006;</a>
        <h3 data-trans="BOOK_DELETE">Confirm Action</h3>
        <div class="main-pop">
            <div class="img-upload">
                <label class="btn upload-label" for="image_uploads" style="display: none" data-trans="CHOOSE">Upload an image</label>
                <input id="image_uploads" type="file" onchange="onFileLoad()" accept="image/*" style="opacity:0"><br>
                <img class="small-img" src="${book.img}" height="115px" width="83px" onerror="onImgMissing()">
            </div>
            <div class="info-container">
                <div><span data-trans="CONFIRM">Are you sure you want to delete the book</span>: <br>
                ${book.title} <br> 
                <span data-trans="BY">by</span>: ${book.author}</div>
                <div class="confirm-btns">
                    <a onclick="onDeleteBook('${book.id}')" class="btn button1" data-trans="YES">Yes</a>
                    <a onclick="closePopup()" class="btn button1" data-trans="NO">No</a>
                </div>
            </div>
        </div>
    </div>`;
    var $model = $('.pop-up');
    $model.html(popStr);
    holderTranslation();
    pageTranslation();
    $model.show();
}

function onDeleteBook(bookId) {
        deletebook(bookId);
        var pageIdx = getCurrPageIdx();
        renderBooks(pageIdx);
}

function readAndAddNewBook() {
    var popStr = `
    <div class="box small-6 large-centered">
        <a onclick="closePopup()" class="close-button">&#10006;</a>
        <h3 data-trans="BOOK_UPDATE">Book Update</h3>
        <div class="main-pop">
            <div class="img-upload">
                <label class="btn upload-label" for="image_uploads" style="display: none" data-trans="CHOOSE">Upload an image</label>
                <input id="image_uploads" type="file" onchange="onFileLoad()" accept="image/*" style="opacity:0"><br>
                <img class="small-img" src="" height="115px" width="83px" onerror="onImgMissing()">
            </div>
            <div class="info-container">
                <div class="pop-title" ><span data-trans="TITLE">Book Title</span>:
                <input class="pop-new-title" type="text" value="" data-trans-holder="TITLE" placeholder="Book Title"></div>
                <div class="pop-author"><span data-trans="AUTHOR">Author</span>:
                <input class="pop-new-author" type="text" value="" data-trans-holder="AUTHOR" placeholder="Author"></div>
                <div class="pop-price"><span data-trans="PRICE">Book Price</span>: 
                    <input class="pop-new-price" type="text" value="" placeholder="${transPrice(0)}" >
                </div>
                    <div class="pop-rate"><span data-trans="RATE">Rate</span>: 
                        <div class="rate-change">
                            <a onclick="addRateChange(-1)">-</a> 
                            <span>0</span> 
                            <a onclick="addRateChange(1)">+</a>
                        </div>
                    </div>
                <a onclick="addNewBook()" class="button1" data-trans="ADD">Add</a>
            </div>
        </div>
    </div>`;
    var $model = $('.pop-up');
    $model.html(popStr);
    holderTranslation();
    pageTranslation();
    $model.show();
}

function addNewBook() {
    closePopup();
    var author = $('.pop-new-author').val();
    var title = $('.pop-new-title').val();
    var price = $('.pop-new-price').val();
    var img = $('img').attr('src');
    var rate = +$('.rate-change span').text();
    addBook(author, title, price, img, rate);
}


function readAndUpdateBook(bookId) {
    var book = getBookById(bookId);
    var bookPrice = transPrice(book.price);
    var popStr = `
    <div class="box small-6 large-centered">
        <a onclick="closePopup()" class="close-button">&#10006;</a>
        <h3 data-trans="BOOK_UPDATE">Book Update</h3>
        <div class="main-pop">
            <div class="img-upload">
                <label class="btn upload-label" for="image_uploads" style="display: none">Choose images to upload</label>
                <input id="image_uploads" type="file" onchange="onFileLoad()" accept="image/*" style="opacity:0"><br>
                <img class="small-img" src="${book.img}" height="115px" width="83px" onerror="onImgMissing()">
            </div>
            <div class="info-container">
                <div class="pop-title" ><span data-trans="TITLE">Book Title</span>: ${book.title}</div>
                <div class="pop-author"><span data-trans="AUTHOR">Author</span>: ${book.author}</div>
                <div class="pop-price"><span data-trans="PRICE">Book Price</span>: 
                    <input class="pop-new-price" type="number" name="digit" value="${bookPrice}" placeholder="${bookPrice}" size="4">
                </div>
                <div class="pop-rate"><span data-trans="RATE">Rate</span>: 
                    <div class="rate-change">
                        <a onclick="onRateChange(-1, '${book.id}')">-</a> 
                        <span>${book.rate}</span> 
                        <a onclick="onRateChange(1, '${book.id}')">+</a>
                    </div>
                </div>
                <a onclick="updatePrice('${book.id}')" class="button1" data-trans="UPDATE">Update</a>
            </div>
        </div>
    </div>`;
    var $model = $('.pop-up');
    $model.html(popStr);
    pageTranslation();
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
    setNextPage();
    var pageIdx = getCurrPageIdx();
    renderBooks(pageIdx);
}

function selectPage(pageId) {
    setCurrPageIdx(pageId);
    renderBooks(pageId);
}

function onPrevPage() {
    setPrevPage();
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
    pageTranslation();
}

function onFilterChange(filterByTxt) {
    $(`.book-${getSortBy()}`).removeClass('active');
    $(`.book-${filterByTxt}`).addClass('active');
    orderBy(filterByTxt);
}

function onFileLoad() {
    var $img = $('.small-img');
    var $elFile = $('#image_uploads');
    var file = $elFile[0].files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function () {
        $img.attr('src', reader.result);
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

function getUrl() {
    return window.location.href
}