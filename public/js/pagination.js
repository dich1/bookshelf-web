const PER_PAGE_LIMIT = 20;
var currentPage;

/**
 * ページネーションを設定する
 * @param {number} status  本ステータス
 * @param {number} total   本総数
 * @param {string} keyword 検索文字列
 */
function setPagination(status, total, keyword) {
    var pages = Math.ceil(total / PER_PAGE_LIMIT);
    $('#paging').pagination({
        items      : pages,
        itemOnPage : PER_PAGE_LIMIT,
        currentPage: currentPage,
        cssStyle   : 'dark-theme',
        prevText   : '<span aria-hidden="true">&laquo;</span>',
        nextText   : '<span aria-hidden="true">&raquo;</span>',
        onPageClick: function (page, evt) {
            showTargetBooks(status, page, keyword);
        }
    });
    if (total > PER_PAGE_LIMIT) {
        $('#paging').show();
    } else {
        $('#paging').hide();
    }
}

/**
 * 該当の本一覧を表示する
 * @param {number} status  本ステータス
 * @param {number} page    ページ数
 * @param {string} keyword 検索文字列
 */
function showTargetBooks(status, page, keyword){
    var pageId = '#page-' + page;
    $(pageId).show();
    currentPage = page;
    getBooks(status, page, keyword);
}