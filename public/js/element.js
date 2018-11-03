/**
 * 本一覧要素を作成する
 * @param  {Object} books 本一覧オブジェクト
 * @return {string} 本一覧HTML要素
 */
function createBooksElements(books) {
    var bookListElement = '';
    if (books.length <= 0) {
        return '<h1 id="no_books" >本ありません</h1>'
    }
    books.forEach(function (book) {
        var id                  = book.id;
        var title               = book.title;
        var image               = book.image;
        var status              = book.status;
        var return_scheduled_on = (status !== 1)             ? ''                       :
                                  (book.return_scheduled_on) ? book.return_scheduled_on : '返却日未定';
        var reading     = (status === 1) ? 'reading active'     : 'reading';
        var safekeeping = (status === 0) ? 'safekeeping active' : 'safekeeping';

        var datepickerElement  = (status === 1) ? '<div class="set_datepicker_reading">' : '<div class="set_datepicker">';
        var readingElement     = (sessionStorage.getItem('user_id')) ? '<div class="book_status ' + reading + '"><input type="button" name="book_reading" value="貸出中" onclick="openDatepicker(' + id + ');"></div>'
                                                                     : '<div class="book_status ' + reading + ' logout"><span data-logout="ログインしてください" class="logout_text"><input type="button" name="book_reading" value="貸出中"></span></div>';
        var safekeepingElement = (sessionStorage.getItem('user_id')) ? '<div class="book_status ' + safekeeping + '"><input type="button" name="book_safekeeping" value="保管中" onclick="updateBookSafekeeping(' + id + ');"></div>'
                                                                     : '<div class="book_status ' + safekeeping + ' logout"><span data-logout="ログインしてください" class="logout_text"><input type="button" name="book_safekeeping" value="保管中"></span></div>'
        var bookItemElement = '<div id="' + id + '" class="book_item">'
                            + '<form class="form_datepicker" name="update_return_date" action="">'
                            + '<small class="return_date_title">返却予定日</small>'
                            + datepickerElement
                            + '<input class="datepicker" type="text" name="book_return_date" value="' + return_scheduled_on + '" readonly="readonly">'
                            + '</div>'
                            + '</form>'
                            + '<div class="book_image"><img src="' + image + '" alt=""></div>'
                            + '<div class="book_detail"><div class="book_title">' + title + '</div>'
                            + '<form name="update_status" action="">'
                            + readingElement
                            + safekeepingElement
                            + '</form>'
                            + '<form name="delete_book" action="">'
                            + '<div class="book_delete">'
                            + '<input type="button" name="submit_book_delete" value="削除する" onclick="deleteBook(' + id + ');"><img src="./images/icon_trash.png" alt="icon trash"></div>'
                            + '</form>'
                            + '</div></div>';
        bookListElement += bookItemElement;
    });
    return bookListElement;
}

/**
 * 保存してない本一覧要素を作成する
 * @param  {Object} books 本一覧オブジェクト
 * @return {string} 本一覧HTML要素
 */
function createUnsavedBooksElements(books) {
    var bookListElement = '';
    if (books.totalItems <= 0) {
        return '<h1 id="no_books" >本ありません</h1>';
    }
    books.items.forEach(function (book) {
        var title = book.volumeInfo.title;
        if (!book.volumeInfo.imageLinks) {
            return;
        }
        var image = book.volumeInfo.imageLinks.thumbnail;
        var bookItemElement = '<div class="book_item">'
                            + '<div class="book_image"><img src="' + image + '" alt=""></div>'
                            + '<div class="book_detail"><div class="book_title">' + title + '</div>'
                            + '</div></div>';
        bookListElement += bookItemElement;
    });
    return bookListElement;
}

/**
 * 本一覧を表示する
 * @param {string} bookListElement 本一覧要素
 */
function displayBooks(bookListElement) {
    var bookList = document.getElementById('book_list');
    bookList.textContent = null;
    console.log(bookList);
    bookList.insertAdjacentHTML('afterbegin', bookListElement);
    if (location.pathname !== '/index.html') {
        return;
    }
    setDatepicker();
}