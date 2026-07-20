import { CosmosClient, Database, Container } from '@azure/cosmos';

const endpoint = process.env.COSMOS_ENDPOINT || '';
const key = process.env.COSMOS_KEY || '';
const databaseId = process.env.COSMOS_DATABASE_ID || 'munchers-db';

let client: CosmosClient;

let database: Database;
let usersContainer: Container;
let groupsContainer: Container;
let eventsContainer: Container;
let commentsContainer: Container;
let ratingsContainer: Container;

export async function initializeCosmosDB() {
  // Create client
  client = new CosmosClient({ endpoint, key });
  
  // Create database if it doesn't exist
  const { database: db } = await client.databases.createIfNotExists({
    id: databaseId,
  });
  database = db;

  // Create containers if they don't exist
  const { container: users } = await database.containers.createIfNotExists({
    id: 'users',
    partitionKey: { paths: ['/id'] },
  });
  usersContainer = users;

  const { container: groups } = await database.containers.createIfNotExists({
    id: 'groups',
    partitionKey: { paths: ['/id'] },
  });
  groupsContainer = groups;

  const { container: events } = await database.containers.createIfNotExists({
    id: 'events',
    partitionKey: { paths: ['/ownerId'] },
  });
  eventsContainer = events;

  const { container: comments } = await database.containers.createIfNotExists({
    id: 'comments',
    partitionKey: { paths: ['/eventId'] },
  });
  commentsContainer = comments;

  const { container: ratings } = await database.containers.createIfNotExists({
    id: 'ratings',
    partitionKey: { paths: ['/eventId'] },
  });
  ratingsContainer = ratings;

  console.log('Cosmos DB initialized successfully');
}

export function getContainers() {
  return {
    users: usersContainer,
    groups: groupsContainer,
    events: eventsContainer,
    comments: commentsContainer,
    ratings: ratingsContainer,
  };
}

export { database, client };
