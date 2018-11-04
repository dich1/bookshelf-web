/**
 * 現在時刻をYYYY-mm-ddで取得する
 * @return {string} YYYY-mm-dd
 */
function getNowYYYYMMDD(){
    var dt = new Date();
    var y = dt.getFullYear();
    var m = ('00' + (dt.getMonth() + 1)).slice(- 2);
    var d = ('00' + dt.getDate()).slice(-2);
    
    return y + '-' + m + '-' + d;
}

/**
 * Datepickerを設定する
 */
function setDatepicker() {
    $.datepicker.setDefaults($.datepicker.regional["ja"]);
    $.datepicker._gotoToday = function(datepickerId) {
        var target = $(datepickerId);
        var instance = this._getInst(target[0]);
        var dateText = getNowYYYYMMDD();
        this._setDate(instance, dateText);
        selectDate(dateText, instance);
        this._hideDatepicker();
    }
    $(".datepicker").datepicker({
        dateFormat     : 'yy-mm-dd',
        minDate        : '0',
        buttonImage    : './images/date.jpg',
        showOn         : 'button',
        buttonImageOnly: true,
        showButtonPanel: true,
        onSelect: function(dateText, event){
            selectDate(dateText, event);
        },
        beforeShow: function(input) {
            setTimeout(function() {
                var buttonPane = $(input)
                    .datepicker('widget')
                    .find('.ui-datepicker-buttonpane');
            }, 1 );
        },
    });
}

/**
 * Datepickerを開く
 * @param {id} 本ID
 */
function openDatepicker(id) {
    document.getElementById(id).children[0].children[1].children[1].click();
}

/**
 * 本のIDを取得する
 * @param {Objecr} event クリックイベント
 * @return {String} 本ID
 */
function getBookId(event) {
    return event.input[0].parentElement.parentElement.parentElement.id;
}

/**
 * ステータスを取得する
 * @param {Objecr} event クリックイベント
 * @return {Number} 0:保管中 1:貸出中(読書中)
 */
function getStatus(event) {
    var readingclassName = event.input[0].parentElement.parentElement.parentElement.children[2].children[1].children[0].className;    
    return (readingclassName.match(/active/)) ? 1 : 0;
}

/**
 * 日付を送信する
 * @param {Number} status 本ステータス
 * @param {Number} id 本ID
 * @param {String} dateText 日付文字列
 */
function sendDate(status, id, dateText) {
    // 保管中なら借入
    if (status === 0) {
        var sendText = createReadingSendText(id, '借入', dateText);
        postMessageSlack(id, sendText, dateText);
        updateBookReading(id, dateText);
    }
    // 借入中なら返却予定日更新
    if (status === 1) {
        var sendText = createReadingSendText(id, '変更', dateText);
        postMessageSlack(id, sendText, dateText);
        updateReturnDate(id, dateText);
    }
}

/**
 * 日付を選択する
 * @param {String} dateText 日付文字列
 * @param {Object} event イベントオブジェクト
 */
function selectDate(dateText, event) {
    var id = getBookId(event);
    var status = getStatus(event);
    if (dateText !== '') {
        sendDate(status, id, dateText);
    }
}