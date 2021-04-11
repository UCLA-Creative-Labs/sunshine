import {AppProps} from 'next/app';
import React, { createContext, useEffect, useState } from 'react';
import '../styles/globals.scss';

interface IAppContext {
  isDay: boolean;
}

export const AppContext = createContext<IAppContext>({
  isDay: true,
});

const AppWrapper = ({children}: {children: JSX.Element}) => {
  const [isDay, setIsDay] = useState(true);
  useEffect(() => {
    const date = new Date();
    const hours = date.getHours();
    setIsDay(6 < hours && hours < 18);
  }, []);

  return (
    <AppContext.Provider
      value={{ isDay: true }}>
      {children}
    </AppContext.Provider>
  );
};

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
}

export default MyApp;
