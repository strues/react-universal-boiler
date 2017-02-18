import React, { PropTypes } from 'react';
import { StaticRouter, BrowserRouter } from 'react-router-dom';

const Root = (props) => {
  return (
    <div>
      {props.server &&
        <StaticRouter {...props.server}>
          <div>
            {props.children}
          </div>
        </StaticRouter>
      }
      {!props.server &&
        <BrowserRouter>
          <div>
            {props.children}
          </div>
        </BrowserRouter>
      }
    </div>
  );
};

Root.displayName = 'Root';

Root.propTypes = {
  basename: PropTypes.string,
  children: PropTypes.node.isRequired,
  server: PropTypes.oneOfType([
    PropTypes.bool.isRequired,
    PropTypes.object.isRequired
  ])
};

export default Root;
