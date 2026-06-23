import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { filterVIP, getGymConfig, getVIPSummary, readMembers, sumCredits } from './index';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, 'fixtures');
const MEMBERS_PATH = path.join(FIXTURES, 'members.json');

describe('任務一：readMembers', () => {
  test('能讀取 JSON 並回傳陣列', async () => {
    const result = await readMembers(MEMBERS_PATH);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(4);
    expect(result[0].name).toBe('小華');
    expect(result[0].level).toBe('VIP');
  });
});

describe('任務二：filterVIP', () => {
  test('只回傳 VIP 會員', () => {
    const input = [
      { name: '小華', level: 'VIP' },
      { name: '小美', level: 'normal' },
      { name: '阿強', level: 'VIP' },
    ];
    const result = filterVIP(input);
    expect(result).toHaveLength(2);
    expect(result.every((m) => m.level === 'VIP')).toBe(true);
  });

  test('不修改原陣列', () => {
    const input = [
      { name: '小華', level: 'VIP' },
      { name: '小美', level: 'normal' },
    ];
    const snapshot = JSON.stringify(input);
    filterVIP(input);
    expect(JSON.stringify(input)).toBe(snapshot);
  });
});

describe('任務三：sumCredits', () => {
  test('加總點數', () => {
    expect(sumCredits([{ credits: 120 }, { credits: 30 }])).toBe(150);
    expect(sumCredits([{ credits: 120 }, { credits: 30 }, { credits: 0 }])).toBe(150);
  });

  test('空陣列回傳 0', () => {
    expect(sumCredits([])).toBe(0);
  });
});

describe('任務四：getGymConfig', () => {
  const ENV_KEYS = ['GYM_NAME', 'ADMIN_NAME', 'DEFAULT_MEMBERS_PATH'];
  const ORIGINAL_ENV = {};

  beforeAll(() => {
    for (const key of ENV_KEYS) {
      ORIGINAL_ENV[key] = process.env[key];
    }
  });

  afterAll(() => {
    for (const key of ENV_KEYS) {
      if (ORIGINAL_ENV[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = ORIGINAL_ENV[key];
      }
    }
  });

  beforeEach(() => {
    for (const key of ENV_KEYS) {
      delete process.env[key];
    }
  });

  test('env 都有設時回傳正確值', () => {
    process.env.GYM_NAME = 'FitClub';
    process.env.ADMIN_NAME = 'Leo';
    process.env.DEFAULT_MEMBERS_PATH = './fixtures/members.json';

    const config = getGymConfig();
    expect(config.gymName).toBe('FitClub');
    expect(config.adminName).toBe('Leo');
    expect(config.defaultMembersPath).toBe('./fixtures/members.json');
  });

  test('env 沒設時回傳預設值', () => {
    const config = getGymConfig();
    expect(config.gymName).toBe('未命名健身房');
    expect(config.adminName).toBe('尚未指派');
    expect(config.defaultMembersPath).toBeUndefined();
  });
});

describe('任務五：getVIPSummary', () => {
  test('回傳 VIP 會員摘要', async () => {
    const summary = await getVIPSummary(MEMBERS_PATH);
    expect(summary.count).toBe(2);
    expect(summary.totalCredits).toBe(320);
    expect(summary.names).toContain('小華');
    expect(summary.names).toContain('阿強');
    expect(summary.names).not.toContain('小美');
    expect(summary.names).not.toContain('小明');
  });
});
