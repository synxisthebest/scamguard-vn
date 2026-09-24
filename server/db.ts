import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient | null = null;
let dbInstance: Db | null = null;
let isConnected = false;

export async function initDatabase(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️ [MongoDB] MONGODB_URI not configured. Operating in In-Memory / Local mode.');
    return null;
  }

  try {
    console.log('🔄 [MongoDB] Connecting to MongoDB Atlas...');
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    dbInstance = client.db('scamguard');
    isConnected = true;
    console.log('✅ [MongoDB] Successfully connected to MongoDB Atlas database: scamguard');

    // Safe index creation
    try {
      await dbInstance.collection('users').createIndex({ 'account.id': 1 }, { unique: true });
      await dbInstance.collection('progress').createIndex({ userId: 1 }, { unique: true });
      await dbInstance.collection('surveys').createIndex({ timestamp: -1 });
    } catch (idxErr) {
      // Ignore index warning
    }

    return dbInstance;
  } catch (err: any) {
    console.error('❌ [MongoDB] Connection error:', err?.message || err);
    console.log('⚠️ [MongoDB] Falling back to In-Memory store to ensure high availability.');
    isConnected = false;
    return null;
  }
}

export function isDbConnected(): boolean {
  return isConnected && dbInstance !== null;
}

export function getDb(): Db | null {
  return dbInstance;
}

export async function syncUsersWithDb(
  loadFn: (users: any[]) => void,
  getAllFn: () => any[]
) {
  if (!dbInstance) return;
  try {
    const col = dbInstance.collection('users');
    const existing = await col.find({}).toArray();
    if (existing.length > 0) {
      loadFn(existing);
      console.log(`✅ [MongoDB] Restored ${existing.length} users from MongoDB Atlas.`);
    } else {
      const initial = getAllFn();
      if (initial.length > 0) {
        await col.insertMany(initial as any);
        console.log(`✅ [MongoDB] Initialized MongoDB Atlas with ${initial.length} preset users.`);
      }
    }
  } catch (err) {
    console.warn('⚠️ [MongoDB] User sync warning:', err);
  }
}

export async function persistUser(user: { account: any; passwordHash?: string }) {
  if (!dbInstance) return;
  try {
    const col = dbInstance.collection('users');
    await col.updateOne(
      { 'account.id': user.account.id },
      { $set: user },
      { upsert: true }
    );
  } catch (err) {
    console.warn('⚠️ [MongoDB] User persistence warning:', err);
  }
}

export async function persistProgress(progress: any) {
  if (!dbInstance) return;
  try {
    const col = dbInstance.collection('progress');
    await col.updateOne(
      { userId: progress.userId },
      { $set: progress },
      { upsert: true }
    );
  } catch (err) {
    console.warn('⚠️ [MongoDB] Progress persistence warning:', err);
  }
}

export async function syncProgressWithDb(
  loadFn: (records: any[]) => void,
  getAllFn: () => any[]
) {
  if (!dbInstance) return;
  try {
    const col = dbInstance.collection('progress');
    const existing = await col.find({}).toArray();
    if (existing.length > 0) {
      loadFn(existing);
      console.log(`✅ [MongoDB] Restored ${existing.length} user progress records from MongoDB Atlas.`);
    } else {
      const initial = getAllFn();
      if (initial.length > 0) {
        await col.insertMany(initial as any);
        console.log(`✅ [MongoDB] Initialized MongoDB Atlas with ${initial.length} progress records.`);
      }
    }
  } catch (err) {
    console.warn('⚠️ [MongoDB] Progress sync warning:', err);
  }
}
