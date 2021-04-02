import Head from 'next/head';
import React, { useState } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

interface LayoutProps {
  children: JSX.Element;
}

function Layout(props: LayoutProps): JSX.Element {
  const [ isDay, setIsDay ] = useState(true);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="title" content="Creative Labs" />
        <meta name="description" content="We are a community of students at UCLA working together to discover and pursue our creative passions."/>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.creativelabsucla.com/" />
        <meta property="og:title" content="Creative Labs" />
        <meta property="og:description" content="We are a community of students at UCLA working together to discover and pursue our creative passions." />
        <meta property="og:image" content="https://assets.creativelabsucla.com/metadata.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Creative Labs" />
        <meta property="twitter:description" content="We are a community of students at UCLA working together to discover and pursue our creative passions." />
        <meta property="twitter:image" content="https://assets.creativelabsucla.com/metadata.png" />

        <title>Creative Labs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar isDay={isDay}/>
      <main>
        {props.children}
      </main>
      <Footer />
    </>
  );
}

export default Layout;