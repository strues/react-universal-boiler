import React from 'react';
import styled from 'styled-components';
import { string } from 'prop-types';

const PostCard = styled.div`
  background-color: #fff;
  margin-bottom: 10px;
  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, .14),
  0 1px 10px 0 rgba(0, 0, 0, .12),
  0 2px 4px -1px rgba(0, 0, 0, .4);
  margin-left: 10px;
  margin-right: 10px;
  padding: 1em;
`;

const Head = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;
const Body = styled.p`
  font-size: 1rem;
`;

const Post = ({ title, body }) => {
  return (
    <div>
      <PostCard>
        <Head>{title}</Head>
        <Body>{body}</Body>
      </PostCard>
    </div>
  );
};

const propTypes = {
  title: string,
  body: string,
};
Post.propTypes = propTypes;

export default Post;
