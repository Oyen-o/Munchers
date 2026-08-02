import { EventDetailPage } from '../_components/event-detail-page/event-detail-page';


// Required for static export - pre-generate pages for known event IDs
// Add more IDs here as needed, or generate dynamically from your data source
export async function generateStaticParams() {
  return [
    { id: 'event1' },
    { id: 'event2' },
    { id: 'event3' },
  ];
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <EventDetailPage eventId={id} />;
}
