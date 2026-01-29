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

// クリップボードのアイコン
// const ICON_COPY = `
// <svg viewBox="0 0 24 24">
//   <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
// </svg>`;

//   <rect x="5" y="8" width="11" height="13" rx="2" />

const ICON_COPY = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  
  <rect x="6" y="7" width="11" height="13" rx="2" />
  
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
        noteContent.textContent = data.notes; // ここで生のデータを入れる（自動エスケープされる）
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

        // copyBtn.addEventListener('click', () => {
        //     // safeNotesではなく、元の data.notes をコピーする
        //     // そうしないと、貼り付けたときに <script> が &lt;script&gt; になってしまう
        //     navigator.clipboard.writeText(data.notes)
        //         .then(() => {
        //             const originalText = copyBtn.textContent;
        //             copyBtn.textContent = 'Copied!';
        //             setTimeout(() => {
        //                 copyBtn.textContent = originalText;
        //             }, 2000);
        //         })
        //         .catch(err => {
        //             console.error('コピー失敗:', err);
        //             alert('コピーに失敗しました');
        //         });
        // });

        // card.appendChild(copyBtn);
        // resultsDiv.prepend(card);
    });
}

// const resultsDiv = document.getElementById('results');  // 指示表示用div
// if (resultsDiv) {
//     const answersRef = ref(db, 'sendnote');
    
//     // データが追加された場合の処理
//     onChildAdded(answersRef, (snapshot) => {
//         const data = snapshot.val();
//         if (!data.notes) return;    // 値がない場合は抜ける
//         const card = document.createElement("div"); // データカード作成
//         card.className = "card";

//         // 安全のためにHTMLエスケープ（HTMLタグが入力された場合の安全策）
//         // サニタイズ（不正な文字を安全な文字に置き換え）
//         // 簡易的なXSS（クロスサイトスクリプティング）攻撃対策として textContent を使うのも可        
//         const safeNotes = data.notes.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
//         // CSS側で対応したためコメント化
//         // let safeNotes = data.notes;
//         // 改行を <br> に変換
//         // safeNotes = safeNotes.replace(/\n/g, '<br>');
//         // タブ文字(\t) を スペース4つ(&nbsp;&nbsp;&nbsp;&nbsp;) に変換 
//         // safeNotes = safeNotes.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');

//         card.innerHTML = `
//             <div class="card-notes">${safeNotes}</div>
//         `;
        
//         // コピーボタンを作成
//         const copyBtn = document.createElement('button');
//         copyBtn.textContent = 'Copy'; // 最初は「Copy」やアイコンを表示
//         copyBtn.className = 'copy-btn';

//         // クリック時の動作を設定
//         copyBtn.addEventListener('click', () => {
//             // クリップボードにテキストを書き込む
//             navigator.clipboard.writeText(safeNotes)
//                 .then(() => {
//                     // 成功時：ボタンの表示を変えてフィードバックを与える
//                     const originalText = copyBtn.textContent;
//                     copyBtn.textContent = 'Copied!';
                    
//                     // 2秒後に元の表示に戻す
//                     setTimeout(() => {
//                         copyBtn.textContent = originalText;
//                     }, 2000);
//                 })
//                 .catch(err => {
//                     console.error('コピーに失敗しました:', err);
//                     alert('コピーに失敗しました');
//                 });
//         });

//         // カードにボタンを追加
//         card.appendChild(copyBtn);

//         // 画面に追加
//         // resultsDiv.appendChild(card); // ← 末尾に追加（古い順になる）
//         resultsDiv.prepend(card);         // ← 先頭に追加（新しい順＝新しいものが上に来る）

//         // 新しいものが上に来るので、「一番下までスクロール」は不要
//         // window.scrollTo(0, document.body.scrollHeight);
//     });

// }
