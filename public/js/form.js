function registerBook(button) {
    var endpointName = '本登録API'
    var title = document.forms.register_book.book_title.value;
    if (title.length === 0) {
        alert('タイトルを入力してください');
        return;
    }
    if (document.forms.register_book.book_image.files.length === 0) {
        alert('画像を添付してください');
        return;
    }
    var imageFile = document.forms.register_book.book_image.files[0];
    var extension = imageFile.name.split('.')[imageFile.name.split('.').length - 1];
    var acceptExtensions = ['jpg', 'jpeg', 'gif', 'png'];
    if (acceptExtensions.indexOf(extension) === -1) {
        alert(acceptExtensions.join(', ') + 'の拡張子で添付してください');
        return;
    }
    var selectIndex = document.forms.register_book.book_status.selectedIndex;
    var status = document.forms.register_book.book_status.options[selectIndex].value;;
    var request = new FormData();
    request.append('title', title);
    request.append('image', imageFile, imageFile.name);
    request.append('status', status);

    var registerBook = Api.registerBook(request);
    registerBook.done(function(data){
        console.log(endpointName + '：' + registerBook.status);
        alert('本を登録しました。');
        location.href = './index.html' + '?' + (new Date()).getTime();
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

// FIXME 本更新APIテスト用(本詳細画面作成時に使用)
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
