'use strict'

// Firebase SDKのインポート（モジュール版）
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: getKeyValue(),
  authDomain: "digital-training-pa010.firebaseapp.com",
  databaseURL: "https://digital-training-pa010-default-rtdb.firebaseio.com",
  projectId: "digital-training-pa010",
  storageBucket: "digital-training-pa010.firebasestorage.app",
  messagingSenderId: "110190854767",
  appId: "1:110190854767:web:216cc1cac94ac6338f039a",
  measurementId: "G-Y9LNQEHJV1"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 送信ボタンの処理
const sendBtn = document.getElementById('sendBtn'); // 送信ボタン
if (sendBtn) {
    const noteField = document.getElementById('inputNotes');   // メモ入力ボックス

    // Tabキーでインデントを入力できるようにする
    noteField.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault(); // フォーカス移動を無効化
            
            // カーソル位置にスペース2つ（またはタブ\t）を挿入
            const start = noteField.selectionStart;
            const end = noteField.selectionEnd;
            const indent = "  "; // スペース2個とする場合
            // const indent = "\t"; // 本当のタブ文字とする場合

            noteField.value = noteField.value.substring(0, start) + indent + noteField.value.substring(end);
            
            // カーソル位置を調整
            noteField.selectionStart = noteField.selectionEnd = start + indent.length;
        }
    });

    // 送信ボタンのクリックイベントハンドラ
    sendBtn.addEventListener('click', () => {
    //    const noteVal = noteField.value.trim();
       const noteVal = noteField.value;

        // デバッグ
        // alert("送信データの中身:\n" + JSON.stringify(noteVal));

        // 入力がない場合
        if (!noteVal) return;

        // データ送信
        push(ref(db, 'sendnote'), {
            notes: noteVal,
            timestamp: serverTimestamp()
        }).then(() => {
            showAlert("Send Notes", "送信しました！", "success");
            // 送信後に入力欄をクリア
            noteField.value = ""; 

        }).catch((error) => {
            console.error("Error:", error);
            showAlert("Send Notes", "送信に失敗しました", "error");
        });
    });
}

// リセットボタンの処理
const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        Swal.fire({
            title: 'データをすべて消去しますか？',
            text: "この操作は取り消せません！",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '削除します',
            cancelButtonText: 'キャンセル'
        }).then((result) => {
            if (result.isConfirmed) {
                remove(ref(db, 'sendnote'))
                    .then(() => {
                        location.reload();
                    })
                    .catch((error) => {
                        console.error(error);
                        showAlert("エラー", "リセットに失敗しました", "error");
                    });
            }
        });
    });
}

function getKeyValue() {
    const aryData = [65, 73, 122, 97, 83, 121, 68, 82, 114, 72, 121, 118, 95, 66, 114, 115, 74, 105, 98, 95, 115, 99, 55, 117, 117, 71, 122, 65, 111, 70, 111, 115, 98, 121, 121, 49, 68, 84, 56]
    let key = "";
    for (const code of aryData) {
        key += String.fromCharCode(code);
    }
    return key;

}
