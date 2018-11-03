/**
 * 本を登録する
 * @param {Object} button thisのイベント
 */
function registerBook(button) {
    var endpointName = '本登録API'
    var request = new Object;
    request.book = searchISBN();

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
 * ISBN検索する
 * @return {Object} タイトル、画像URL
 */
function searchISBN() {
    var endpointName = 'ISBN検索API'
    var title;
    var image;
    var searchNumber = document.forms.register_book.book_isbn.value;
    var isbn = searchNumber.slice(0, 13);
    var searchISBN = Api.searchISBN(isbn);
    searchISBN.done(function(data){
        console.log(endpointName + '：' + searchISBN.status);
        console.log(data);
        if (data.totalItems === 0) {
            alert('書籍がみつかりませんでした。');
            return;
        }
        title = data.items[0].volumeInfo.title;
        image = data.items[0].volumeInfo.imageLinks.thumbnail;
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
    return {title : title, image : image};
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
