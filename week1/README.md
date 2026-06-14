# 第一週作業：健身房資料處理工具

## 情境與任務描述

Leo 教練剛接手健身房的資料管理，他需要一支小工具：從 JSON 檔案讀會員清單、篩出 VIP、計算點數、並從環境變數讀取設定。

本週作業將第一堂所學習的主題：**模組化、fs/promises、process.env** 整合成小工具，讓我們可以從 JSON 檔案讀取會員清單，以及透過陣列操作來篩選出會員、計算點數，並從環境變數讀取設定等等，最後使用 Jest 來進行測試驗證。

---

## 快速開始

### Step 1：環境準備

1. 確認 Node.js 版本 >= 18（建議 20）
2. 下載作業專案：...，並打開終端機輸入：`npm install`

### Step 2：設定環境變數

手動新增 `.env`，並將環境變數範例檔（`.env.example`）內容複製到 `.env`（或者可打開終端機輸入：`cp .env.example .env`）

`.env` 內容可以自行調整，但不可以把 `.env` 推上 GitHub（`.gitignore` 目前已有排除）。

### Step 3：開始寫作業

打開 `index.js`，依照註解提示先了解參數、要回傳的內容，然後再開始撰寫並完成五個函式。

```js
// 任務一舉例：
// ========== 任務一：讀取會員清單 ==========
/**
 * 讀取指定路徑的 JSON 檔案，回傳解析後的會員陣列。
 *
 * @param {string} filePath - 會員 JSON 檔案的路徑（相對或絕對都可以）
 * @returns {Promise<Array<Object>>} 會員物件陣列
 *
 * @example
 *   const members = await readMembers('./fixtures/members.json');
 *   console.log(members[0].name); // '小華'
 */
async function readMembers(filePath) {
  // TODO: 實作此函式
  // 提示：用 fs/promises 的 readFile，記得加 'utf-8'，再用 JSON.parse 轉成物件
}
```

（最後的 `module.exports = {...}` 不可更動唷！）

### Step 4：測試你的程式碼

```bash
# 執行快速測試（看基本輸出）
npm start

# 執行完整 Jest 測試（看通過/失敗）
npm test
```

---

## 主線任務

### 【任務一：讀取會員清單】

* 函式：`readMembers(filePath)`
* 用 `fs/promises` 讀取指定路徑的 JSON 檔案

### 【任務二：篩選 VIP 會員】

* 函式：`filterVIP(members)`
* 透過陣列方法篩選，回傳 `level === 'VIP'` 的會員
* 注意：不可修改原陣列

### 【任務三：計算點數總和】

* 函式：`sumCredits(members)`
* 加總陣列中所有人的 `credits` 欄位
* 空陣列回傳 `0`

### 【任務四：讀取環境變數】

* 函式：`getGymConfig()`
* 從 `process.env` 讀取 `GYM_NAME`、`ADMIN_NAME`、`DEFAULT_MEMBERS_PATH`

### 【任務五：VIP 會員統計摘要】（綜合題）

* 函式：`getVIPSummary(filePath)`
* 綜合使用先前撰寫的函式，最終回傳指定格式的會員統計摘要

---

## 測試與驗證

本作業使用 Jest 進行自動化測試。

### 測試指令

- 執行快速測試（看基本輸出）：`npm start`
- 完整測試：`npm test`

### 測試結果說明
✓ 表示測試通過
✕ 表示測試失敗

### 測試項目（共 8 項）

| 群組 | 測試數量 |
|---|---|
| 任務一：readMembers | 1 |
| 任務二：filterVIP | 2 |
| 任務三：sumCredits | 2 |
| 任務四：getGymConfig | 2 |
| 任務五：getVIPSummary | 1 |

---

## 繳交方式

1. 完成 index.js 中的所有函式
2. 執行 npm test 確保所有測試通過
3. 將程式碼上傳至 GitHub
4. 提交 GitHub 連結

---

## 常見問題

**Q：`npm install` 失敗？**
A：可先確認 Node.js 版本 `node -v`，至少要 18（建議 20）。如果還是不行，刪掉 `node_modules/` 和 `package-lock.json` 後再重新執行 `npm install`

**Q：`.env` 的值讀不到？**
A：這週還沒有教 `dotenv`，所以 `.env` 本機直接執行 `node app.js` 會是讀不到的。目前 Jest 測試會自己使用 `process.env.XXX`，所以 `getGymConfig` 照著規格寫就可以通過囉。

