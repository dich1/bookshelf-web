/**
 * レスポンスエラーを表示する
 * @param {string} endpointName エンドポイント名
 * @param {Object} data         リクエスト返却データ
 * @param {string} textStatus   ステータスメッセージ
 * @param {Object} errorThrown  エラーオブジェクト
 */
function displayResponseError(endpointName, data, textStatus, errorThrown) {
    console.log(endpointName + 'エラーステータス：' + data.status);
    console.log(endpointName + 'ステータスメッセージ：' + textStatus);
    console.log(endpointName + 'エラーメッセージ：' + errorThrown.message);
    alert('リクエスト失敗したのでもう一回お願いします。');
}