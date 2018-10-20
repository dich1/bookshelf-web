var Api = (function() {
    var protocol = location.protocol;
    var host     = location.hostname ;
    var port     = location.port;
    var apiPath = (port === '4567') ? ':4567/api/'   : '/api/';
    var baseUrl;
    if (protocol == 'file:') {
        baseUrl = '//localhost:4567/api/';
    } else {
        baseUrl  = protocol + '//' + host + apiPath;
    }

    /**
     * 本一覧取得API
     * @param  {Object} request リクエストパラメータ
     * @return {Object} レスポンスオブジェクト
     */
    function getBooks(request) {
        return $.ajax({
            type    : 'GET',
            url     : baseUrl + 'books/',
            dataType: 'json',
            data    : request,
            async   : false,
            timeout : 10000
        });
    }

    /**
     * 本詳細(メモ)取得API
     * @param  {Object} request リクエストパラメータ
     * @return {Object} レスポンスオブジェクト
     */
    function getBookDetail(request) {
        return $.ajax({
            type    : 'GET',
            url     : baseUrl + 'book/detail/',
            dataType: 'json',
            data    : request,
            async   : false,
            timeout : 10000
        });
    }

    /**
     * 本登録API
     * @param  {Object} request リクエストパラメータ
     * @return {Object} レスポンスオブジェクト
     */
    function registerBook(request) {
        return $.ajax({
            type       : 'POST',
            url        : baseUrl + 'books/',
            dataType   : 'json',
            data       : request,
            async      : false,
            timeout    : 10000,
            processData: false,
            contentType: false
        });
    }

    /**
     * 本更新API
     * @param  {Object} request リクエストパラメータ
     * @return {Object} レスポンスオブジェクト
     */
    function updateBook(request) {
        return $.ajax({
            type    : 'PUT',
            url     : baseUrl + 'book/',
            dataType: 'json',
            data    : request,
            async   : true,
            timeout : 10000
        });
    }

    /**
     * 読書中(貸出中)更新API
     * 読書中と表現していた経緯
     * @param  {Object} request リクエストパラメータ
     * @return {Object} レスポンスオブジェクト
     */
    function updateBookReading(request) {
        return $.ajax({
            type    : 'POST',
            url     : baseUrl + 'books/' + request.lending.book_id + '/lendings/',
            dataType: 'json',
            data    : request,
            async   : true,
            timeout : 10000
        });
    }

    /**
     * 本保管中API
     * @param  {Object} request リクエストパラメータ
     * @return {Object} レスポンスオブジェクト
     */
    function updateBookSafekeeping(request) {
        return $.ajax({
            type    : 'DELETE',
            url     : baseUrl + 'lendings/' + request.lending.book_id,
            dataType: 'json',
            data    : request,
            async   : true,
            timeout : 10000
        });
    }

    /**
     * 返却(予定)日更新API
     * @param  {Object} request リクエストパラメータ
     * @return {Object} レスポンスオブジェクト
     */
    function updateReturnDate(request) {
        return $.ajax({
            type    : 'PATCH',
            url     : baseUrl + 'lendings/' + request.lending.book_id,
            dataType: 'json',
            data    : request,
            async   : false,
            timeout : 10000
        });
    }

    /**
     * 本詳細(メモ)更新API
     * @param  {Object} request リクエストパラメータ
     * @return {Object} レスポンスオブジェクト
     */
    function updateBookDetail(request) {
        return $.ajax({
            type    : 'PUT',
            url     : baseUrl + 'book/detail/',
            dataType: 'json',
            data    : request,
            async   : true,
            timeout : 10000
        });
    }

    /**
     * 本削除API
     * @param  {Object} request リクエストパラメータ
     * @return {Object} レスポンスオブジェクト
     */
    function deleteBook(request) {
        return $.ajax({
            type    : 'DELETE',
            url     : baseUrl + 'books/' + request.book.id,
            dataType: 'json',
            data    : request,
            async   : true,
            timeout : 10000
        });
    }

    /**
     * スラックメッセージ送信API
     * @param  {Object} request リクエストパラメータ
     * @return {Object} レスポンスオブジェクト
     */
    function postMessageSlack(request) {
        var accsessUrl = 'https://hooks.slack.com/services/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';
        return $.ajax({
            type       : 'POST',
            url        : accsessUrl,
            dataType   : 'json',
            data       : 'payload=' + JSON.stringify(request),
            async      : true,
            timeout    : 10000,
        });
    }    

    return {
        getBooks                : getBooks,
        getBookDetail           : getBookDetail,
        registerBook            : registerBook,
        updateBook              : updateBook,
        updateBookReading       : updateBookReading,
        updateBookSafekeeping   : updateBookSafekeeping,
        updateReturnDate        : updateReturnDate,
        updateBookDetail        : updateBookDetail,
        deleteBook              : deleteBook,
        postMessageSlack        : postMessageSlack
    };
})();