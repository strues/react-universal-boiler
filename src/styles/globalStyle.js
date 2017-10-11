import { injectGlobal } from 'styled-components';

export const injectGlobalStyle = () => {
  // eslint-disable-next-line no-unused-expressions
  injectGlobal`
    html,
    body {
      font-size: 100%;
      display: flex;
      align-items: stretch;
      overflow-x: hidden;
      text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.004);
    }

    body {
      cursor: default;
      background-color: rgba(229, 229, 229, 1);
      color: rgba(0, 0, 0, 0.87);
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-weight: 300;
      line-height: 1.5;
      font-size: 1em;
      position: relative;
      width: 100%;
      display: flex;
      min-height: 100vh;
      flex-direction: column;
    }
    body.fontLoaded {
      font-family: 'Roboto', Helvetica, Arial, sans-serif;
    }
    a {
      text-decoration: none;
      color: #51C2F3;
      &:hover {
       color: #51C2F3;
       text-decoration: underline;
      }
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-family: 'Rubik', Helvetica, Arial, sans-serif;
      font-weight: 700;
    }
  `;
};
