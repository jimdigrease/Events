// This is a special component which can be used to replace the standard image element.
// Next.js will create multiple versions of image on the fly when requests are coming in, 
// optimize for the operating systems and device sizes that are making the request. And 
// then those generated images will be cached for future requests from similar devices. 
// Also it provides a lazy-loading, that means if they're not visible, Next.js will not 
// download them all instead of standard <img> that downloads all images anyway. Instead 
// it will download them only when they're needed.
import Image from 'next/image';

import Button from '../UI/Button';
import DateIcon from '../icons/DateIcon';
import AddressIcon from '../icons/AddressIcon';
import ArrowRightIcon from '../icons/ArrowRight-icon';
import styles from './EventItem.module.css';

function EventItem(props) {
  const { title, image, date, location, id } = props;

  const readableDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedAddress = location.replace(', ', '\n');
  const exploreEventLink = `/events/${id}`;

  return (
    <li className={styles.item}>
      <Image src={'/' + image} alt={title} width={250} height={160} />
      <div className={styles.content}>
        <div className={styles.summary}>
          <h2>{title}</h2>
          <div className={styles.date}>
            <DateIcon />
            <time>{readableDate}</time>
          </div>
          <div className={styles.address}>
            <AddressIcon />
            <address>{formattedAddress}</address>
          </div>
        </div>
        <div className={styles.actions}>
          <Button link={exploreEventLink}>
            <span>Explore Event</span>
            <span className={styles.icon}>
              <ArrowRightIcon />
            </span>
          </Button>
        </div>
      </div>
    </li>
  );
}

export default EventItem;
