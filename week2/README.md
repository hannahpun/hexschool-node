# 第二週作業：教練大頭照上傳 API

## 情境與任務描述

Leo 教練想讓每位教練都能上傳自己的大頭照。因此他需要一支後端 API，來處理圖片接收、解析檔案內容跟基本資訊、儲存到指定目錄、回傳 metadata 檔案資訊。

本週作業將第二堂學習的主題：dotenv、原生 http server、formidable 整合，讓我們撰寫一支後端 API，來達成接收檔案（圖片檔）、解析檔案內容跟基本資訊（檔名、大小、副檔名）、儲存到指定目錄、回傳 metadata 檔案資訊等，最後使用 Jest 來進行測試驗證。

---

## 快速開始

### Step 1：環境準備

1. 確認 Node.js 版本 >= 18（建議 20）
2. 下載作業專案：...，並打開終端機輸入：`npm install`

### Step 2：設定環境變數

手動新增 `.env`，並將環境變數範例檔（`.env.example`）內容複製到 `.env`（或者可打開終端機輸入：`cp .env.example .env`）

不可把 `.env` 推上 GitHub（`.gitignore` 目前已有排除）

### Step 3：開始寫作業

打開 `index.js`，依照註解提示先了解參數、要回傳的內容，然後再開始撰寫並完成六個函式。

```js
// 任務一舉例：
// ========== 任務一：讀取上傳設定 ==========
/**
 * 從 process.env 讀取上傳相關設定，回傳設定物件。
 *
 * 規則：
 *   - UPLOAD_DIR 未設定 → 預設 '/tmp'
 *   - MAX_FILE_SIZE_MB 未設定 → 預設 5（MB）
 *   - GYM_NAME 未設定 → 預設 '未命名健身房'
 *
 * 回傳物件：
 *   - uploadDir: 上傳目錄（字串）
 *   - maxFileSize: 最大檔案大小（bytes，= MB * 1024 * 1024）
 *   - gymName: 健身房名稱（字串）
 *
 * @returns {{uploadDir: string, maxFileSize: number, gymName: string}}
 *
 * @example
 *   process.env.UPLOAD_DIR = '/tmp/uploads';
 *   process.env.MAX_FILE_SIZE_MB = '10';
 *   process.env.GYM_NAME = 'FitClub';
 *   getUploadConfig();
 *   // { uploadDir: '/tmp/uploads', maxFileSize: 10485760, gymName: 'FitClub' }
 */
function getUploadConfig() {
  // TODO: 實作此函式
  // 提示：用 || 給預設值；MAX_FILE_SIZE_MB 是字串，記得先 Number() 轉型再換算 bytes
}
```

### Step 4：測試你的程式碼

```bash
# 執行快速測試（同學自行練習）
npm start

# 執行完整 Jest 測試（繳交作業前需整體通過）
npm test
```

（這個部分的詳細可參照下方 **驗證與測試** 的說明）

---

## 主線任務

### 【任務一：讀取上傳設定】

* 函式：`getUploadConfig()`
* 從 `process.env` 讀取上傳相關設定，有預設值
* 回傳 `{ uploadDir, maxFileSize, gymName }`

### 【任務二：取副檔名】

* 函式：`getFileExtension(filename)`
* 從檔名取副檔名，一律回小寫帶 .（例：`.jpg`）
* 沒有副檔名回空字串，多個 . 只取最後一個

### 【任務三：解析檔案 metadata】

* 函式：`parseFileMetadata(file)`
* `file` 物件是從 formidable 解析
* 回傳 `{ filename, sizeKB, ext }`

### 【任務四：產出 log 字串】

* 函式：`formatUploadLog(meta, config)`
* 組出一行上傳紀錄字串

### 【任務五：路由分派】

* 函式：`router(req, res, config)`
* 依 method + url 分派請求，處理上傳、錯誤回應與 404

### 【任務六：建立上傳 server】

* 函式：`createUploadServer(config)`
* 建立 HTTP server，把每個 request 交給 `router`
* 回傳 server instance（不需 `server.listen()`）


---

## 驗證與測試

### 【驗證】

驗證部分提供給同學在作業進行中或撰寫完成後**自行練習**，透過實際發送 request、觀察回應結果，也能更直觀地了解 API 的運作方式。

使用前需先執行 `npm start` 啟動本地 server。

**方式一：curl**

透過指令 `curl -F "file=@fixtures/sample.jpg" http://localhost:3000/coaches/avatar` 來進行驗證。

**方式二：Postman**

- Method：`POST`、URL：`http://localhost:3000/coaches/avatar`
- 點選 Body -> 再點擊 `form-data`
- 表格部分 Key 名稱輸入 file，類型要選擇 File（預設為 Text）
- Value 部分選擇一個圖片檔案（如果有出現警示符號 -> 可參考 [Week2 Postman 圖片出現警示符號教學](https://hackmd.io/@hexschool/H1ddhaflzg)）
- 最後按下 Postman 視窗右方的 Send 按鈕

方式一、方式二執行後可看看圖片上傳功能是否正確運作，若上傳成功則會顯示回傳的檔案資訊（`{ "filename": "...", "sizeKB": ..., "ext": "...", "savedPath": "..." }`）

### 【測試】

**作業繳交前必須通過**，執行 `npm test` 來確認各個測試項目。

測試結果條列：

- ✓ 表示測試通過
- ✕ 表示測試失敗

看到 `Tests: 14 passed, 14 total` 即代表全數通過。

**測試項目（共 14 項）：**

| 群組 | 測試數量 |
|---|---|
| 任務一：getUploadConfig | 2 |
| 任務二：getFileExtension | 4 |
| 任務三：parseFileMetadata | 2 |
| 任務四：formatUploadLog | 1 |
| 任務六：createUploadServer| 5 |

---

## 繳交方式

1. 完成 index.js 中的所有函式
2. 執行 npm test 確保所有測試通過
3. 將程式碼上傳至 GitHub
4. 提交 GitHub 連結

---

## 常見問題

**Q：curl 送檔後 response 是 `{"error": "..."}`？**
A：可能是你用的 field name 不是 `file`。`curl -F "file=@..."` 的 `file` 是 formidable 預期的欄位名。

**Q：`files.file[0]` 還是 `files.file`？**
A：formidable v3 預設把同名檔案包成陣列（因為 multipart 允許同 key 多檔），所以是 `files.file[0]`。

**Q：為什麼 `uploadDir` 用 `/tmp/...` 而不是專案目錄？**
A：兩個原因：(1) 專案目錄不應被上傳的檔案污染，即使 `.gitignore` 有排除，本機仍容易混亂、(2) `/tmp` 是系統暫存目錄，適合存放不需永久保留的檔案。實務上後端收完檔案通常也是存暫存目錄後再轉到雲端儲存（如 S3）。

**Q：測試 timeout？**
A：`Jest` 預設 test timeout 5 秒，supertest 發 multipart 通常很快，如果出現 timeout 多半是 server 沒回應（路由判斷錯、忘了 `res.end()`）。檢查每個分支都有 `res.end()`。
