import { Router } from 'express';
import { z } from 'zod';
import initialMembers from '../fixtures/members.json' with { type: 'json' };
import { validate } from '../middlewares/validate.ts';

const router: Router = Router();
// ───────────────────────────────────────────────────────────
// Schemas
// ───────────────────────────────────────────────────────────
const levelEnum = z.enum(['VIP', 'normal']);

const listQuerySchema = z.object({
  level: levelEnum.optional(),
});

const createMemberSchema = z.object({
  name: z.string(),
  level: levelEnum,
});

const updateMemberSchema = z.object({
  name: z.string().optional(),
  level: levelEnum.optional(),
});

// ───────────────────────────────────────────────────────────
// TODO 任務一：初始化 state + 內部 helpers
// ───────────────────────────────────────────────────────────

type member = {
  id: number;
  name: string;
  level: string;
};
// 1. 複製 initialMembers，不直接改外部陣列
const members: member[] = [...initialMembers];

// 2. 下一個新增會員要使用的 id
let nextId = 5;
// 3. 兩個內部 helper 函式

// 函式一：filterByQuery(list, query)：
// - 依據 query.level 篩選，沒帶就回全部
// - 任務二的 GET / 會使用到這個函式

function filterByQuery(list: member[], query: string) {
  if (!query) return list;
  return list.filter((item) => item.level === query);
}

// 函式二：validateBody(body)
// 我寫在 utils/validate/

function findIndexById(list: { id: number }[], id: string) {
  return list.findIndex((item) => item.id === Number(id));
}
// 此 router 掛在 app.js 的 '/members'，以下路由皆帶此前綴。舉例來說：
// - router.get('/') → GET /members
// - router.get('/:id') → GET /members/:id

// ───────────────────────────────────────────────────────────
// TODO 任務二：GET / 和 GET /:id
// ───────────────────────────────────────────────────────────

// GET /
// - 輸入：req.query.level 可帶 'VIP' | 'normal'（選填）
// - 輸出：200 + [{ id, name, level }, ...]
// - 提示：filterByQuery(members, req.query)

router.get('/', validate('query', listQuerySchema), (req, res) => {
  const { level } = req.query;
  res.json(filterByQuery(members, level as string));
});

// GET /:id
// - 輸入：req.params.id（string，需使用 Number() 轉換）
// - 輸出：200 + { id, name, level }，或 404 + { error: '會員不存在' }（找不到時）
// - 提示：members.find，找不到時結果是 undefined

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const memberIdx = findIndexById(members, id as string);
  if (memberIdx === -1) {
    res.status(404).json({
      error: '會員不存在',
    });
    return;
  }
  res.json(members[memberIdx]);
});
// ───────────────────────────────────────────────────────────
// TODO 任務三：POST /
// ───────────────────────────────────────────────────────────

// POST /
// - 輸入：body = { name: string, level: 'VIP' | 'normal' }
// - 輸出：201 + 新會員物件（id 自動配），或 400 + { error: '缺 name 或 level' }（驗證失敗）
// - 提示：validateBody(req.body) 驗證；通過後用 spread 將 req.body 的欄位與 nextId 自動遞增的 id 合為新物件，push 進 members
// - 範例：POST /members body { name: '阿文', level: 'VIP' } → 201 { id: 5, name: '阿文', level: 'VIP' }

router.post('/', validate('body', createMemberSchema), (req, res) => {
  const { name, level } = req.body;
  const newMember = {
    id: nextId++,
    name,
    level,
  };
  // save data in db
  members.push(newMember);
  res.status(201).json(newMember);
});

// ───────────────────────────────────────────────────────────
// TODO 任務四：PUT /:id 和 DELETE /:id
// ───────────────────────────────────────────────────────────

// PUT /:id
// - 輸入：req.params.id（string，需 Number() 轉換）、body（部分欄位，例如只傳 { level: 'normal' }）
// - 輸出：200 + merge 後的會員，或 404 + { error: '會員不存在' }（找不到時）
// - 提示：members.findIndex 找索引，-1 回應 404；找到索引則使用 spread 合併 members[idx] 與 req.body（req.body 需注意順序來覆蓋舊欄位），最後將結果存回 members[idx]
// - 範例：PUT /members/1 body { level: 'normal' } → 200 { id: 1, name: '小華', level: 'normal' }（name 被保留）

router.put('/:id', validate('body', updateMemberSchema), (req, res) => {
  const { id } = req.params;
  const memberIdx = findIndexById(members, id as string);
  if (memberIdx === -1) {
    res.status(404).json({
      error: '會員不存在',
    });
    return;
  }
  // update db
  members[memberIdx] = {
    ...members[memberIdx],
    ...req.body,
  };
  res.json(members[memberIdx]);
});

// DELETE /:id
// - 輸入：req.params.id（string，需 Number() 轉換）
// - 輸出：204（無 body），或 404 + { error: '會員不存在' }（找不到時）
// - 提示：members.findIndex 找索引，-1 回應 404；找到索引則 splice 移除，再設定 status 204 並以 .end() 結束回應（204 不帶 body）
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const memberIdx = findIndexById(members, id as string);
  if (memberIdx === -1) {
    res.status(404).json({
      error: '會員不存在',
    });
    return;
  }
  // update db
  members.splice(memberIdx, 1);
  res.status(204).send();
});

export default router;
