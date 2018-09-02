function retryable(retryCount, func) {
    let promise = Promise.reject().catch(() => func());
    for (let i = 0; i < retryCount; i++) {
      promise = promise.catch(err => func());
    }

    return promise;
}

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
            getBooks(null, null);
            getBooksCount();
        }).catch(err => {
            alert('API通信失敗。通信状態の確認、またはしばらく経ってからアクセスしてください');
         });
    }, 1000);
});

function getBooksCount() {
    var endpointName = 'ステータス数取得API';
    var getBooksCount = Api.getBooksCount();
    var readingCount;
    var safekeepingCount;
    getBooksCount.done(function(data){
        console.log(endpointName + '：' + getBooksCount.status);
        readingCount     = data.reading;
        safekeepingCount = data.safekeeping;
        document.getElementById('books_reading').textContent = readingCount;
        document.getElementById('books_safekeeping').textContent = safekeepingCount;
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

function getBooks(status, page) {
    var endpointName = '本一覧取得API';
    var request = {};
    if (status !== null) {
        request['status'] = status;
    }
    if (page !== null) {
        request['page']   = page;
    }
    var getBooks = Api.getBooks(request);
    var books;
    getBooks.done(function(data){
        console.log(endpointName +  '：' + getBooks.status);
        books   = data.books;
        records = data.records;
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
    console.log(books);
    
    var bookListElement = createBooksElements(books);
    displayBooks(bookListElement);
    setPagination(status, records);
}

function createBooksElements(books) {
    var bookListElement = '';
    var imageBasePath = '//s3-ap-northeast-1.amazonaws.com/bookshelf-image/uploads/';
    if (books.length > 0) {
        books.forEach(function (book) {
            var id          = book.id;
            var title       = book.title;
            var image       = imageBasePath + book.image;
            var status      = book.status;
            var return_date = (status !== 1)     ? ''                   :
                              (book.return_date) ? book.return_date     : '返却日未定';
            var reading     = (status === 1)     ? 'reading active'     : 'reading';
            var safekeeping = (status === 2)     ? 'safekeeping active' : 'safekeeping';

            var datepickerElement = (status === 1) ? '<div class="set_datepicker_reading">' : '<div class="set_datepicker">';
            var bookItemElement = '<div id="' + id + '" class="book_item">'
                                + '<form class="form_datepicker" name="update_return_date" action="">'
                                + '<small class="return_date_title">返却予定日</small>'
                                + datepickerElement
                                + '<input class="datepicker" type="text" name="book_return_date" value="' + return_date + '" readonly="readonly">' 
                                + '</div>'
                                + '</form>' 
                                + '<div class="book_image"><img src="' + image + '" alt=""></div>'
                                + '<div class="book_detail"><div class="book_title">' + title + '</div>'
                                + '<form name="update_status" action="">' 
                                + '<div class="book_status ' + reading + '"><input type="button" name="book_reading" value="貸出中" onclick="openDatepicker(' + id + ');"></div>'
                                + '<div class="book_status ' + safekeeping + '"><input type="button" name="book_safekeeping" value="保管中" onclick="updateBookSafekeeping(' + id + ');updateReturnDate(' + id + ', &#39;&#39;)"></div>'
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

function displayBooks(bookListElement) {
    var bookList = document.getElementById('book_list');
    bookList.textContent = null;
    console.log(bookList);
    bookList.insertAdjacentHTML('afterbegin', bookListElement);
    setDatepicker();
}

function updateBookPetition(id) {
    var endpointName = '申請中更新API'
    var dateText = '';
    updateReturnDate(id, dateText);
    var request = {
        id    : id
    };
    var updateBookPetition = Api.updateBookPetition(request);
    updateBookPetition.done(function(data){
        console.log(endpointName + '：' + updateBookPetition.status);
        getBooks(null);
        getBooksCount();
        postMessageSlack(id, 0);
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

function updateBookReading(id) {
    var endpointName = '貸出中更新API';
    var request = {
        id    : id
    };
    var updateBookReading = Api.updateBookReading(request);
    updateBookReading.done(function(data){
        console.log(endpointName + '：' + updateBookReading.status);
        getBooks(null);
        getBooksCount();
        displayAlert('本を借りました。');
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });    
}

function updateBookSafekeeping(id) {
    var endpointName = '保管中更新API';
    var request = {
        id    : id
    };
    var updateBookSafekeeping = Api.updateBookSafekeeping(request);
    var dateText = getNowYYYYMMDD();
    postMessageSlack(id, 2, dateText);
    updateBookSafekeeping.done(function(data){
        console.log(endpointName + '：' + updateBookSafekeeping.status);
        getBooks(null);
        getBooksCount();
        var dateNoneText = '';
        updateReturnDate(id, dateNoneText);
        displayAlert('本を返却しました。');
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });    
}

function deleteBook(id) {
    var endpointName = '本削除API';
    var request = {
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
        getBooksCount();
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

function updateReturnDate(id, dateText){
    var endpointName = '返却日更新API';
    var returnDate = dateText;
    var request = {
        id        : id,
        returnDate: returnDate
    };
    var updateReturnDate = Api.updateReturnDate(request);
    updateReturnDate.done(function(data){
        console.log(endpointName + '：' + updateReturnDate.status);
        getBooks(null);
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

// FIXME railsにしたらサーバー側に実装する(内部にしかURLは公開していない)
function postMessageSlack(id, status, date) {
    var endpointName = 'slack投稿API';
    var bookName = document.getElementById(id).children[2].innerText.replace(/\r?\n/g, "");
    var sendText   = (status === 1) ? '【借入】\n書籍　　　:' + bookName + '\n返却予定日:' + date : 
                     (status === 2) ? '【返却】\n書籍　　　:' + bookName + '\n返却日　　:' + date : '';
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