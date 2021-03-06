// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeStateProvider } from "../contexts/ThemeContext";
import { UIStateProvider } from "../contexts/UIContext";
import SparklingStars from "../components/SparklingStars";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { ReactElement, ReactNode } from "react";
import DefaultLayout from "../components/DefaultLayout";
import HomePageLayout from "../components/HomePageLayout";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <ThemeStateProvider>
      <UIStateProvider>
        {getLayout(<Component {...pageProps} />)}
      </UIStateProvider>
    </ThemeStateProvider>
  );
};

export default App;
