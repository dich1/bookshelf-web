/**
 * 本を登録する
 * @param {Object} button thisのイベント
 */
function registerBook(button) {
    var request = new Object;
    var searchNumber = document.forms.register_book.book_isbn.value;
    request.book = searchBook(searchNumber);
    excecuteRegister(request);
}

$(document).on('click', '.book_image', function(event){
    if (!confirm('登録しますか ?')) {
        return;
    };
    var title = event.currentTarget.parentNode.textContent;
    var image = event.currentTarget.parentNode.childNodes[0].childNodes[0].src;
    var request = new Object;
    request.book = {title : title, image : image};
    excecuteRegister(request);
});

/**
 * 登録を実行する
 * @param {Object} request リクエストパラメータ
 */
function excecuteRegister(request) {
    var endpointName = '本登録API'
    var registerBook = Api.registerBook(request);
    registerBook.done(function(data){
        console.log(endpointName + '：' + registerBook.status);
        console.log(data);
        alert('本を登録しました。');
        location.href = './index.html' + '?' + (new Date()).getTime();
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

/**
 * 本を検索する
 * @return {Object} タイトル、画像URL
 */
function searchBook(searchValue) {
    var endpointName = '書籍検索API'
    var title;
    var image;
    var request = (isISBN(searchValue)) ? 'isbn:' + searchValue.slice(0, 13) : 'intitle:' + searchValue;
    var searchBook = Api.searchBook(request);
    searchBook.done(function(data){
        console.log(endpointName + '：' + searchBook.status);
        console.log(data);
        var bookListElement = createUnsavedBooksElements(data);
        displayBooks(bookListElement);
        title = data.items[0].volumeInfo.title;
        image = data.items[0].volumeInfo.imageLinks.thumbnail;
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
    return {title : title, image : image};
}

/**
 * ISBN判定
 * @param  {String}  検索値
 * @return {Boolean} true:ISBN検索 false:タイトル検索
 */
function isISBN(searchValue) {
    return (isFinite(searchValue) && searchValue.length >= 13);
}

/**
 * FIXME 本更新APIテスト用(本更新時に使用)
 *
 * 本を更新する
 * @param {Object} button thisのイベント
 */
function updateBook(button) {
    var id    = 0;
    var title = '更新タイトル';
    var image = '更新画像';
    var status = '更新状態';
    var request = {
        id    : id,
        title : title,
        image : image,
        status: status
    };
    var updateBook = Api.updateBook(request);
    updateBook.done(function(data){
        console.log(updateBook.status);
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}
