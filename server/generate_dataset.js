import fs from 'fs';
import { execSync } from 'child_process';

const NUM_NORMAL_USERS = 500;
const NUM_ANOMALY_USERS = 10;
const BASE_URL = 'http://localhost:3001/api';

const firstNames = ["James","Mary","Robert","Patricia","John","Jennifer","Michael","Linda","David","Elizabeth","William","Barbara","Richard","Susan","Joseph","Jessica","Thomas","Sarah","Charles","Karen","Alice","Bob","Charlie","Diana","Eve","Frank","Grace","Hank","Ivy","Jack"];
const lastNames = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin"];
const domains = ["gmail.com","yahoo.com","hotmail.com","outlook.com","icloud.com"];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomIP() {
  return `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
}

async function request(endpoint, method = 'GET', data = null, token = null, ip = null) {
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (ip) headers['x-forwarded-for'] = ip; // Spoof IP for realistic log

  const options = {
    method,
    headers,
  };
  if (data) options.body = JSON.stringify(data);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    const json = await res.json();
    return { status: res.status, data: json };
  } catch (err) {
    return { status: 500, error: err.message };
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function simulateNormalUser(index) {
  const ip = randomIP();
  const firstName = randomChoice(firstNames);
  const lastName = randomChoice(lastNames);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${randomChoice(domains)}`;
  const password = "password123";
  const phone = `+668${Math.floor(Math.random()*90000000 + 10000000)}`;

  console.log(`[Normal] Registering user ${index}: ${email}`);
  
  // 1. Register
  let res = await request('/customer/register', 'POST', { email, password, firstName, lastName, phone }, null, ip);
  if (res.status !== 201) return;
  const token = res.data.token;
  const customerId = res.data.customer.id;

  await sleep(100);

  // 2. Create Reservation
  res = await request('/customer/reservations', 'POST', {
    date: `2026-10-${String(Math.floor(Math.random()*28)+1).padStart(2, '0')}`,
    time: "19:00",
    guests: Math.floor(Math.random() * 5) + 1,
    serviceType: "Dine-in"
  }, token, ip);
  
  if (res.status !== 201) return;
  const reservationId = res.data.reservation.id;

  await sleep(100);

  // 3. Normal Behavior: View own dashboard, profile, and reservation multiple times
  await request('/customer/reservations', 'GET', null, token, ip); // View Dashboard
  await sleep(50);
  await request(`/customer/profile/${customerId}`, 'GET', null, token, ip); // View Profile
  await sleep(50);
  await request(`/customer/reservations/${reservationId}`, 'GET', null, token, ip); // View Reservation Detail
  await sleep(50);
  await request(`/customer/invoices/${reservationId}`, 'GET', null, token, ip); // View Invoice
}

async function simulateAnomalyUser(index) {
  const ip = randomIP(); // Hacker IP
  const email = `hacker${index}@evil.com`;
  console.log(`[Anomaly] Registering hacker ${index}: ${email}`);
  
  // Register
  let res = await request('/customer/register', 'POST', { email, password: "hack", firstName: "Evil", lastName: "Hacker" }, null, ip);
  if (res.status !== 201) return;
  const token = res.data.token;
  const myId = res.data.customer.id;

  // Hacker Behavior: IDOR Scanning (aggressive fetching of random IDs)
  console.log(`[Anomaly] Hacker ${index} starting IDOR scan from IP ${ip}...`);
  for (let i = 0; i < 20; i++) {
    const targetId = Math.floor(Math.random() * 100) + 1; // Scan random IDs 1-100
    if (targetId === myId) continue; // Don't scan self

    // Rapid requests (Anomaly pattern: high frequency, accessing many different IDs)
    await request(`/customer/reservations/${targetId}`, 'GET', null, token, ip);
    await request(`/customer/profile/${targetId}`, 'GET', null, token, ip);
    await request(`/customer/invoices/${targetId}`, 'GET', null, token, ip);
  }
}

async function run() {
  console.log('🚀 Starting ML Dataset Generation...');
  console.log('Make sure your POS Server is running locally on port 3001!');
  
  // Optional: clear old log
  try { fs.unlinkSync('./access.log'); console.log('Cleared old access.log'); } catch (e) {}

  // Generate Normal Traffic
  for (let i = 1; i <= NUM_NORMAL_USERS; i++) {
    await simulateNormalUser(i);
  }

  // Generate Anomaly Traffic
  for (let i = 1; i <= NUM_ANOMALY_USERS; i++) {
    await simulateAnomalyUser(i);
  }

  console.log('✅ Dataset generation complete! Check access.log');
}

run();
