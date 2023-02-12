import { connectDB, insertDocument, getFilteredDocuments } from '../../../helpers/db-util';

async function handler(req, res) {
  const eventId = req.query.eventId;

  let client;

  try {
    client = await connectDB();
  } catch (err) {
    res.status(500).json({ message: 'Connection to Database failed!', error: err });
    return;
  }

  if (req.method === 'POST') {
    const { email, name, text } = req.body;

    if (
      !email || email.trim() === '' || !email.includes('@') ||
      !name || name.trim() === '' ||
      !text || text.trim() === ''
    ) {
      res
      .status(422)
      .json({ message: 'Invalid inputs.' });
      client.close();
      return;
    }
    
    const newComment = {
      eventId, 
      email,
      name, 
      text
    };

    try {
      const result = await insertDocument(client, 'comments', newComment);
      // may check if (result.acknowledged) {} else throw new Error();
      newComment._id = result.insertedId.toString();
      res.status(201).json({ comment: newComment });
    } catch {
      res.status(500).json({ message: 'Inserting data failed!', error: err });
    }
  }

  if (req.method === 'GET') {
    try {
      const comments = await getFilteredDocuments(client, 'comments', { eventId: eventId }, { _id: -1 });
      // may check if (result.acknowledged) {} else throw new Error();
      res.status(200).json({ comments: comments });
    } catch {
      res.status(500).json({ message: 'Fetching comments failed!', error: err });
    }
  }

  client.close();
}

export default handler;
