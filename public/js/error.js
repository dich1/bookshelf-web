function displayResponseError(endpointName, data, textStatus, errorThrown) {
    console.log(endpointName + 'エラーステータス：' + data.status);
    console.log(endpointName + 'ステータスメッセージ：' + textStatus);
    console.log(endpointName + 'エラーメッセージ：' + errorThrown.message);
    alert('リクエスト失敗したのでもう一回お願いします。');
}