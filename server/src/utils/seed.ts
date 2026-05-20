import { connectDB, disconnectDB } from '../config/db';
import { User } from '../models/User';
import { Lead } from '../models/Lead';
import { LeadSource, LeadStatus } from '../types';

const sampleNames = [
  'Rahul Sharma', 'Priya Verma', 'Amit Patel', 'Sneha Iyer', 'Vikram Singh',
  'Ananya Gupta', 'Rohan Mehta', 'Kavya Reddy', 'Arjun Nair', 'Ishita Joshi',
  'Karan Kapoor', 'Meera Pillai', 'Nikhil Rao', 'Pooja Desai', 'Sahil Khan',
  'Tanvi Bhatt', 'Yash Agarwal', 'Riya Saxena', 'Dev Malhotra', 'Aditi Menon',
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function run(): Promise<void> {
  await connectDB();

  console.log('[seed] Clearing existing users and leads...');
  await Promise.all([User.deleteMany({}), Lead.deleteMany({})]);

  console.log('[seed] Creating admin and sales user...');
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@smartleads.dev',
    password: 'admin123',
    role: 'Admin',
  });
  await User.create({
    name: 'Sales User',
    email: 'sales@smartleads.dev',
    password: 'sales123',
    role: 'SalesUser',
  });

  console.log('[seed] Inserting sample leads...');
  const leads = sampleNames.map((name) => {
    const emailLocal = name.toLowerCase().replace(/\s+/g, '.');
    return {
      name,
      email: `${emailLocal}@example.com`,
      status: pick(LeadStatus),
      source: pick(LeadSource),
      createdBy: admin._id,
    };
  });

  await Lead.insertMany(leads);

  console.log('[seed] Done.');
  console.log('  Admin login:       admin@smartleads.dev / admin123');
  console.log('  Sales user login:  sales@smartleads.dev / sales123');

  await disconnectDB();
}

run().catch(async (err) => {
  console.error('[seed] Failed', err);
  await disconnectDB();
  process.exit(1);
});
