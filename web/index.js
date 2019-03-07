import React from 'react';
import { render } from 'react-dom';

function renderApp() {
    // eslint-disable-next-line global-require
    const App = require('./App').default;
    render(<App />, document.getElementById('root'));
}

renderApp();

module.hot.accept(renderApp);
