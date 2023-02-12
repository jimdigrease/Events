import { connectDB, insertDocument } from '../../helpers/db-util';

async function handler(req, res) {
  if (req.method === 'POST') {
    const userEmail = req.body.email;

    if (
      !userEmail ||
      userEmail.trim() === '' ||
      !userEmail.includes('@')
    ) {
      res
      .status(422)
      .json({ message: 'Invalid email address.' });
      return;
    }

    let client;

    try {
      client = await connectDB();
    } catch (err) {
      res.status(500).json({ message: 'Connection to Database failed!', error: err });
      return;
    }

    try {
      await insertDocument(client, 'emails', { email: userEmail });
      // may check if (result.acknowledged) {} else throw new Error();
      client.close();
    } catch {
      res.status(500).json({ message: 'Inserting data failed!', error: err });
      return;
    }
    
    res
      .status(201)
      .json({ message: 'Successfully signed up!' });
  }
}

export default handler;
