/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  // 專案是 ESM（package.json "type": "module"），把 .ts 當成 ESM 處理
  extensionsToTreatAsEsm: ['.ts'],
  // 用 ts-jest 把 TypeScript 編成 ESM
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  // 原始碼裡用 .ts 副檔名 import，測試檔用 ./app.js → 把結尾的 .js 去掉，
  // 讓 jest 自己用 moduleFileExtensions 解析到對應的 .ts 檔
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/test.ts'],
  setupFilesAfterEnv: ['./jest.setup.js'],
};
