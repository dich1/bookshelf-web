$(document).ready(function() {
    $("#form_book_title").keyup(function() {
        var keyword = $(this).val();
        setTimeout(function(){
            if (location.pathname === '/index.html') {
                getBooks(null, 1, keyword);
            }
            if (location.pathname === '/form.html') {
                searchBook(keyword);
            }
        }, 1000);
    });
});