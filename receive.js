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

// クリップボードのアイコン
const ICON_COPY = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  
  <rect x="6" y="7" width="11" height="13" rx="2" fill="white" />  
  <rect x="10" y="3" width="11" height="13" rx="2" fill="white" />  
</svg>`;

// チェックマークのアイコン（完了用）
const ICON_CHECK = `
<svg viewBox="0 0 24 24">
  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
</svg>`;

const resultsDiv = document.getElementById('results');

if (resultsDiv) {
    const answersRef = ref(db, 'sendnote');
    
    onChildAdded(answersRef, (snapshot) => {
        const data = snapshot.val();
        if (!data.notes) return;

        const card = document.createElement("div");
        card.className = "card";

        // テキスト部分の作成
        // innerHTMLを使わず、divを作って textContent に代入することで
        // 自動的に安全に表示され、かつバッククォート等でのエラーも防げる
        const noteContent = document.createElement("div");
        noteContent.className = "card-notes";

        // URLをリンクにする正規表現
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        
        // 置換処理
        const linkedText = data.notes.replace(urlRegex, (url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline; font-weight: bold;">${url}</a>`;
        });

        // innerHTMLで代入
        noteContent.innerHTML = linkedText;

        // noteContent.textContent = data.notes; // ここで生のデータを入れる（自動エスケープされる）
        card.appendChild(noteContent);

        // コピーボタンの作成
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.className = 'copy-btn';

        // ★アイコンとツールチップの初期設定
        copyBtn.innerHTML = ICON_COPY;        // アイコンを表示
        copyBtn.setAttribute('data-tooltip', 'コピー'); // ツールチップの文字

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(data.notes)
                .then(() => {
                    // ★成功時の見た目の切り替え
                    
                    // 1. アイコンをチェックマークに変更
                    copyBtn.innerHTML = ICON_CHECK;
                    // 2. 色を緑色っぽくする（CSSを直接変更またはクラス付与）
                    copyBtn.style.color = '#28a745';
                    // 3. ツールチップの文字を変更
                    copyBtn.setAttribute('data-tooltip', 'コピーしました！');

                    // 2秒後に元に戻す
                    setTimeout(() => {
                        copyBtn.innerHTML = ICON_COPY;
                        copyBtn.style.color = ''; // 色をCSSの指定に戻す
                        copyBtn.setAttribute('data-tooltip', 'コピー');
                    }, 2000);
                })
                .catch(err => {
                    console.error('コピー失敗:', err);
                    alert('コピーに失敗しました');
                });
        });

        card.appendChild(copyBtn);
        resultsDiv.prepend(card);
    });
}

function getKeyValue() {
    const aryData = [65, 73, 122, 97, 83, 121, 68, 82, 114, 72, 121, 118, 95, 66, 114, 115, 74, 105, 98, 95, 115, 99, 55, 117, 117, 71, 122, 65, 111, 70, 111, 115, 98, 121, 121, 49, 68, 84, 56]
    let key = "";
    for (const i of aryData) {
        key += String.fromCharCode(i);
    }
    return key;
}