import { GroupDetails } from '../_components/group-details/group-details';

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <GroupDetails groupId={id} />;
}
