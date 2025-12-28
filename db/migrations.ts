import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import type { SQLiteDatabase } from 'expo-sqlite';
import * as schema from './schema';

/**
 * Run database migrations
 * This function applies all pending migrations to bring the database schema up to date
 */
export const runMigrations = async (db: SQLiteDatabase) => {
  try {
    const drizzleDb = drizzle(db, { schema });
    await migrate(drizzleDb, migrations);
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
};
