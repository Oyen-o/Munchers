import { GroupsPage } from '@/components/GroupsPage';

export default function GroupsRoute() {
  // TODO: Get userId from auth context
  const userId = 'user_1234'; // Placeholder
  
  return <GroupsPage userId={userId} />;
}
