/**
 * 再試行を可能にする
 * @param  {number}   retryCount 再試行回数
 * @param  {function} func       関数
 * @return {Promise} 非同期通信結果
 */
function retryable(retryCount, func) {
    let promise = Promise.reject().catch(() => func());
    for (let i = 0; i < retryCount; i++) {
      promise = promise.catch(err => func());
    }

    return promise;
}

/**
 * 警告を表示する
 * @param {string} message メッセージ
 */
function displayAlert(message) {
    var coverElement = document.getElementById('cover');
    var alertElement = document.getElementById('alert');
    alertElement.textContent = message;
    className = 'alert alert-warning';
    alertElement.setAttribute('class', className);
    $('#alert').fadeIn(1000);
    setTimeout(function(){
        $('#alert').fadeOut(1000);
    }, 2000);
}

window.addEventListener('load', function() {
    setTimeout(function(){
        retryable(3, () => { 
            getBooks(null, null, null);
        }).catch(err => {
            alert('API通信失敗。通信状態の確認、またはしばらく経ってからアクセスしてください');
         });
    }, 1000);
});

$(document).ready(function() {
    $("#form_book_title").keyup(function() {
        var keyword = $(this).val();
        setTimeout(function(){
            getBooks(null, 1, keyword);
        }, 1000);
    });
});

/**
 * 本の数を取得する
 * @param {number} readings     読書中(貸出中)
 * @param {number} safekeepings 保管中
 */
function setBooksCount(readings, safekeepings) {
    document.getElementById('books_reading').textContent = readings;
    document.getElementById('books_safekeeping').textContent = safekeepings;
}

/**
 * 本一覧を取得する
 * @param {number} status  本ステータス
 * @param {number} page    ページ
 * @param {string} keyword 検索文字列
 */
