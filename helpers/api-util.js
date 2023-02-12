export const URL = 'https://react-http-7919e-default-rtdb.europe-west1.firebasedatabase.app/Events.json';

// !!!
// Here fetching ALL events from a database is for simplify this demo, in real production build it 
// should be a sepatate fetching by database queries. NOT ALL events, cause it's often unnecessary, 
// especially if there's a southands of entries in DB.

export async function getAllEvents() {
  const response = await fetch(URL);
  const data = await response.json();

  const allEvents = [];

  for (const key in data) {
    allEvents.push({
      id: key, 
      ...data[key]
    });
  }
  return allEvents;
}

export async function getFeaturedEvents() {
  const allEvents = await getAllEvents();
  return allEvents.filter((event) => event.isFeatured);
}


export async function getFilteredEvents(dateFilter) {
  const { year, month } = dateFilter;
  const allEvents = await getAllEvents();

  let filteredEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month - 1;
  });

  return filteredEvents;
}

export async function getEventById(id) {
  const allEvents = await getAllEvents();

  return allEvents.find((event) => event.id === id);
}
