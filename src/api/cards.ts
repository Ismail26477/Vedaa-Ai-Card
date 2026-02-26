import { insertOne, find, updateOne, deleteOne, findOne } from '@/integrations/mongodb/client';
import { Card } from '@/integrations/mongodb/types';

const COLLECTION = 'cards';

export async function createCard(userId: string, cardData: Omit<Card, '_id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date().toISOString();
  
  const document = {
    ...cardData,
    userId,
    createdAt: now,
    updatedAt: now,
  };

  const result = await insertOne(COLLECTION, document);
  return { ...document, _id: result.insertedId };
}

export async function getCardById(cardId: string): Promise<Card | null> {
  try {
    const result = await findOne(COLLECTION, { _id: { $oid: cardId } });
    return result.document || null;
  } catch (error) {
    console.error('[v0] Error fetching card:', error);
    return null;
  }
}

export async function getCardsByUserId(userId: string): Promise<Card[]> {
  try {
    const result = await find(COLLECTION, { userId });
    return result.documents || [];
  } catch (error) {
    console.error('[v0] Error fetching cards:', error);
    return [];
  }
}

export async function updateCard(cardId: string, updates: Partial<Card>) {
  try {
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    const result = await updateOne(COLLECTION, { _id: { $oid: cardId } }, updateData);
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('[v0] Error updating card:', error);
    return false;
  }
}

export async function deleteCard(cardId: string): Promise<boolean> {
  try {
    const result = await deleteOne(COLLECTION, { _id: { $oid: cardId } });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('[v0] Error deleting card:', error);
    return false;
  }
}

export async function getPublicCard(cardId: string): Promise<Card | null> {
  try {
    const result = await findOne(COLLECTION, { 
      _id: { $oid: cardId },
      isPublic: true,
    });
    return result.document || null;
  } catch (error) {
    console.error('[v0] Error fetching public card:', error);
    return null;
  }
}

export async function updateCardQRCode(cardId: string, qrCode: string) {
  return updateCard(cardId, { qrCode } as Partial<Card>);
}
