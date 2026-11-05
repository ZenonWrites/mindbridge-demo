// Client-side privacy mask (first layer). Server re-applies the same rules.
const TAG = '[Blocked for Privacy]';
export const mask = (t) => t
  .replace(/(?:https?:\/\/|www\.)\S+/gi, TAG)
  .replace(/[\w.\-]{2,}@[a-z]{2,}/gi, TAG)
  .replace(/(?:\+?91[\s-]?)?(?:\d[\s-]?){10}/g, TAG);
