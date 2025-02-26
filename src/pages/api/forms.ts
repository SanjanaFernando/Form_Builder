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
    const { id } = req.query;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({ error: 'Invalid form ID' });
      return;
    }

    try {
      const form = await prisma.form.findUnique({ where: { id: Number(id) } });
      if (!form) {
        res.status(404).json({ error: 'Form not found' });
        return;
      }

      await prisma.form.delete({ where: { id: Number(id) } });
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting form:', error);
      res.status(500).json({ error: 'Failed to delete form' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
