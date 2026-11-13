import { test, expect, type Page } from '@playwright/test';
import { call } from '../lib/api.js';
import { collect } from '../lib/collect.js';
import { USER, shotDir } from '../lib/env.js';

/**
 * 团队空间（P0）：头像弹窗里切到团队空间、顶栏标签、菜单置灰、直接访问被拦、
 * 刷新后保持、切回个人空间、localStorage 里的过期团队被清掉。
 *
 * 团队空间 = 以某个 group 为 owner 浏览资源。P0 阶段所有可团队化的模块都还没迁 v3，
 * 所以切过去之后它们一律置灰；随各资源迁完再逐个改这里的断言。
 */
const SHOT = shotDir('teamspace');
const TEAM = 'e2e 团队空间';

const shot = (page: Page, name: string) =>
  page.screenshot({ path: `${SHOT}/${name}.png`, fullPage: true });
const badge = (page: Page) => page.getByTestId('teamspace-badge');
const menuItem = (page: Page, label: string) =>
  page.locator('.ant-layout-sider .ant-menu-item').filter({ hasText: label });
const stored = (page: Page) => page.evaluate(() => localStorage.getItem('teamspace'));

let teamId = '';

test.beforeAll(async ({ request }) => {
  // 测试账号名下建一个团队；已存在时后端回 ok:false，忽略即可（本地测试数据保留不删）
  await call(request, 'POST', '/v2/group', { name: TEAM, studio_name: USER });
  const { body } = await call(request, 'GET', '/v2/group-member?view=user');
  const rows = (body?.data?.rows ?? []) as { group?: { id: string; name: string } }[];
  teamId = rows.find((row) => row.group?.name === TEAM)?.group?.id ?? '';
  expect(teamId, '测试账号应当是该团队的成员').not.toBe('');
});

test.describe('团队空间切换', () => {
  test('切过去、菜单置灰、直接访问被拦、刷新保持、切回个人', async ({ page }) => {
    const log = collect(page);

    await test.step('1. 头像弹窗里选团队', async () => {
      await page.goto('workspace', { waitUntil: 'networkidle' });
      await page.evaluate(() => localStorage.removeItem('teamspace'));
      await page.reload({ waitUntil: 'networkidle' });
      await expect(badge(page)).toHaveCount(0);

      await page.locator('.ant-layout-sider .ant-avatar').first().hover();
      const popover = page.locator('.ant-popover:visible');
      await popover.getByText('切换到团队空间').click();
      await popover.getByText(TEAM, { exact: true }).click();

      await expect(badge(page)).toContainText(TEAM);
      expect(JSON.parse((await stored(page)) ?? '{}').id).toBe(teamId);
      await shot(page, '01-switched');
      log.dump('1. 切到团队空间');
    });

    await test.step('2. 主导航：可团队化与个人专属的模块置灰，全局模块照常', async () => {
      await expect(menuItem(page, '版本风格')).toHaveClass(/ant-menu-item-disabled/);
      await expect(menuItem(page, '术语')).toHaveClass(/ant-menu-item-disabled/);
      await expect(menuItem(page, '最近')).toHaveClass(/ant-menu-item-disabled/);
      await expect(menuItem(page, '主页')).not.toHaveClass(/ant-menu-item-disabled/);
      await shot(page, '02-menu');
    });

    await test.step('3. 直接输入地址也进不去', async () => {
      await page.goto('workspace/channel', { waitUntil: 'networkidle' });
      await expect(page.getByTestId('teamspace-blocked')).toContainText('该模块暂不支持团队空间');
      await expect(page.locator('.ant-table')).toHaveCount(0);
      await shot(page, '03-blocked');
    });

    await test.step('4. 刷新后仍在团队空间', async () => {
      await page.reload({ waitUntil: 'networkidle' });
      await expect(badge(page)).toContainText(TEAM);
      await expect(page.getByTestId('teamspace-blocked')).toBeVisible();
    });

    await test.step('5. 拦截页上切回个人空间', async () => {
      await page.getByTestId('teamspace-blocked').getByRole('button', { name: '切回个人空间' }).click();
      await expect(badge(page)).toHaveCount(0);
      await expect(page.locator('.ant-table')).toBeVisible();
      expect(await stored(page)).toBeNull();
      await shot(page, '05-personal');
      log.dump('5. 切回个人空间');
    });

    await test.step('6. 顶栏标签关掉也能切回个人空间', async () => {
      await page.evaluate(
        ([id, name]) =>
          localStorage.setItem('teamspace', JSON.stringify({ id, nickName: name, realName: id })),
        [teamId, TEAM],
      );
      await page.goto('workspace', { waitUntil: 'networkidle' });
      await expect(badge(page)).toBeVisible();
      await badge(page).locator('.ant-tag-close-icon').click();
      await expect(badge(page)).toHaveCount(0);
      expect(await stored(page)).toBeNull();
    });
  });

  test('localStorage 里已不是成员的团队会被清掉', async ({ page }) => {
    await page.goto('workspace', { waitUntil: 'networkidle' });
    await page.evaluate(() =>
      localStorage.setItem(
        'teamspace',
        JSON.stringify({
          id: '00000000-0000-4000-8000-000000000000',
          nickName: 'ghost',
          realName: '00000000-0000-4000-8000-000000000000',
        }),
      ),
    );
    await page.reload({ waitUntil: 'networkidle' });

    // group 列表回来后校验成员资格，不是成员就回到个人空间
    await expect(badge(page)).toHaveCount(0);
    await expect.poll(() => stored(page)).toBeNull();
  });
});
