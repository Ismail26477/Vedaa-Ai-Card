import { insertOne, find, updateOne, deleteOne, findOne } from '@/integrations/mongodb/client';
import { User } from '@/integrations/mongodb/types';

const COLLECTION = 'users';

export async function createOrUpdateUser(
  supabaseId: string,
  userData: Partial<Omit<User, '_id' | 'supabaseId' | 'createdAt' | 'updatedAt'>>
) {
  try {
    const now = new Date().toISOString();
    
    // Check if user exists
    const existing = await findOne(COLLECTION, { supabaseId });
    
    if (existing.document) {
      // Update existing user
      const updateData = {
        ...userData,
        supabaseId,
        updatedAt: now,
      };
      await updateOne(COLLECTION, { supabaseId }, updateData);
      return { ...existing.document, ...updateData };
    } else {
      // Create new user
      const document = {
        ...userData,
        supabaseId,
        createdAt: now,
        updatedAt: now,
      };
      await insertOne(COLLECTION, document);
      return document;
    }
  } catch (error) {
    console.error('[v0] Error creating/updating user:', error);
    throw error;
  }
}

export async function getUserBySupabaseId(supabaseId: string): Promise<User | null> {
  try {
    const result = await findOne(COLLECTION, { supabaseId });
    return result.document || null;
  } catch (error) {
    console.error('[v0] Error fetching user by supabase ID:', error);
    return null;
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const result = await findOne(COLLECTION, { _id: { $oid: userId } });
    return result.document || null;
  } catch (error) {
    console.error('[v0] Error fetching user by ID:', error);
    return null;
  }
}

export async function updateUser(userId: string, updates: Partial<User>) {
  try {
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    const result = await updateOne(COLLECTION, { _id: { $oid: userId } }, updateData);
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('[v0] Error updating user:', error);
    return false;
  }
}

export async function updateUserLastLogin(supabaseId: string) {
  try {
    const updateData = {
      lastLogin: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const result = await updateOne(COLLECTION, { supabaseId }, updateData);
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('[v0] Error updating last login:', error);
    return false;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await findOne(COLLECTION, { email });
    return result.document || null;
  } catch (error) {
    console.error('[v0] Error fetching user by email:', error);
    return null;
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const result = await deleteOne(COLLECTION, { _id: { $oid: userId } });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('[v0] Error deleting user:', error);
    return false;
  }
}
