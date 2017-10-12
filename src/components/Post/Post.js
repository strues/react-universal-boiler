// @flow
import React from 'react';
import styles from './style.css';

type Props = {
  title: string,
  body: string,
};

const Post = ({ title, body }: Props) => {
  return (
    <div className={styles.pCard}>
      <h2 className={styles.pHeader}>{title}</h2>
      <p className={styles.pBody}>{body}</p>
    </div>
  );
};

export default Post;
