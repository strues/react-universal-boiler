/* @flow */

import type { Store as ReduxStore } from 'redux';

export type PostType = {
  id: number,
  title: string,
  body: string,
};

export type PostsType = $ReadOnlyArray<PostType>;

export type PostsReducer = {
  list: $ReadOnlyArray<Object>,
  isFetching: boolean,
  error: any,
};

export type Reducer = {
  posts: PostsReducer,
};

export type Action =
  | { type: '@posts/FETCH_POSTS_REQUEST' }
  | { type: '@posts/FETCH_POSTS_SUCCESS', payload: $ReadOnlyArray<Object> }
  | { type: '@posts/FETCH_POSTS_FAILURE', error: any };

export type Store = ReduxStore<Reducer, Action>;

export type Dispatch = (
  // eslint-disable-next-line no-use-before-define
  action: Action | ThunkAction | PromiseAction | $ReadOnlyArray<Action>,
) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
