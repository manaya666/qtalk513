'use strict';

// モジュール
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// オブジェクト
const app = express();
const server = http.Server(app);
const io = socketIO(server);

// 定数
const PORT = process.env.PORT || 3000;
const SYSTEMNICKNAME = 'ようこそ'

// 関数
const toDoubleDigitString =
    (num) => {
        return ("0" + num).slice(-2);
    };

const makeTimeString =
    (time) => {
        return toDoubleDigitString(time.getHours()) + ':' + toDoubleDigitString(time.getMinutes());
    }

// グローバル変数
let iCountUser = 0; // ユーザー数

// 接続時の処理
io.on(
    'connection',
    (socket) => {
        console.log('connection');

        let strNickname = '';

        // 切断時の処理
        socket.on(
            'disconnect',
            () => {
                console.log('disconnect');

                if (strNickname) {
                    // ユーザー数の更新
                    iCountUser--;

                    // メッセージオブジェクトに現在時刻を追加
                    const strNow = makeTimeString(new Date());

                    // システムメッセージの作成
                    const objMessage = {
                        strNickname: SYSTEMNICKNAME,
                        strMessage: strNickname + 'が退出' + "しました" + "「" + iCountUser + "名" + "」",
                        strDate: strNow
                    }

                    // 送信元含む全員に送信
                    io.emit('spread message', objMessage);
                }
            });

        // 入室時の処理
        socket.on(
            'join',
            (strNickname_) => {
                console.log('joined :', strNickname_);
                strNickname = strNickname_;

                // ユーザー数の更新
                iCountUser++;

                // メッセージオブジェクトに現在時刻を追加
                const strNow = makeTimeString(new Date());

                const objMessage = {
                    strNickname: SYSTEMNICKNAME,
                    strMessage: strNickname + ' が参加' + "しました" + "「" + iCountUser + "名" + "」",
                    strDate: strNow
                }

                // 送信元含む全員に送信
                io.emit('spread message', objMessage);
            });

        // 新しいメッセージ受信時の処理
        socket.on(
            'new message',
            (strMessage) => {
                console.log('new message', strMessage);

                // 現在時刻の文字列の作成
                const strNow = makeTimeString(new Date());

                // メッセージオブジェクトの作成
                const objMessage = {
                    strNickname: strNickname,
                    strMessage: strMessage,
                    strDate: strNow
                }

                io.emit('spread message', objMessage);
            });
    });

// 公開フォルダの指定
app.use(express.static(__dirname + '/public'));

// サーバーの起動
server.listen(
    PORT,
    () => {
        console.log('Server on port %d', PORT);
    });