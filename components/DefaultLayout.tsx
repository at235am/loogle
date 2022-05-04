import styled from "@emotion/styled";
import { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import SparklingStars from "./SparklingStars";

const AppContainer = styled.div`
  /* border: 2px dashed red; */
  position: relative;

  background-color: #222;

  flex: 1; /* stretches to fill the height */

  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    flex-direction: column;
  }
`;

const Header = styled.header``;

const NotificationContainer = styled.div`
  z-index: 2;

  position: relative;
  top: ${({ theme }) => theme.dimensions.mainNav.maxHeight}px;

  width: 100%;
  /* background-color: ${({ theme }) => theme.colors.primary.main}; */
`;

const PageContainer = styled.main`
  /* border: 2px dashed green; */

  z-index: 1;
  position: relative;

  flex: 1; /* stretches to fill the height */

  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

type Props = {
  children: ReactNode;
};

const DefaultLayout = ({ children }: Props) => {
  return (
    <AppContainer id="app">
      <Header>
        <NotificationContainer id="main-notification" />
        <Navbar />
      </Header>

      <PageContainer id="page-container">
        {/* <SparklingStars /> */}
        {children}
      </PageContainer>
      <Footer />
    </AppContainer>
  );
};

export default DefaultLayout;
