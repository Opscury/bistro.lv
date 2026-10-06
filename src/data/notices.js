// "Aktuāli" rāmji no admina: ja lapai adminā ir Instagram ieraksts, rāmis
// rāda to plakāta/teksta vietā. notices.json atjauno scripts/snapshot.mjs
// pirms katras būves; ja serveris nav sasniedzams, paliek iepriekšējais.

import live from "./notices.json";

export function liveNotice(base, page) {
  const post = live.pages?.[page];
  if (!post?.instagram) return base;
  return {
    label: base.label,
    meta: base.meta,
    link: base.link,
    instagram: { url: post.instagram, captioned: post.captioned },
  };
}
