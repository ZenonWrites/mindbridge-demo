const express = require('express'), cors = require('cors'), http = require('http');
const { Server } = require('socket.io');
const { providers } = require('./data'), { mask } = require('./mask');

const app = express(); app.use(cors(), express.json());
const bookings = [], flags = [], messages = []; // in-memory store (swap for MongoDB later)

app.get('/api/providers', (_q, r) => r.json(providers));
app.get('/api/bookings', (_q, r) => r.json(bookings));
app.post('/api/bookings', (q, r) => {
  const b = { id: 'bk_' + Date.now(), status: 'Upcoming', ...q.body };
  bookings.push(b); r.json(b);
});

const srv = http.createServer(app);
const io = new Server(srv, { cors: { origin: '*' } });
io.on('connection', (s) => {
  s.join('demo'); // one demo room shared by User View and Provider View
  s.on('sync', () => s.emit('history', messages));
  s.on('msg', ({ from, text }) => {
    const m = { id: Date.now() + Math.random(), from, text: mask(String(text).slice(0, 1000)), t: Date.now() };
    messages.push(m); io.to('demo').emit('msg', m); // masked BEFORE persisting/broadcasting
  });
  s.on('flag', ({ by, reason }) => { flags.push({ by, reason, at: Date.now(), status: 'audit_requested' }); io.to('demo').emit('flag', { by }); });
  s.on('crisis', () => io.to('demo').emit('crisis'));
  s.on('referral', (r) => io.to('demo').emit('referral', { voucher: 'MB-T3-OFF', amount: r?.amount || 500 }));
});
srv.listen(4000, () => console.log('API + sockets on :4000'));
