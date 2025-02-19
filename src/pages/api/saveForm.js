import {prisma} from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, elements } = req.body;

    try {
      const savedForm = await prisma.form.create({
        data: {
          title,
          elements,
        },
      });
      
      res.status(201).json(savedForm);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save form' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
