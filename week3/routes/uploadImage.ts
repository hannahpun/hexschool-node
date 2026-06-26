import { Router } from 'express';

import formidable from 'formidable';
import fs from 'node:fs';

const uploadDir = process.env.UPLOAD_DIR || '/tmp/uploads';
const maxFileSize = (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024;

fs.mkdirSync(uploadDir, { recursive: true });

const router: Router = Router();

// ───────────────────────────────────────────────────────────
// TODO 任務五：POST /
//   （實際 URL 是 /uploadImage，因為 app.js 把這個 router 掛在 '/uploadImage'）
// ───────────────────────────────────────────────────────────

// POST /
// - 輸入：multipart/form-data，field 名稱 `image`
// - 輸出：200 + { filename: file.originalFilename, sizeKB: Math.round(file.size / 1024), savedPath: file.filepath }，或 400 + { error: 'No file uploaded' }（沒帶 image）
// - 提示：建立 formidable 實例（uploadDir、keepExtensions: true、maxFileSize），用 form.parse(req, (err, fields, files) => { ... }) 解析，其中 err 不為 null 時回 500 + { error: err.message }
// - 注意：formidable v3 的 files.image 為陣列，需以 Array.isArray 判斷並取 [0]

router.post('/', (req, res) => {
  const form = formidable({
    uploadDir: uploadDir,
    maxFileSize: maxFileSize,
    keepExtensions: true,
  });

  form.parse(req, (err, _, files) => {
    if (err) {
      res.status(500).json({
        error: err.message,
      });
      return;
    }

    const file = files.image?.[0];
    if (!file) {
      res.status(400).json({
        error: '沒帶檔案',
      });
      return;
    }
    res.json({
      filename: file.originalFilename,
      sizeKB: Math.round(file.size / 1024),
      savedPath: file.filepath,
    });
  });
});
export default router;
