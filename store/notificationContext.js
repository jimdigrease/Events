import { createContext, useState, useEffect } from 'react';

const NotificationContext = createContext({
  notification: null, // { title, message, status }
  showNotification: function (notificationData) {},
  hideNotification: function () {}
});

export function NotificationContextProvider(props) {
  const [activeNotification, setActiveNotification] = useState();

  // This Timer is to dissapear notification automatically
  useEffect(() => {
    if (
      activeNotification && 
      (activeNotification.status === 'success' 
      || activeNotification.status === 'error')
    ) {
      const timer = setTimeout(() => {
        setActiveNotification(null);
      }, 3000);
      // Clean-up function is to clean timer if useEffect() reruns before the 
      // timer went off, to prevent multiple ongoing timers at the same time
      return () => {
        clearTimeout(timer);
      };
    }
  }, [activeNotification]);

  function showNotificationHandler(notificationData) {
    setActiveNotification(notificationData); // { title, message, status }
  }

  function hideNotificationHandler() {
    setActiveNotification(null);
  }

  const context = {
    notification: activeNotification,
    showNotification: showNotificationHandler,
    hideNotification: hideNotificationHandler
  }

  return (
    <NotificationContext.Provider value={context}>
      {props.children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;
