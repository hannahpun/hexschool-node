// ESM 模式下 jest 不會自動把 `jest` 物件掛成全域變數，
// 測試檔用到 jest.resetModules()，這裡手動補上全域。
import { jest } from '@jest/globals';

globalThis.jest = jest;
