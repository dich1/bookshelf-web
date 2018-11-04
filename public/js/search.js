$(document).ready(function() {
    $("#form_book_title").keyup(function() {
        var keyword = $(this).val();
        setTimeout(function(){
            if (location.pathname === '/form.html') {
                return searchBook(keyword);
            }
            return getBooks(null, 1, keyword);
        }, 1000);
    });
});