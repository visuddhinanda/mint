/**
 * 团队空间下各模块的可用性。
 *
 * 团队空间 = 以某个 group 为 owner 浏览资源。后端只有迁到 v3 的资源才认
 * 「owner 是 group、成员按角色拥有权限」，所以模块要等它的资源迁完才能开放。
 * 每迁完一个，就把它的路由 id 从 NOT_YET_SUPPORTED 删掉；全部删完后这一组连同
 * 菜单上的置灰逻辑一起去掉，只留 PERSONAL_ONLY。
 *
 * 值是路由的 handle.id，前缀匹配（`workspace.task` 同时覆盖 `workspace.task.list`）。
 */

/** 只属于个人、团队空间下永远不可用 */
const PERSONAL_ONLY = [
  "workspace.settings",
  "workspace.recent",
  "workspace.dict",
  "workspace.invite",
  "workspace.transfer",
];

/** 可以团队化、但资源还没迁到 v3，暂不可用 */
const NOT_YET_SUPPORTED = [
  "workspace.article",
  "workspace.anthology",
  "workspace.channel",
  "workspace.term",
  "workspace.course",
  "workspace.task",
  "workspace.tag",
  "workspace.driver",
];

export type TeamspaceAvailability = "available" | "personal" | "unsupported";

const matches = (routeId: string, list: string[]) =>
  list.some((id) => routeId === id || routeId.startsWith(id + "."));

/** 某个路由在团队空间下能不能用；没有 id 的路由一律可用 */
export function teamspaceAvailability(
  routeId: string | undefined
): TeamspaceAvailability {
  if (!routeId) {
    return "available";
  }
  if (matches(routeId, PERSONAL_ONLY)) {
    return "personal";
  }
  if (matches(routeId, NOT_YET_SUPPORTED)) {
    return "unsupported";
  }
  return "available";
}

/** 不可用时给用户看的提示文案的 i18n id */
export const TEAMSPACE_HINT: Record<
  Exclude<TeamspaceAvailability, "available">,
  string
> = {
  personal: "labels.teamspace.personal-only",
  unsupported: "labels.teamspace.unsupported",
};
