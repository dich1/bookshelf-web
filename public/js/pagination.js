const PER_PAGE_LIMIT = 20;
var currentPage;

function setPagination(status, records) {
    var pages = Math.ceil(records / PER_PAGE_LIMIT);
    $('#paging').pagination({
        items      : pages,
        itemOnPage : PER_PAGE_LIMIT,
        currentPage: currentPage,
        cssStyle   : 'dark-theme',
        prevText   : '<span aria-hidden="true">&laquo;</span>',
        nextText   : '<span aria-hidden="true">&raquo;</span>',
        onPageClick: function (page, evt) {
            showTargetBooks(status, page);
        }
    });
    if (records > PER_PAGE_LIMIT) {
        $('#paging').show();
    } else {
        $('#paging').hide();
    }
}

function showTargetBooks(status, page){
    var pageId = '#page-' + page;
    $(pageId).show();
    currentPage = page;
    getBooks(status, page);
}