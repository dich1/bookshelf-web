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

    function getBooksCount(request) {
        return $.ajax({
            type    : 'GET',
            url     : baseUrl + 'books/count/',
            dataType: 'json',
            async   : true,
            timeout : 10000
        });
    }

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

    function registerBook(request) {
        return $.ajax({
            type       : 'POST',
            url        : baseUrl + 'book/',
            dataType   : 'json',
            data       : request,
            async      : false,
            timeout    : 10000,
            processData: false,
            contentType: false
        });
    }

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

    function updateBookPetition(request) {
        return $.ajax({
            type    : 'PUT',
            url     : baseUrl + 'book/petition/',
            dataType: 'json',
            data    : request,
            async   : true,
            timeout : 10000
        });
    }

    function updateBookReading(request) {
        return $.ajax({
            type    : 'PUT',
            url     : baseUrl + 'book/reading/',
            dataType: 'json',
            data    : request,
            async   : true,
            timeout : 10000
        });
    }

    function updateBookSafekeeping(request) {
        return $.ajax({
            type    : 'PUT',
            url     : baseUrl + 'book/safekeeping/',
            dataType: 'json',
            data    : request,
            async   : true,
            timeout : 10000
        });
    }

    function updateReturnDate(request) {
        return $.ajax({
            type    : 'PUT',
            url     : baseUrl + 'book/return-date/',
            dataType: 'json',
            data    : request,
            async   : false,
            timeout : 10000
        });
    }

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

    function deleteBook(request) {
        return $.ajax({
            type    : 'DELETE',
            url     : baseUrl + 'book/',
            dataType: 'json',
            data    : request,
            async   : true,
            timeout : 10000
        });
    }

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
        getBooksCount           : getBooksCount,
        getBookDetail           : getBookDetail,
        registerBook            : registerBook,
        updateBook              : updateBook,
        updateBookPetition      : updateBookPetition,
        updateBookReading       : updateBookReading,
        updateBookSafekeeping   : updateBookSafekeeping,
        updateReturnDate        : updateReturnDate,
        updateBookDetail        : updateBookDetail,
        deleteBook              : deleteBook,
        postMessageSlack        : postMessageSlack
    };
})();