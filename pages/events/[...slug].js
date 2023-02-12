import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';

import { getFilteredEvents, URL } from '../../helpers/api-util';
import EventList from '../../components/events/EventList';
import Button from '../../components/UI/Button';
import ResultsTitle from '../../components/events/ResultsTitle';
import ErrorAlert from '../../components/UI/ErrorAlert';


// USING SWR variant, it WORKS
// const fetcher = (...args) => fetch(...args).then((res) => res.json())

// function FilteredEventsPage(props) {
//   const [loadedEvents, setLoadedEvents] = useState();
//   const router = useRouter();

//   const filterData = router.query.slug;

//   const { data, error } = useSWR(URL, fetcher);

//   useEffect(() => {
//     if (data) {
//       const events = [];

//       for (const key in data) {
//         events.push({
//           id: key,
//           ...data[key],
//         });
//       }

//       setLoadedEvents(events);
//     }
//   }, [data]);

//   if (!loadedEvents) {
//     return <p>Loading...</p>;
//   }

//   const filteredYear = filterData[0];
//   const filteredMonth = filterData[1];

//   const numYear = +filteredYear;
//   const numMonth = +filteredMonth;

//   if (
//     isNaN(numYear) ||
//     isNaN(numMonth) ||
//     numYear > 2030 ||
//     numYear < 2021 ||
//     numMonth < 1 ||
//     numMonth > 12 ||
//     error
//   ) {
//     return (
//       <Fragment>
//         <ErrorAlert>
//           <p>Invalid filter. Please adjust your values!</p>
//         </ErrorAlert>
//         <div className='center'>
//           <Button link='/events'>Show All Events</Button>
//         </div>
//       </Fragment>
//     );
//   }

//   const filteredEvents = loadedEvents.filter((event) => {
//     const eventDate = new Date(event.date);
//     return (
//       eventDate.getFullYear() === numYear &&
//       eventDate.getMonth() === numMonth - 1
//     );
//   });

//   if (!filteredEvents || filteredEvents.length === 0) {
//     return (
//       <Fragment>
//         <ErrorAlert>
//           <p>No events found for the chosen filter!</p>
//         </ErrorAlert>
//         <div className='center'>
//           <Button link='/events'>Show All Events</Button>
//         </div>
//       </Fragment>
//     );
//   }

//   const date = new Date(numYear, numMonth - 1);

//   return (
//     <Fragment>
//       <ResultsTitle date={date} />
//       <EventList events={filteredEvents} />
//     </Fragment>
//   );
// }


// Classical variant, also WORKS with some God's help)) 
// Note: most of statements must be in this exact order, otherwise it DON'T WORK
function FilteredEventsPage(props) {
  const [loadedEvents, setLoadedEvents] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const filterData = router.query.slug;

  useEffect(() => {
    setIsLoading(true);
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        const events = [];

        for (const key in data) {
          events.push({
            id: key,
            ...data[key],
          });
        }

        setLoadedEvents(events);
        setIsLoading(false);
      });
  }, []);

  let pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta 
        name="description" 
        content="A list of Filtered Events."
      />
    </Head>
  );

  if (isLoading) {
    return (
      <Fragment>
        {pageHeadData}
        <p className="center">...Loading</p>
      </Fragment>
    );
  }
  if (!loadedEvents) {
    return (
      <Fragment>
        {pageHeadData}
        <p className="center">...Loading</p>
      </Fragment>
    );
  }
  
  // This valriables not exist in flow if its set over if-checks above, that not good, 
  // bacause it not allow to use predefined content of headers and meta-data with 
  // description within date in JSX into those if-checks. Fix it by creating a let 
  // pageHeadData variable above with more common content
  const filteredYear = +filterData[0];
  const filteredMonth = +filterData[1];

  const date = new Date(
    filteredYear, 
    filteredMonth - 1
  );
  const humanReadableDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta 
        name="description" 
        content={`All Events for ${humanReadableDate}`}
      />
    </Head>
  );

  if (isNaN(filteredYear) ||
      isNaN(filteredMonth) ||
      filteredYear > 2030 ||
      filteredYear < 2022 ||
      filteredMonth < 1 ||
      filteredMonth > 12) 
  {
    return (
      <Fragment>
        {pageHeadData}
        <ErrorAlert>
          <p>Invalid filter. Please adjust your values!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }
  
  // if (props.hasError) {
  //   return (
  //     <Fragment>
  //       <ErrorAlert>
  //         <p>Invalid filter. Please adjust your values!</p>
  //       </ErrorAlert>
  //       <div className="center">
  //         <Button link="/events">Show All Events</Button>
  //       </div>
  //     </Fragment>
  //   );
  // }

  // const filteredEvents = props.filteredEvents;

  const filteredEvents = loadedEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === filteredYear && 
      eventDate.getMonth() === filteredMonth - 1
    );
  });

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        {pageHeadData}
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  // const date = new Date(
  //   props.date.year, 
  //   props.date.month - 1
  // );

  

  return (
    <Fragment>
      {pageHeadData}
      <ResultsTitle date={date} />
      <EventList events={filteredEvents} />
    </Fragment>
  );
}

export default FilteredEventsPage;


// SSR here is unnecessary, because all pages already statically rendered 
// for other pages and all content already exposed to search engines etc. 
// So for this page client-side data fetching (above) is more suitable.
// export async function getServerSideProps(context) {
//   const { params } = context;
//   const filteredYear = +params.slug[0];
//   const filteredMonth = +params.slug[1];

//   if (
//     isNaN(filteredYear) ||
//     isNaN(filteredMonth) ||
//     filteredYear > 2030 ||
//     filteredYear < 2022 ||
//     filteredMonth < 1 ||
//     filteredMonth > 12
//   ) {
//     return ({ 
//       hasError: true,
//       // notFound: true, 
//       // redirect: '/error' 
//     });
//   }

//   const filteredEvents = await getFilteredEvents({
//     year: filteredYear,
//     month: filteredMonth
//   });

//   return {
//     props: {
//       filteredEvents: filteredEvents, 
//       date: {
//         year: filteredYear,
//         month: filteredMonth
//       }
//     }
//   };
// }

