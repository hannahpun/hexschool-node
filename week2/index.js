const http = require('node:http');
const fs = require('node:fs');
const { formidable } = require('formidable'); // formidable v3 用 named import
require('dotenv').config();

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
  return {
    uploadDir: process.env.UPLOAD_DIR || '/tmp',
    maxFileSize: (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024,
    gymName: process.env.GYM_NAME || '未命名健身房',
  };
}

// ========== 任務二：取副檔名 ==========
/**
 * 從檔名取副檔名，一律回小寫帶 `.`。
 *
 * 規則：
 *   - 'cat.jpg' → '.jpg'
 *   - 'PHOTO.JPG' → '.jpg'（一律小寫）
 *   - 'README' → ''（沒有副檔名）
 *   - 'archive.tar.gz' → '.gz'（只取最後一個）
 *
 * @param {string} filename
 * @returns {string}
 *
 * @example
 *   getFileExtension('cat.jpg');     // '.jpg'
 *   getFileExtension('PHOTO.JPG');   // '.jpg'
 *   getFileExtension('README');      // ''
 */
function getFileExtension(filename) {
  return filename.match(/\.([^.]+)$/)?.[0].toLowerCase() ?? '';
}

// ========== 任務三：解析檔案 metadata ==========
/**
 * 吃 formidable 解析後的 file 物件，回傳整理好的 metadata。
 *
 * formidable 的 file 物件至少有：
 *   - originalFilename: 原始檔名
 *   - size: 檔案 byte 數
 *
 * 回傳：
 *   - filename: 原始檔名
 *   - sizeKB: 檔案大小換成 KB（四捨五入，用 Math.round）
 *   - ext: 副檔名（用任務二的 getFileExtension）
 *
 * @param {{originalFilename: string, size: number}} file
 * @returns {{filename: string, sizeKB: number, ext: string}}
 *
 * @example
 *   parseFileMetadata({ originalFilename: 'leo.jpg', size: 250000 });
 *   // { filename: 'leo.jpg', sizeKB: 244, ext: '.jpg' }
 */
function parseFileMetadata(file) {
  return {
    filename: file.originalFilename,
    sizeKB: Math.round(file.size / 1024),
    ext: getFileExtension(file.originalFilename),
  };
}

// ========== 任務四：產出 upload log 字串 ==========
/**
 * 吃 metadata + config，產出一行 log 字串。
 *
 * 格式：`[{gymName}] Uploaded {filename} ({sizeKB} KB) → {uploadDir}`
 *
 * @param {{filename: string, sizeKB: number}} meta
 * @param {{uploadDir: string, gymName: string}} config
 * @returns {string}
 *
 * @example
 *   formatUploadLog(
 *     { filename: 'leo.jpg', sizeKB: 245, ext: '.jpg' },
 *     { uploadDir: '/tmp/uploads', gymName: 'FitClub' }
 *   );
 *   // '[FitClub] Uploaded leo.jpg (245 KB) → /tmp/uploads'
 */
function formatUploadLog(meta, config) {
  return `[${config.gymName}] Uploaded ${meta.filename} (${meta.sizeKB} KB) → ${config.uploadDir}`;
}

// ========== 任務五：路由分派 ==========
/**
 * 吃 HTTP request / response / config，依 method + url 分派到對應處理邏輯。
 *
 * 規格：
 *   - POST /coaches/avatar：
 *     * 用 formidable 解析 multipart/form-data
 *     * 成功 → 回 200 + JSON { filename, sizeKB, ext, savedPath }
 *     * formidable 解析錯誤（含超過 maxFileSize）→ 回 500 + JSON { error }
 *     * 沒 file 欄位 → 回 400 + JSON { error: 'No file uploaded' }
 *   - 其他路徑 → 回 404 + JSON { error: 'Not Found' }
 *
 * formidable 設定：
 *   - uploadDir / maxFileSize 從 config 取
 *   - keepExtensions: true
 *
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {{uploadDir: string, maxFileSize: number, gymName: string}} config
 * @returns {void} 直接操作 res 回寫、不 return 值
 *
 * @example
 *   // 在 createUploadServer 裡：
 *   http.createServer((req, res) => router(req, res, config))
 */

const sendJSON = (res, statusCode, data) => {
  if (res.headersSent) return; // 避免重複回應
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

function handleUpload(req, res, config) {
  const form = formidable({
    uploadDir: config.uploadDir,
    maxFileSize: config.maxFileSize,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      sendJSON(res, 500, { error: err.message });
      return;
    }

    const file = files.file?.[0];
    if (!file) {
      sendJSON(res, 400, { error: 'No file uploaded' });
      return;
    }
    const meta = parseFileMetadata(file);

    sendJSON(res, 200, {
      filename: meta.filename,
      sizeKB: meta.sizeKB,
      ext: meta.ext,
      savedPath: file.filepath,
    });
  });
}

function handleNotFound(req, res) {
  sendJSON(res, 404, { error: 'Not Found' });
}

function router(req, res, config) {
  if (req.method === 'POST' && req.url === '/coaches/avatar') {
    handleUpload(req, res, config);
    return;
  }

  handleNotFound(req, res);
}
// ========== 任務六：建立上傳 server ==========
/**
 * 建 http.Server、把每個 request 交給 router。
 *
 * 規格：
 *   - 如果 config.uploadDir 不存在，用 fs.mkdirSync(uploadDir, { recursive: true }) 自動建
 *   - http.createServer(...) 把 request 交給 router(req, res, config)
 *   - 回傳 server instance（不要 server.listen()，那是 app.js 的責任）
 *
 * @param {{uploadDir: string, maxFileSize: number}} config
 * @returns {http.Server}
 *
 * @example
 *   const server = createUploadServer({ uploadDir: '/tmp', maxFileSize: 5 * 1024 * 1024 });
 *   server.listen(3000);  // ← 這行由 app.js 呼叫
 */
function createUploadServer(config) {
  if (!fs.existsSync(config.uploadDir)) {
    fs.mkdirSync(config.uploadDir, { recursive: true });
  }
  return http.createServer((req, res) => router(req, res, config));
}

module.exports = {
  getUploadConfig,
  getFileExtension,
  parseFileMetadata,
  formatUploadLog,
  router,
  createUploadServer,
};
