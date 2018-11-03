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
    getUser();
    setTimeout(function(){
        retryable(3, () => {
            getBooks(null, null, null);
        }).catch(err => {
            alert('API通信失敗。通信状態の確認、またはしばらく経ってからアクセスしてください');
         });
    }, 1000);
});

/**
 * ログアウト
 */
function logout() {
    var storage = sessionStorage;
    storage.removeItem('user_id');
    storage.removeItem('user_name');
    storage.removeItem('user_image');
}

/**
 * 本の数を設定する
 * @param {number} readings     読書中(貸出中)
 * @param {number} safekeepings 保管中
 */
function setBooksCount(readings, safekeepings) {
    document.getElementById('books_reading').textContent = readings;
    document.getElementById('books_safekeeping').textContent = safekeepings;
}

/**
 * ユーザー情報を取得する
 * @return {Object} ユーザー情報
 */
function getUser() {
    var storage = sessionStorage;
    if (storage.getItem('user_id')) {
        setUser(storage.getItem('user_name'), storage.getItem('user_image'));
        return;
    }
    var endpointName = 'ユーザー取得API';
    var getUser = Api.getUser();
    getUser.done(function(data){
        console.log(endpointName + '：' + getUser.status);
        setUser(data.user_name, data.user_image);
        storage.setItem('user_id', data.user_id);
        storage.setItem('user_name', data.user_name);
        storage.setItem('user_image', data.user_image);
        displayAlert('ログインしました。');
    }).fail(function(data, textStatus, errorThrown) {
        displayAlert('借りるにはログインが必要です。');
    });    
}

/**
 * ユーザー情報を設定する
 * @param {Object} user ユーザー情報
 */
function setUser(userName, userImage) {
    var userElement = document.getElementById('user');
    var userMenuElement = '<a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="" alt="" >' + userName + '</a>'
                        + '<span class="dropdown-menu" aria-labelledby="dropdownMenuLink">'
                        + '<a class="dropdown-item" href="/users/edit">設定変更</a>'
                        + '<a class="dropdown-item" href="/users/sign_out" onclick="logout();">ログアウト</a>'
                        + '</span>';
    //TODO スタイルを調整し適用
    // var userElement = '<img src="' + userImage  + '" alt="" >' + userName;
    userElement.innerHTML = userMenuElement;
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
        user_id            : parseInt(sessionStorage.getItem('user_id')),
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
        user_id: parseInt(sessionStorage.getItem('user_id'))
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
        user_id            : parseInt(sessionStorage.getItem('user_id')),
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
    var userName = sessionStorage.getItem('user_name');
    return '【' + statusText + '】\n氏名　　　:' + userName + '\n書籍　　　:' + bookName + '\n返却予定日:' + date;
}

/**
 * 保管中用送信文言を作成する
 * @param {Number} id 本ID
 * @param {String} date 日付
 */
function createSafekeepingSendText(id, date) {
    var bookName = getBookName(id);
    var userName = sessionStorage.getItem('user_name');
    return '【返却】\n氏名　　　:' + userName + '\n書籍　　　:' + bookName + '\n返却日　　:' + date;
}