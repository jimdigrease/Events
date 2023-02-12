import { MongoClient } from 'mongodb';

export async function connectDB() {
  const client = await MongoClient.connect(
    'mongodb+srv://Jim:KcvBDULNAKM0gZSO@cluster0.jrvsz.mongodb.net/events?retryWrites=true&w=majority'
  );
  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db();
  const result = await db.collection(collection).insertOne(document);
  return result;
}

export async function getFilteredDocuments(client, collection, filter, sort) {
  const db = client.db();
  const documents = await db.collection(collection)
    .find(filter)
    .sort(sort)
    .toArray();
  return documents;
}
