import { PlaceDetails } from '../_components/place-details';

export default async function PlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PlaceDetails placeId={id} />;
}
