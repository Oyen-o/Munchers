import { GroupsPage } from './_components/groups-page';

export default function GroupsRoute() {
  // TODO: Get userId from auth context
  const userId = 'user_1234'; // Placeholder
  
  return <GroupsPage userId={userId} />;
}
