import 'dotenv/config';
import app from './app.ts';

import fs from 'node:fs';

const PORT = Number(process.env.PORT) || 3000;
const uploadDir = process.env.UPLOAD_DIR || '/tmp/uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.listen(PORT, () => {
  console.log('========================================');
  console.log('🏋️  健身房會員管理 API');
  console.log(`📁 上傳目錄：${uploadDir}`);
  console.log('========================================');
  console.log(`✅ Server listening on http://localhost:${PORT}`);
  console.log(`📘 Swagger UI: http://localhost:${PORT}/docs`);
  console.log('');
});
