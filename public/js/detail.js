const DEFAULT_DETAIL_PAGES = 6;

$(document).on('click', '.book_image', function(event){
    var bookId = event.currentTarget.parentNode.id;
    getBookDetail(bookId);
});

$('#overlay').click(function(event){
    $('#overlay, #book_detail').fadeOut();
});

$(document).on('focus', '.memo', function(){
    $('#book_detail').booklet('option', 'keyboard', false);
});

/**
 * 本詳細(メモ)を取得する
 * 本に紐づくメモを取得する。表記を修正している
 * @param {number} id 本ID
 */
function getBookDetail(id) {
    var endpointName = '本詳細取得API';
    var request = {
        id   : id,
    };
    var getBookDetail = Api.getBookDetail(request);
    var memo;
    getBookDetail.done(function(data){
        console.log(endpointName + '：' + getBookDetail.status);
        memo = data.memo;
    }).fail(function(data, textStatus, errorThrown) {
        if (data.status !== 404) {
            displayResponseError(endpointName, data, textStatus, errorThrown);
        }
        memo = null;
    });

    displayBookDetail(id, memo);
}

/**
 * 本詳細(メモ)を表示する
 * @param {number} id   本ID
 * @param {string} memo メモ要素文字列
 */
function displayBookDetail(id, memo) {
    $('#overlay, #book_detail').fadeIn();
    var bookDetailElement = createBookDetailElement(id, memo);
    var bookDetail = document.getElementById('book_detail');
    bookDetail.textContent = null;
    console.log(bookDetail);
    bookDetail.insertAdjacentHTML('afterbegin', bookDetailElement);
    setBooklet();
}

/**
 * 本詳細(メモ)を更新する
 * @param {number} id   本ID
 */
function updateBookDetail(id) {
    var endpointName = '本詳細更新API';

    var text = [];
    var memoElements = document.getElementsByClassName(id);
    for (var i = 0; i < memoElements.length; i++) {
        text[i] = memoElements[i].childNodes[0].value;
    }

    var memo = createBookDetailElement(id, text);
    console.log('本詳細エレメント' + memo);

    var storage = sessionStorage;
    var sessionElements = storage.getItem('memo');
    if (storage.getItem('memo')) {
        if (memo === sessionElements) {
            return;
        }
    }
    sessionStorage.setItem('memo', memo);

    var request = {
        id   : id,
        memo : memo
    };
    var updateBookDetail = Api.updateBookDetail(request);
    updateBookDetail.done(function(data){
        console.log(endpointName + '：' + updateBookDetail.status);
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

/**
 * 本詳細(メモ)要素を作成する
 * @param  {number} id   本ID
 * @param  {string} text メモ文字列
 * @return {string} メモ要素文字列
 */
function createBookDetailElement(id, text) {
    // TODO 動的にページを増やせるようにする
    var bookDetailElement = '';
    if (text === null || Array.isArray(text)) {
        var pages = (text === null) ? DEFAULT_DETAIL_PAGES : text.length;
        for (var i = 0; i < pages; i++) { 
            var detailPage    = '<div class="' + id + '" >';
            if (text === null) {
                detailPage += '<textarea class="memo" rows="21" cols="45" onblur="updateBookDetail(' + id + ');"></textarea>'; 
            } else {
                detailPage += '<textarea class="memo" rows="21" cols="45" onblur="updateBookDetail(' + id + ');">' + text[i] + '</textarea>';
            }
            detailPage += '</div>';
            bookDetailElement += detailPage;
        }

        return bookDetailElement;
    } 

    return bookDetailElement = text;
}

/**
 * 冊子を設定する
 */
function setBooklet() {
    $('#book_detail').booklet({
        name  : "BookDetail",
        width : 820,
        height: 580
    });
    locateCenter();
}

/**
 * 中心を見つける
 */
function locateCenter() {
    let w = $(window).width();
    let h = $(window).height();
    
    let cw = $('#book_detail').outerWidth();
    let ch = $('#book_detail').outerHeight();
   
    $('#book_detail').css({
        'left': ((w - cw) / 2) + 'px',
        'top': ((h - ch) / 2) + 'px'
    });
}