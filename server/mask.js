// Server-side privacy mask (second layer; the client masks first). A deterrent, not a guarantee.
const URL_RE = /(?:https?:\/\/|www\.)\S+/gi;
const UPI_RE = /[\w.\-]{2,}@[a-z]{2,}/gi;
const PHONE_RE = /(?:\+?91[\s-]?)?(?:\d[\s-]?){10}/g;
const TAG = '[Blocked for Privacy]';
exports.mask = (t) => t.replace(URL_RE, TAG).replace(UPI_RE, TAG).replace(PHONE_RE, TAG);
