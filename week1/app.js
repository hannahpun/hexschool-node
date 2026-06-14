import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getGymConfig, getVIPSummary } from './index.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const config = getGymConfig();

  console.log('========================================');
  console.log(`🏋️  歡迎來到 ${config.gymName}`);
  console.log(`👤 今日管理員：${config.adminName}`);
  console.log('========================================');

  const membersPath = config.defaultMembersPath || path.join(__dirname, 'fixtures', 'members.json');

  const summary = await getVIPSummary(membersPath);

  console.log('');
  console.log('📊 VIP 會員統計');
  console.log(`   人數：${summary.count}`);
  console.log(`   總點數：${summary.totalCredits}`);
  console.log(`   名單：${summary.names.join('、')}`);
  console.log('');
}

main();
