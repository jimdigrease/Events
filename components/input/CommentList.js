import styles from './CommentList.module.css';

function CommentList(props) {
  const { comments } = props;
  
  return (
    <ul className={styles.comments}>
      {comments && comments.map((comment) => (
        <li key={comment._id}>
          <p>{comment.text}</p>
          <div>
            By <address>{comment.name}</address>
          </div>
        </li>
        ))}
      {!comments && <p>No comments added yet!</p>}
    </ul>
  );
}

export default CommentList;
