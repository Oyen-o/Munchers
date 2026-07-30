import { CosmosClient, type Container } from '@azure/cosmos';

const databaseId = process.env.COSMOS_DATABASE_ID ?? 'Munchers';

let cosmosClient: CosmosClient | null = null;

function getCosmosClient(): CosmosClient {
  const endpoint = process.env.COSMOS_ENDPOINT;
  const key = process.env.COSMOS_KEY;

  if (!endpoint || !key) {
    throw new Error('Missing COSMOS_ENDPOINT or COSMOS_KEY environment variables');
  }

  if (!cosmosClient) {
    cosmosClient = new CosmosClient({ endpoint, key });
  }

  return cosmosClient;
}

function getContainer(containerId: string): Container {
  return getCosmosClient().database(databaseId).container(containerId);
}

export function getEventsContainer(): Container {
  return getContainer(process.env.COSMOS_EVENTS_CONTAINER_ID ?? 'Events');
}

export function getGroupsContainer(): Container {
  return getContainer(process.env.COSMOS_GROUPS_CONTAINER_ID ?? 'Groups');
}

export function getMembershipsContainer(): Container {
  return getContainer(process.env.COSMOS_MEMBERSHIPS_CONTAINER_ID ?? 'Memberships');
}