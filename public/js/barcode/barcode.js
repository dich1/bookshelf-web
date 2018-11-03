(function($) {
  var barcodeReader, getUserMedia;
  $.fn.barcode = function(config) {
    var default_messages, defaults, options;
    defaults = {
      canvas_width: 640,
      canvas_height: 480
    };
    default_messages = {
      unavailable: "This browser does not have some features required this page. Please try with another browser. このブラウザでは使えません。別のブラウザで試してください。",
      videoButton: "Capture from camera in browser / ブラウザの中でカメラ画像を取得",
      videoCloseButton: "Close Camera / カメラを閉じる",
      decoding: "Decoding... / 認識中...",
      decodingFailed: "Decoding failed. / 認識できませんでした。",
      finished: "Finished. / 認識処理終了。",
      finishedWithCamera: "Finished. Close camera or click image to decode again. / 認識処理終了。カメラを閉じるか画像をクリックして続けて認識させてください。",
      decoderPath: "./js/barcode/DecoderWorker.js",
      scanIntro: "Show barcode on camera and click below. / カメラにバーコードをかざして下の画像をクリックしてください",
      videoIntro: "Allow to access camera. / カメラへのアクセスを許可してください",
      videoError: "Unable to get video stream! / カメラへのアクセスができませんでした。",
      fileApiError: "Neither createObjectURL or FileReader are supported"
    };
    options = $.extend(defaults, config);
    options.msg = $.extend(default_messages, options.msg);
    if (!window.Worker) {
      return this.html(options.msg.unavailable);
    }
    this.each(function(i, e) {
      return barcodeReader(e, options);
    });
    return this;
  };
  getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  return barcodeReader = function(el, options) {
    var $el, $video, canvas, ctx, disableInput, enableInput, fileInput, img, msg, onError, onStream, receiveMessage, resultArray, scan, startDecodeWorkers, video, videoButton, videoCloseButton, videoStream, workerCount, workers;
    $el = $(el);
    msg = options.msg;
    fileInput = $('<input type="file" accept="image/*;capture=camera">');
    $el.append(fileInput);
    videoButton = $('<button>' + msg.videoButton + '</button>').hide();
    $el.append(videoButton);
    videoCloseButton = $('<button>' + msg.videoCloseButton + '</button>').hide();
    $el.append(videoCloseButton);
    $el.append($('<br>'));
    $video = $('<video></video>').hide();
    $el.append($video);
    video = $video[0];
    canvas = $('<canvas></canvas>').hide();
    canvas.attr({
      width: options.canvas_width,
      height: options.canvas_height
    });
    $el.append(canvas);
    canvas = canvas[0];
    ctx = canvas.getContext("2d");
    workerCount = 0;
    resultArray = [];
    receiveMessage = function(e) {
      if (e.data.success === "log") {
        if (typeof console !== "undefined" && console !== null) {
          console.log(e.data.result);
        }
        return;
      }
      workerCount--;
      if (e.data.success) {
        $.each(e.data.result, function(i, r) {
          if ($.inArray(r, resultArray) === -1) {
            resultArray.push(r);
            return $el.trigger("decoding", {
              result: r,
              results: resultArray
            });
          }
        });
        $el.trigger("progress", {
          message: msg.decoding,
          results: resultArray
        });
      } else {
        if (resultArray.length === 0 && workerCount === 0) {
          $el.trigger("error", {
            message: msg.decodingFailed
          });
        }
      }
      if (workerCount === 0) {
        if (videoCloseButton.attr("disabled")) {
          $el.trigger("finished", {
            message: msg.finished,
            results: resultArray
          });
        } else {
          $el.trigger("finished", {
            message: msg.finishedWithCamera,
            results: resultArray
          });
        }
        return $(canvas).hide();
      }
    };
    workers = {
      normal: new Worker(msg.decoderPath),
      right: new Worker(msg.decoderPath),
      left: new Worker(msg.decoderPath),
      flip: new Worker(msg.decoderPath)
    };
    $.each(workers, function(i, e) {
      return e.onmessage = receiveMessage;
    });
    startDecodeWorkers = function() {
      disableInput();
      $(canvas).show();
      resultArray = [];
      $el.trigger("progress", {
        message: msg.decoding,
        results: []
      });
      return $.each(workers, function(i, e) {
        e.postMessage({
          pixels: ctx.getImageData(0, 0, canvas.width, canvas.height).data,
          cmd: i
        });
        return workerCount++;
      });
    };
    img = $("<img>")[0];
    img.onload = function() {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return startDecodeWorkers();
    };
    fileInput.on("change", function(event) {
      var URL, error, file, fileReader, files, imgURL;
      $el.one("finished", enableInput);
      files = event.target.files;
      if (!files || files.length === 0) {
        return;
      }
      file = files[0];
      try {
        URL = window.URL || window.webkitURL;
        imgURL = URL.createObjectURL(file);
        img.src = imgURL;
        return URL.revokeObjectURL(imgURL);
      } catch (_error) {
        error = _error;
        try {
          fileReader = new FileReader();
          fileReader.onload = function(event) {
            return img.src = event.target.result;
          };
          return fileReader.readAsDataURL(file);
        } catch (_error) {
          error = _error;
          return $el.trigger("error", {
            message: msg.fileApiError
          });
        }
      }
    });
    disableInput = function() {
      fileInput.attr("disabled", "disabled");
      return videoButton.attr("disabled", "disabled");
    };
    if (!getUserMedia) {
      enableInput = function() {
        return fileInput.removeAttr("disabled");
      };
    } else {
      enableInput = function() {
        fileInput.removeAttr("disabled");
        return videoButton.removeAttr("disabled");
      };
      videoButton.show();
      videoCloseButton.show().attr("disabled", "disabled");
    }
    videoStream = null;
    onStream = function(stream) {
      var URL;
      URL = window.URL || window.webkitURL;
      videoStream = stream;
      if (URL) {
        video.src = URL.createObjectURL(stream);
      } else {
        video.src = stream;
      }
      return video.play();
    };
    onError = function(error) {
      $el.trigger("error", {
        message: msg.videoError
      });
      return disableInput();
    };
    scan = function() {
      ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
      startDecodeWorkers();
      $video.hide();
      return $el.one("finished", function() {
        if (videoStream) {
          return $video.show();
        }
      });
    };
    $video.on("click", scan);
    $video.on("play", function() {
      videoCloseButton.removeAttr("disabled");
      $video.show();
      return $el.trigger("intro", {
        message: msg.scanIntro
      });
    });
    videoButton.on("click", function() {
      $el.trigger("intro", {
        message: msg.videoIntro
      });
      disableInput();
      if (!videoStream) {
        getUserMedia.call(navigator, {
          audio: false,
          video: true,
          toString: function() {
            return "video";
          }
        }, onStream, onError);
      }
    });
    return videoCloseButton.on("click", function() {
      videoCloseButton.show().attr("disabled", "disabled");
      if (videoStream != null) {
        videoStream.stop();
      }
      videoStream = null;
      $video.hide();
      return enableInput();
    });
  };
})(jQuery);

jQuery(function($) {
  var barcode, container, result, textArea, title;
  container = $("#container");
  result = $('<output></output><hr>');
  container.append(result);
  result = result[0];
  barcode = $('<div></div>');
  container.append(barcode);
  container.append($('<hr>'));
  textArea = $('<input id="form_book_isbn" type="hidden" name="book_isbn" placeholder="ISBNを入力" value="" required>');
  title = $('#form_book');
  title.append(textArea);
  container.show();
  barcode = barcode.barcode();
  barcode.on("decoding", function(e, o) {
    textArea.val(textArea.val() + o.result.replace(/^[^:]+: /g, "") + "\n");
    return textArea.attr("rows", parseInt("0" + textArea.attr("rows"), 10) + 1);
  });
  barcode.on("progress", function(e, o) {
    return result.innerHTML = o.message + "<br />" + o.results.join("<br />");
  });
  barcode.on("intro", function(e, o) {
    return result.innerHTML = o.message;
  });
  barcode.on("error", function(e, o) {
    return result.innerHTML = o.message;
  });
  return barcode.on("finished", function(e, o) {
    document.getElementById('isbn_submit').click();
    return result.innerHTML += "<br />" + o.message;
  });
});

// ---
// generated by coffee-script 1.9.2