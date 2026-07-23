import { EventDetailPage } from '../_components/event-detail-page/event-detail-page';

export default function EventPage({ params }: { params: { id: string } }) {
  return <EventDetailPage eventId={params.id} />;
}
