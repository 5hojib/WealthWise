
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCollection } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const collection = await getCollection('beneficiaries');

    if (req.method === 'GET') {
      const beneficiaries = await collection.find({}).toArray();
      return res.status(200).json(beneficiaries);
    }

    if (req.method === 'POST') {
      const beneficiary = req.body;
      if (!beneficiary || !beneficiary.id) {
        return res.status(400).json({ error: 'Invalid beneficiary data' });
      }
      
      await collection.updateOne(
        { id: beneficiary.id },
        { $set: beneficiary },
        { upsert: true }
      );
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      await collection.deleteOne({ id: id as string });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Beneficiaries API Error:', { message: error.message, stack: error.stack, name: error.name });
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
