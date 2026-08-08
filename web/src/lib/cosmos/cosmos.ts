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

export function getRatingsContainer(): Container {
  return getContainer(process.env.COSMOS_RATINGS_CONTAINER_ID ?? 'Ratings');
}

export function getCommentsContainer(): Container {
  return getContainer(process.env.COSMOS_COMMENTS_CONTAINER_ID ?? 'Comments');
}

export function getEventAvailabilityContainer(): Container {
  return getContainer(
    process.env.COSMOS_EVENT_AVAILABILITY_CONTAINER_ID ?? 'EventAvailability',
  );
}

export function getUsersContainer(): Container {
  return getContainer(process.env.COSMOS_USERS_CONTAINER_ID ?? 'Users');
}

export function getAttendancesContainer(): Container {
  return getContainer(process.env.COSMOS_ATTENDANCES_CONTAINER_ID ?? 'Attendances');
}