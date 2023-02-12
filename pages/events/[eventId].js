import { Fragment } from 'react';
import Head from 'next/head';

import { getEventById, getFeaturedEvents } from '../../helpers/api-util';
import EventSummary from '../../components/event-detail/EventSummary';
import EventLogistics from '../../components/event-detail/EventLogistics';
import EventContent from '../../components/event-detail/EventContent';
import Comments from '../../components/input/Comments';

function EventDetailPage(props) {
  const event = props.event;

  const pageHeadData = (
    <Head>
      <title>{event? event.title : 'Loading Event...'}</title>
      <meta 
        name="description" 
        content={event? event.description : 'Some Event is coming...'}
      />
    </Head>
  );

  if (!event) {
    return (
      <Fragment>
        {pageHeadData}
        <p className="center">...Loading</p>
      </Fragment>
    );
  }

  return (
    <Fragment>
      {pageHeadData}
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
      <Comments eventId={event.id} />
    </Fragment>
  );
}

export default EventDetailPage;



export async function getStaticPaths() {
  const events = await getFeaturedEvents();

  const paths = events.map((event) => ({ params: { eventId: event.id } }));

  return {
    fallback: true,
    paths: paths
  };
}

export async function getStaticProps(context) {
  const eventId = context.params.eventId;

  const event = await getEventById(eventId);

  if (!event) {
    return { notFound: true };
  }

  return {
    props: {
      event: event,
    },
    revalidate: 60
  };
}
