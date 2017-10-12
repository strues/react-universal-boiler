// @flow
import React from 'react';
import type { Node } from 'react';
import Link from 'react-router-dom/Link';
// $FlowIssue
import styles from './style.scss';

type Props = {
  children: Node,
};

const Layout = (props: Props) => (
  <div>
    <nav className={styles.navbar}>
      <div className={styles.wrapper}>
        <Link to="/tools">Tools</Link>
      </div>
    </nav>
    <main className="container">{props.children}</main>
  </div>
);

export default Layout;
