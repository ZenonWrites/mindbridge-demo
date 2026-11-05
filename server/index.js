const express = require('express'), cors = require('cors'), http = require('http');
const { Server } = require('socket.io');
const { providers } = require('./data'), { moderate } = require('./moderate');

const app = express(); app.use(cors(), express.json());
const bookings = [], flags = [], rooms = {}; // in-memory store (swap for MongoDB later)
const hist = (r) => rooms[r] || (rooms[r] = []);

const srv = http.createServer(app);
const io = new Server(srv, { cors: { origin: '*' } });

app.get('/api/providers', (_q, r) => r.json(providers));
app.get('/api/bookings', (_q, r) => r.json(bookings));
app.post('/api/bookings', (q, r) => {
  const b = { id: 'bk_' + Date.now(), status: 'Upcoming', ...q.body };
  bookings.push(b); io.to('providers').emit('booking', b); r.json(b); // provider tab sees it live
});

io.on('connection', (s) => {
  // One room per booking: the user tab and the provider tab each join the same room.
  s.on('join', ({ room, role }) => {
    if (role === 'provider') s.join('providers');
    if (room) { s.join(room); s.emit('history', hist(room)); }
  });
  s.on('msg', ({ room, from, text }) => {
    const r = moderate(String(text).slice(0, 1000), from); // server-side moderation (2nd layer)
    const m = { id: Date.now() + Math.random(), from, text: r.text, blocked: r.blocked, t: Date.now() };
    if (r.blocked) return s.emit('msg', m); // only the sender sees the notice; nothing stored or broadcast
    hist(room).push(m); io.to(room).emit('msg', m);
    if (r.selfHarm) io.to(room).emit('crisis', { by: 'auto' }); // support, not censorship
  });
  s.on('flag', ({ room, by, reason }) => { flags.push({ room, by, reason, at: Date.now(), status: 'audit_requested' }); io.to(room).emit('flag', { by }); });
  s.on('crisis', ({ room }) => io.to(room).emit('crisis', { by: 'provider' }));
  s.on('referral', ({ room, amount }) => io.to(room).emit('referral', { voucher: 'MB-T3-OFF', amount: amount || 500 }));
});
srv.listen(4000, () => console.log('API + sockets on :4000'));
