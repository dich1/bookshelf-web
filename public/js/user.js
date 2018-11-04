/**
 * ログイン
 * @param {Number} ユーザーID
 * @param {String} ユーザー名
 * @param {String} ユーザー画像
 */
function login(userId, userName, userImage) {
    setUser(userName, userImage);
    var storage = sessionStorage;
    storage.setItem('user_id', userId);
    storage.setItem('user_name', userName);
    storage.setItem('user_image', userImage);
}

/**
 * ログアウト
 */
function logout() {
    var storage = sessionStorage;
    storage.removeItem('user_id');
    storage.removeItem('user_name');
    storage.removeItem('user_image');
}

/**
 * ユーザー情報を取得する
 * @return {Object} ユーザー情報
 */
function getUser() {
    var storage = sessionStorage;
    if (storage.getItem('user_id')) {
        setUser(storage.getItem('user_name'), storage.getItem('user_image'));
        return;
    }
    var endpointName = 'ユーザー取得API';
    var getUser = Api.getUser();
    getUser.done(function(data){
        console.log(endpointName + '：' + getUser.status);
        login(data.user_id, data.user_name, data.user_image);
        displayAlert('ログインしました。');
    }).fail(function(data, textStatus, errorThrown) {
        logout();
        displayAlert('借りるにはログインが必要です。');
    });    
}

/**
 * ユーザー情報を設定する
 * @param {Object} user ユーザー情報
 */
function setUser(userName, userImage) {
    var nav = document.getElementsByClassName('logout')[0];
    nav.setAttribute('class', 'login');
    var userElement = document.getElementById('user');
    var userMenuElement = '<a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="padding: 0px 8px; background-color: #fff0;">'
                        + '<img src="' + userImage + '" alt="" >' + userName
                        + '</a>'
                        + '<span class="dropdown-menu" aria-labelledby="dropdownMenuLink">'
                        + '<a class="dropdown-item" href="/users/edit">設定変更</a>'
                        + '<a class="dropdown-item" href="/users/sign_out" onclick="logout();">ログアウト</a>'
                        + '</span>';
    userElement.innerHTML = userMenuElement;
}