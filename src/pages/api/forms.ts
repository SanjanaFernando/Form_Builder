// src/pages/api/forms.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const forms = await prisma.form.findMany();
      res.status(200).json(forms);
    } catch (error) {
      console.error('Error fetching forms:', error);
      res.status(500).json({ error: 'Failed to fetch forms' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query; // Get the form ID from the query parameters
    try {
      await prisma.form.delete({
        where: { id: Number(id) }, // Ensure id is a number
      });
      res.status(204).end(); // No content response
    } catch (error) {
      console.error('Error deleting form:', error);
      res.status(500).json({ error: 'Failed to delete form' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
