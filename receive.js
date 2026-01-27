'use strict'

// Firebase SDKのインポート（モジュール版）
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRrHyv_BrsJib_sc7uuGzAoFosbyy1DT8",
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

const resultsDiv = document.getElementById('results');  // 指示表示用div
if (resultsDiv) {
    const answersRef = ref(db, 'sendnote');
    
    // データが追加された場合の処理
    onChildAdded(answersRef, (snapshot) => {
        const data = snapshot.val();
        if (!data.notes) return;    // 値がない場合は抜ける
        const card = document.createElement("div"); // データカード作成
        card.className = "card";

        // 安全のためにHTMLエスケープ（HTMLタグが入力された場合の安全策）
        // サニタイズ（不正な文字を安全な文字に置き換え）
        // 簡易的なXSS（クロスサイトスクリプティング）攻撃対策として textContent を使うのも可
        // const safeName = data.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        // const safeNotes = data.notes.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        // let safeNotes = data.notes;
        
        const safeNotes = data.notes.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // 改行を <br> に変換
        // safeNotes = safeNotes.replace(/\n/g, '<br>');

        // タブ文字(\t) を スペース4つ(&nbsp;&nbsp;&nbsp;&nbsp;) に変換 
        // safeNotes = safeNotes.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');

        card.innerHTML = `
            <div class="card-notes">${safeNotes}</div>
        `;
        // 画面に追加
        // resultsDiv.appendChild(card); // ← 末尾に追加（古い順になる）
        resultsDiv.prepend(card);         // ← 先頭に追加（新しい順＝新しいものが上に来る）

        // 新しいものが上に来るので、「一番下までスクロール」は不要
        // window.scrollTo(0, document.body.scrollHeight);
    });

}
