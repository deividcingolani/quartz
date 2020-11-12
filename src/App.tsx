import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { Global, css } from '@emotion/core';
import { BrowserRouter } from 'react-router-dom';
import { NotificationsContainer, ThemeProvider } from '@logicalclocks/quartz';

import Routes from './routes';
import { store } from './store';

const globalStyles = css`
  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
`;

const App: FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Global styles={globalStyles} />
        <NotificationsContainer mt="90px" />
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
