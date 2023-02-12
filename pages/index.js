import { getFeaturedEvents } from '../helpers/api-util';
import EventList from '../components/events/EventList';
import NewsletterRegistration from '../components/input/NewsletterRegistration';

function HomePage(props) {
  return (
    <div>
      <NewsletterRegistration />
      <EventList events={props.featuredEvents} />
    </div>
  );
}

export default HomePage;

export async function getStaticProps() {
  const featuredEvents = await getFeaturedEvents();

  return {
    props: {
      featuredEvents: featuredEvents
    }, 
    revalidate: 1800
  }
}