function getBooks(status, page, keyword) {
    var endpointName = '本一覧取得API';
    var request = {};
    if (status !== null) {
        request['status'] = status;
    }
    if (page !== null) {
        request['page']   = page;
    }
    if (keyword !== null) {
        request['q']   = keyword;
    }
    var getBooks = Api.getBooks(request);
    var books;
    var total;
    getBooks.done(function(data){
        console.log(endpointName +  '：' + getBooks.status);
        books = data.books;
        total = data.total;
        setBooksCount(data.readings, data.safekeepings)
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
    console.log(books);
    
    var bookListElement = createBooksElements(books);
    displayBooks(bookListElement);
    setPagination(status, total, keyword);
}

/**
 * 本一覧を取得する
 * @param  {Object} books 本一覧レコード
 * @return {string} 本一覧HTML要素
 */
function createBooksElements(books) {
    var bookListElement = '';
    var environment = (location.hostname.match(/^bookshelf.tech$/)) ? 'production' : 'development';
    var imageBasePath = '//s3-ap-northeast-1.amazonaws.com/bookshelf-image/uploads/' + environment + '/';
    if (books.length > 0) {
        books.forEach(function (book) {
            var id                  = book.id;
            var title               = book.title;
            var image               = imageBasePath + book.image;
            var status              = book.status;
            var return_scheduled_on = (status !== 1)             ? ''                           :
                                      (book.return_scheduled_on) ? book.return_scheduled_on     : '返却日未定';
            var reading     = (status === 1)     ? 'reading active'     : 'reading';
            var safekeeping = (status === 0)     ? 'safekeeping active' : 'safekeeping';

            var datepickerElement = (status === 1) ? '<div class="set_datepicker_reading">' : '<div class="set_datepicker">';
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
                                + '<div class="book_status ' + reading + '"><input type="button" name="book_reading" value="貸出中" onclick="openDatepicker(' + id + ');"></div>'
                                + '<div class="book_status ' + safekeeping + '"><input type="button" name="book_safekeeping" value="保管中" onclick="updateBookSafekeeping(' + id + ');"></div>'
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

    return bookListElement = '<h1 id="no_books" >本ありません</h1>'
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
    setDatepicker();
}

/**
 * 本を読書中(貸出中)にする
 * 以前読書中と表現していた経緯
 * @param {number} id   本ID
 * @param {string} date 日付(YYYY-mm-dd)
 */
function updateBookReading(id, dateText) {
    var endpointName = '貸出中更新API';
    var request = new Object;
    request.lending = {
        book_id            : id,
        user_id            : 1,
        return_scheduled_on: dateText
    };
    var updateBookReading = Api.updateBookReading(request);
    updateBookReading.done(function(data){
        console.log(endpointName + '：' + updateBookReading.status);
        getBooks(null);
        displayAlert('本を借りました。');
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });    
}

/**
 * 本を保管中にする
 * @param {number} id 本ID
 */
function updateBookSafekeeping(id) {
    var endpointName = '保管中更新API';
    var request = new Object;
    request.lending = {
        book_id: id,
        user_id: 1
    };
    var updateBookSafekeeping = Api.updateBookSafekeeping(request);
    var dateText = getNowYYYYMMDD();
    var sendText = createSafekeepingSendText(id, dateText);
    postMessageSlack(id, sendText, dateText);
    updateBookSafekeeping.done(function(data){
        console.log(endpointName + '：' + updateBookSafekeeping.status);
        getBooks(null);
        displayAlert('本を返却しました。');
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });    
}

/**
 * 本を削除する
 * @param {number} id 本ID
 */
function deleteBook(id) {
    var endpointName = '本削除API';
    var request = new Object;
    request.book = {
        id    : id
    };
    if (!confirm('削除してもよろしいですか ?')) {
        return;
    };
    var deleteBook = Api.deleteBook(request);
    deleteBook.done(function(data){
        console.log(endpointName + '：' + deleteBook.status);
        // bookItem = document.getElementById(id);
        // bookItem.parentNode.removeChild(bookItem);
        getBooks(null);
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

/**
 * 返却(予定)日を更新する
 * @param {number} id 本ID
 * @param {string} dateText YYYY-mm-dd 
 */
function updateReturnDate(id, dateText){
    var endpointName = '返却日更新API';
    var returnDate = dateText;
    var request = new Object;
    request.lending = {
        book_id            : id,
        user_id            : 1,
        return_scheduled_on: returnDate
    };
    var updateReturnDate = Api.updateReturnDate(request);
    updateReturnDate.done(function(data){
        console.log(endpointName + '：' + updateReturnDate.status);
        getBooks(null);
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

/**
 * FIXME railsにしたらサーバー側に実装する(内部にしかURLは公開していない)
 *
 * slackにメッセージを投稿する
 * @param {number} id 本ID
 * @param {number} sendText 送信文言
 * @param {string} date   日付(YYYY-mm-dd)
 */
function postMessageSlack(id, sendText, date) {
    var endpointName = 'slack投稿API';
    var request = {
        text      : sendText,
        username  : 'お知らせ',
        channel   : '#book',
        icon_emoji: ':books:'
    };
    console.log(sendText);
    var postMessageSlack = Api.postMessageSlack(request);
    postMessageSlack.done(function(data){
        console.log(endpointName + '：' + postMessageSlack.status);
    }).fail(function(data, textStatus, errorThrown) {
        // TODO 送信は成功するがエラーで返ってしまう
        // displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

/**
 * 本の名前を取得する
 * @param {Number} id 本ID
 * @param {String} 本の名前
 */
function getBookName(id) {
    return document.getElementById(id).children[2].innerText.replace(/\r?\n/g, "");
}

/**
 * 読書中(貸出中)用送信文言を作成する
 * @param {Number} id 本ID
 * @param {String} statusText ステータス文言
 * @param {String} date 日付
 */
function createReadingSendText(id, statusText, date) {
    var bookName = getBookName(id);
    return '【' + statusText + '】\n書籍　　　:' + bookName + '\n返却予定日:' + date;
}

/**
 * 保管中用送信文言を作成する
 * @param {Number} id 本ID
 * @param {String} date 日付
 */
function createSafekeepingSendText(id, date) {
    var bookName = getBookName(id);
    return '【返却】\n書籍　　　:' + bookName + '\n返却日　　:' + date;
}