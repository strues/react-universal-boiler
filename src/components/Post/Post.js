import React from 'react';
import { string } from 'prop-types';
import styles from './style.css';

const Post = ({ title, body }) => {
  return (
    <div className={styles.pCard}>
      <h2 className={styles.pHeader}>{title}</h2>
      <p className={styles.pBody}>{body}</p>
    </div>
  );
};

Post.propTypes = {
  title: string,
  body: string,
};

export default Post;
