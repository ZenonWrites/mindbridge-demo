import { io } from 'socket.io-client';
export const API = process.env.NEXT_PUBLIC_API || 'http://localhost:4000';
let s; export const sock = () => s || (s = io(API));
