const { MongoClient } = require('mongodb')
require('dotenv').config()

const mongoUri = process.env.MONGO_URI
const client = new MongoClient(mongoUri)

async function connect() {
  await client.connect()

  return client.db('markdb')
}

async function disconect() {
  await client.disconect()
}

module.exports = { connect, disconect }