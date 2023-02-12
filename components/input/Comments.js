import { useEffect, useState, useContext } from 'react';

import CommentList from './CommentList';
import NewComment from './NewComment';
import NotificationContext from '../../store/notificationContext';
import styles from './Comments.module.css';

function Comments(props) {
  const { eventId } = props;

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const notificationCtx = useContext(NotificationContext);

  useEffect(() => {
    if (showComments) {
      setIsLoading(true);
      fetch(`/api/comments/${eventId}`)
        .then(response => response.json())
        .then(data => {
          setIsLoading(false);
          setComments(data.comments);
        });
    }
  },[showComments])

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {
    notificationCtx.showNotification({
      title: 'Sending comment...', 
      message: 'Storing your comment in a Database...', 
      status: 'pending'
    });

    fetch(`/api/comments/${eventId}`, {
      method: 'POST',
      body: JSON.stringify(commentData), 
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }

      // Here is catching the case of error-http statuses as 400 or 500, which will not 
      // causes promises to fail, so to intercept by catch block need to throw new error 
      // in returning nested promise-chain
      return response.json().then(data => {
        throw new Error(data.message || 'Something went wrong!');
      })
    })
    .then(data => {
      notificationCtx.showNotification({
        title: 'Success!', 
        message: 'Successfully added Your comment!', 
        status: 'success'
      });
    })
    .catch(error => {
      notificationCtx.showNotification({
        title: 'Error!', 
        message: error.message || 'Something went wrong!', 
        status: 'error'
      });
    });
  }

  return (
    <section className={styles.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? 'Hide' : 'Show'} Comments
      </button>
      {showComments && isLoading && <p className="center">Loading...</p>}
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && !isLoading &&<CommentList comments={comments} />}
    </section>
  );
}

export default Comments;
