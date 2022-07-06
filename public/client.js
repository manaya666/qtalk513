const socket = io.connect();

// 接続時の処理
socket.on(
    'connect',
    () => {
        console.log('connect');
    });

// 「参加する」ボタンを押したときの処理
$('#join__form').submit(
    () => {
        console.log('#input_nickname :', $('#input_nickname').val());

        if ($('#input_nickname').val()) {

            socket.emit('join', $('#input_nickname').val());

            $('#chat__nickname').html($('#input_nickname').val());
            $('#join__screen').hide();
            $('#chat__screen').show();
        }

        return false;   // フォーム送信はしない
    });

// 「送信」ボタンを押したときの処理
$('form').submit(
    () => {
        console.log('#chat__message :', $('#chat__message').val());

        if ($('#chat__message').val()) {
            socket.emit('new message', $('#chat__message').val());

            $('#chat__message').val('');
        }

        return false;   // フォーム送信はしない
    });

// サーバーからのメッセージ拡散に対する処理
socket.on(
    'spread message',
    (objMessage) => {
        console.log('spread message :', objMessage);

        // メッセージの整形
        const strText = objMessage.strDate + ' [' + objMessage.strNickname + '] ' + objMessage.strMessage;

        // 拡散されたメッセージをメッセージリストに追加x
        const li_element = $('<li>').text(strText);
        $('#chat__box').prepend(li_element);
    });

const inpFile = document.getElementById("inpFile");
const previewContainer = document.getElementById("imagePreview");
const previewImage = previewContainer.querySelector(".image-preview__image");
const previewDefaultText = previewContainer.querySelector(".image-preview__default-text");

inpFile.addEventListener("change", function () {
    const file = this.files[ 0 ];

    console.log(file);

    if (file) {
        const reader = new FileReader();

        previewDefaultText.style.display = "none";
        previewImage.style.display = "block";

        reader.addEventListener("load", function () {
            console.log(this);
            previewImage.setAttribute("src", this.result);
        });

        reader.readAsDataURL(file);
    } else {
        previewDefaultText.style.display = null;
        previewImage.style.display = null;
        previewImage.setAttribute("src", "");
    }

    io.emit('spread message', objMessage);
});

function fileload() {
    if (!file.files[ 0 ]) {
        return;
    }
    image = new Image();
    image.onload = function () {
        result = { width: image.naturalWidth, height: image.naturalHeight };
        console.log(result);
    }
    image.src = URL.createObjectURL(file.files[ 0 ]);
}