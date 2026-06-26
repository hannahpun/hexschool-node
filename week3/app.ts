import cors from 'cors';
import express, { type Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './fixtures/swagger.json' with { type: 'json' };
import membersRouter from './routes/members.ts';
import uploadImage from './routes/uploadImage.ts';

const app: Express = express();

app.use(cors());
app.use(express.json());
// ───────────────────────────────────────────────────────────
// TODO 任務六：依序掛上 middleware 與 router（注意順序）
// ───────────────────────────────────────────────────────────
//
//   1. 解跨域（cors middleware，必須在所有路由之前）
//   2. 解析 JSON body（否則 POST / PUT 的 req.body 會是 undefined）
//   3. 掛載 Swagger UI（已預先提供如下，同學不需調整）：
//      app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
//   4. 把 membersRouter 掛載到 '/members' 路徑下
//   5. 把 uploadImageRouter 掛載到 '/uploadImage' 路徑下
//
// ✅ 未匹配的路由（如 GET /unknown）Express 預設會回 404，不需另外加 middleware
//
// ⚠️ **最後不需呼叫 app.listen()** — 這個部分交由 server.js 負責（分離「組裝」跟「啟動」，這樣 test.js 可以 supertest 直接戳 app、不佔 port）。
app.use('/members', membersRouter);
app.use('/uploadImage', uploadImage);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

export default app;
