const request = require('supertest');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');

const {
  getUploadConfig,
  getFileExtension,
  parseFileMetadata,
  formatUploadLog,
  createUploadServer,
} = require('./index');

const FIXTURES = path.join(__dirname, 'fixtures');
const SAMPLE_JPG = path.join(FIXTURES, 'sample.jpg');

// ---------- 任務一：getUploadConfig ----------
describe('任務一：getUploadConfig', () => {
  const ENV_KEYS = ['UPLOAD_DIR', 'MAX_FILE_SIZE_MB', 'GYM_NAME'];
  const ORIGINAL_ENV = {};

  beforeAll(() => {
    for (const key of ENV_KEYS) ORIGINAL_ENV[key] = process.env[key];
  });

  afterAll(() => {
    for (const key of ENV_KEYS) {
      if (ORIGINAL_ENV[key] === undefined) delete process.env[key];
      else process.env[key] = ORIGINAL_ENV[key];
    }
  });

  beforeEach(() => {
    for (const key of ENV_KEYS) delete process.env[key];
  });

  test('env 都有設時回傳正確值', () => {
    process.env.UPLOAD_DIR = '/tmp/test-upload';
    process.env.MAX_FILE_SIZE_MB = '10';
    process.env.GYM_NAME = 'FitClub';

    const config = getUploadConfig();
    expect(config.uploadDir).toBe('/tmp/test-upload');
    expect(config.maxFileSize).toBe(10 * 1024 * 1024);
    expect(config.gymName).toBe('FitClub');
  });

  test('env 都沒設時回傳預設值', () => {
    const config = getUploadConfig();
    expect(config.uploadDir).toBe('/tmp');
    expect(config.maxFileSize).toBe(5 * 1024 * 1024);
    expect(config.gymName).toBe('未命名健身房');
  });
});

// ---------- 任務二：getFileExtension ----------
describe('任務二：getFileExtension', () => {
  test('一般檔名取小寫副檔名', () => {
    expect(getFileExtension('cat.jpg')).toBe('.jpg');
    expect(getFileExtension('report.pdf')).toBe('.pdf');
  });

  test('大小寫統一轉小寫', () => {
    expect(getFileExtension('PHOTO.JPG')).toBe('.jpg');
    expect(getFileExtension('Doc.PDF')).toBe('.pdf');
  });

  test('沒有副檔名回空字串', () => {
    expect(getFileExtension('README')).toBe('');
    expect(getFileExtension('Makefile')).toBe('');
  });

  test('多個 . 只取最後一個', () => {
    expect(getFileExtension('archive.tar.gz')).toBe('.gz');
  });
});

// ---------- 任務三：parseFileMetadata ----------
describe('任務三：parseFileMetadata', () => {
  test('回傳 filename / sizeKB / ext', () => {
    const file = { originalFilename: 'leo.jpg', size: 250000 };
    const meta = parseFileMetadata(file);

    expect(meta.filename).toBe('leo.jpg');
    expect(meta.sizeKB).toBe(Math.round(250000 / 1024));
    expect(meta.ext).toBe('.jpg');
  });

  test('sizeKB 四捨五入', () => {
    expect(parseFileMetadata({ originalFilename: 'a.png', size: 1024 }).sizeKB).toBe(1);
    expect(parseFileMetadata({ originalFilename: 'b.png', size: 1536 }).sizeKB).toBe(2);
    expect(parseFileMetadata({ originalFilename: 'c.png', size: 512 }).sizeKB).toBe(1);
  });
});

// ---------- 任務四：formatUploadLog ----------
describe('任務四：formatUploadLog', () => {
  test('log 字串包含必要資訊', () => {
    const meta = { filename: 'leo.jpg', sizeKB: 245, ext: '.jpg' };
    const config = { uploadDir: '/tmp/uploads', gymName: 'FitClub' };
    const log = formatUploadLog(meta, config);

    expect(log).toContain('FitClub');
    expect(log).toContain('leo.jpg');
    expect(log).toContain('245');
    expect(log).toContain('/tmp/uploads');
  });
});

// ---------- 任務六：createUploadServer ----------
describe('任務六：createUploadServer', () => {
  const tmpDir = os.tmpdir();
  const baseConfig = {
    uploadDir: tmpDir,
    maxFileSize: 5 * 1024 * 1024,
    gymName: 'TestGym',
  };

  test('GET / 回 404', async () => {
    const server = createUploadServer(baseConfig);
    const res = await request(server).get('/');

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  test('POST /unknown 回 404', async () => {
    const server = createUploadServer(baseConfig);
    const res = await request(server).post('/unknown');

    expect(res.status).toBe(404);
  });

  test('POST /coaches/avatar 上傳檔案成功', async () => {
    const server = createUploadServer(baseConfig);
    const res = await request(server)
      .post('/coaches/avatar')
      .attach('file', SAMPLE_JPG);

    expect(res.status).toBe(200);
    expect(res.body.filename).toBe('sample.jpg');
    expect(res.body.sizeKB).toBeGreaterThan(0);
    expect(res.body.ext).toBe('.jpg');
    expect(res.body.savedPath).toContain(tmpDir);
  });

  test('POST /coaches/avatar 超過 maxFileSize 回 500', async () => {
    const smallConfig = { ...baseConfig, maxFileSize: 1024 };  // 1KB
    const server = createUploadServer(smallConfig);
    const bigBuffer = Buffer.alloc(2048);  // 2KB > 1KB

    const res = await request(server)
      .post('/coaches/avatar')
      .attach('file', bigBuffer, 'big.jpg');

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });

  test('POST /coaches/avatar 沒附檔案回 400', async () => {
    const server = createUploadServer(baseConfig);
    const res = await request(server)
      .post('/coaches/avatar')
      .field('dummy', 'value');  // multipart 但沒有 file 欄位

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('No file uploaded');
  });
});
