import { useContext } from 'react';

import styles from './notification.module.css';
import NotificationContext from '../../store/notificationContext';

function Notification(props) {
  const notificationCtx = useContext(NotificationContext);

  const { title, message, status } = props;

  let statusstyles = '';

  if (status === 'success') {
    statusstyles = styles.success;
  }

  if (status === 'error') {
    statusstyles = styles.error;
  }

  if (status === 'pending') {
    statusstyles = styles.pending;
  }

  const activestyles = `${styles.notification} ${statusstyles}`;

  return (
    <div className={activestyles} onClick={notificationCtx.hideNotification}>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}

export default Notification;
