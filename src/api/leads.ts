import { insertOne, find, updateOne, deleteOne, findOne } from '@/integrations/mongodb/client';
import { Lead } from '@/integrations/mongodb/types';

const COLLECTION = 'leads';

export async function createLead(userId: string, leadData: Omit<Lead, '_id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date().toISOString();
  
  const document = {
    ...leadData,
    userId,
    status: 'new',
    createdAt: now,
    updatedAt: now,
  };

  const result = await insertOne(COLLECTION, document);
  return { ...document, _id: result.insertedId };
}

export async function getLeadById(leadId: string): Promise<Lead | null> {
  try {
    const result = await findOne(COLLECTION, { _id: { $oid: leadId } });
    return result.document || null;
  } catch (error) {
    console.error('[v0] Error fetching lead:', error);
    return null;
  }
}

export async function getLeadsByCardId(cardId: string): Promise<Lead[]> {
  try {
    const result = await find(COLLECTION, { cardId });
    return result.documents || [];
  } catch (error) {
    console.error('[v0] Error fetching leads by card:', error);
    return [];
  }
}

export async function getLeadsByUserId(userId: string): Promise<Lead[]> {
  try {
    const result = await find(COLLECTION, { userId });
    return result.documents || [];
  } catch (error) {
    console.error('[v0] Error fetching leads by user:', error);
    return [];
  }
}

export async function updateLead(leadId: string, updates: Partial<Lead>) {
  try {
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    const result = await updateOne(COLLECTION, { _id: { $oid: leadId } }, updateData);
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('[v0] Error updating lead:', error);
    return false;
  }
}

export async function deleteLead(leadId: string): Promise<boolean> {
  try {
    const result = await deleteOne(COLLECTION, { _id: { $oid: leadId } });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('[v0] Error deleting lead:', error);
    return false;
  }
}

export async function updateLeadStatus(leadId: string, status: string) {
  return updateLead(leadId, { status } as Partial<Lead>);
}

export async function getLeadsByStatus(userId: string, status: string): Promise<Lead[]> {
  try {
    const result = await find(COLLECTION, { userId, status });
    return result.documents || [];
  } catch (error) {
    console.error('[v0] Error fetching leads by status:', error);
    return [];
  }
}
