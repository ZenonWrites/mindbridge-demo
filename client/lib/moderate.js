// Chat moderation: blocks contact sharing / off-platform solicitation / threats, masks profanity.
// Self-harm language is NEVER blocked (the person needs support); it triggers the crisis card instead.
const TAG = '[Blocked for Privacy]';
const NUM = { zero: 0, shunya: 0, one: 1, ek: 1, two: 2, three: 3, teen: 3, four: 4, char: 4, chaar: 4, five: 5, paanch: 5, panch: 5, six: 6, chhe: 6, seven: 7, saat: 7, eight: 8, aath: 8, nine: 9, nau: 9 };
const BAD = /\b(fuck\w*|shit|bitch|bastard|asshole|slut|madarchod|behenchod|bhosd\w*|chutiya\w*|randi|harami)\b/gi;
const THREAT = /\b(i('|\s?wi)ll|im going to|gonna) (kill|hurt|rape|stalk|find) you\b|\bsend (me )?nudes?\b|\b(sex|sleep) with me\b/i;
const OFFSITE = /\b(whats?\s?app|telegram|insta(gram)?|snapchat|gpay|google\s?pay|phone\s?pe|paytm|pay me directly)\b/i;
const SELF = /\b(kill myself|suicide|suicidal|end my life|want to die|wanna die|hurt myself|self[- ]?harm|better off dead|khudkushi|marna chahta|marna chahti)\b/i;
const NOTICE = 'Message not sent: contact details, off-platform contact or abusive content are not allowed here.';

function moderate(text, role) {
  let t = text.replace(/(?:https?:\/\/|www\.)\S+/gi, TAG).replace(/[\w.\-]+@[a-z]{2,}(\.[a-z]{2,})?/gi, TAG).replace(/(?:\+?91[\s-]?)?(?:\d[\s-]?){10}/g, TAG);
  const flags = t !== text ? ['contact'] : [];
  const norm = text.toLowerCase().replace(/[a-z]+/g, (w) => (Object.prototype.hasOwnProperty.call(NUM, w) ? ` ${NUM[w]} ` : w));
  if (/(?:\d[\s.,\-_]*){9,}/.test(norm)) flags.push('number'); // spelled-out or spaced digits
  if (OFFSITE.test(text)) flags.push('offsite');
  if (THREAT.test(text)) flags.push('threat');
  if (flags.some((f) => f !== 'contact')) return { blocked: true, text: NOTICE, flags, selfHarm: false };
  t = t.replace(BAD, (m) => '*'.repeat(m.length));
  return { blocked: false, text: t, flags, selfHarm: role === 'user' && SELF.test(text) };
}
export { moderate };
