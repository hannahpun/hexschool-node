require('dotenv').config();

const {
  getUploadConfig,
  createUploadServer,
} = require('./index');

const config = getUploadConfig();
const PORT = Number(process.env.PORT) || 3000;

console.log('========================================');
console.log(`🏋️  ${config.gymName} 大頭照上傳 API`);
console.log(`📁 上傳目錄：${config.uploadDir}`);
console.log(`📏 最大檔案：${config.maxFileSize / 1024 / 1024} MB`);
console.log('========================================');

const server = createUploadServer(config);

server.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
  console.log('');
  console.log('測試方式：');
  console.log(`  curl -F "file=@fixtures/sample.jpg" http://localhost:${PORT}/coaches/avatar`);
  console.log('');
});
