import styled from "@emotion/styled";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

// icons:
import {
  MdArrowDropDown,
  MdArrowRightAlt,
  MdDoubleArrow,
} from "react-icons/md";

import { FaAngleDown } from "react-icons/fa";

import { useHoningState } from "../contexts/HoningContext";
import { HoningFieldsNumber } from "../pages/honing";
import { prettyNumber } from "../utils/utils";
import InfoLabel from "./InfoLabel";

import MaterialImageIcon, { MaterialTypes } from "./MaterialImageIcon";
import Mats from "./Mats";

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const LevelTotalContainer = styled(motion.div)`
  overflow: hidden;

  display: flex;
  flex-direction: column;
`;

const LevelTotal = styled(motion.div)`
  border-radius: 16px;

  background-color: ${({ theme }) => theme.colors.surface.main};
  padding: 0.5rem;

  /* 
    We use margin to separate each item 
    to avoid a sudden collapse when animating this container. 
    "gap: 0.5rem" was the problem since it cannot be animated.
  */
  margin-top: 0.5rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    /* background-color: ${({ theme }) => theme.colors.surface.darker}; */
    /* background-color: ${({ theme }) => theme.colors.background.darker}; */
  }
`;

const Arrow = styled.span`
  font-weight: 600;
  font-size: 0.8rem;
  font-style: italic;
  color: inherit;

  svg {
    width: 10px;
    height: 10px;
  }
`;

const MatsWrapper = styled.div`
  flex-flow: wrap;
  display: flex;
  gap: 0.5rem;
`;

const NoResults = styled.div`
  font-weight: 600;

  border-radius: 12px;
  /* background-color: ${({ theme }) => theme.colors.surface.light}; */

  padding: 1rem;

  display: flex;
  /* justify-content: center; */
  align-items: center;
  /* gap: 0.25rem; */
`;

const Total = styled.div`
  position: relative;
  /* min-height: 7rem; */
  min-height: 7rem;

  /* padding: 0.5rem; */
  border-radius: 16px;
  /* background-color: ${({ theme }) => theme.colors.background.main}; */
  /* background-color: ${({ theme }) => theme.colors.surface.light}; */
  /* border: 1px solid ${({ theme }) => theme.colors.surface.light}; */

  &:hover {
    /* border: 1px solid ${({ theme }) => theme.colors.surface.lighter}; */
  }

  display: flex;
  flex-direction: column;
  /* gap: 0.25rem; */
`;

const TotalHeader = styled.div`
  cursor: pointer;

  /* background-color: red; */
  user-select: none;

  border-radius: 16px 16px 0 0;
  padding: 0 0.5rem;
  height: 2.25rem;
  max-height: 2.25rem;

  background-color: ${({ theme }) => theme.colors.surface.dark};
  background-color: ${({ theme }) => theme.colors.surface.light};
  background-color: ${({ theme }) => theme.colors.background.dark};

  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    .arrow-icon {
      background-color: #fff;
      svg {
        fill: #222;
      }
    }
  }
`;

const TotalContent = styled.div`
  /* background-color: red; */

  border-radius: 0 0 16px 16px;
  flex: 1;

  /* border: 1px solid ${({ theme }) => theme.colors.surface.light}; */
  background-color: ${({ theme }) => theme.colors.surface.light};
  background-color: ${({ theme }) => theme.colors.surface.lighter};
  background-color: ${({ theme }) => theme.colors.surface.dark};

  border-top: 0;

  padding: 0.5rem;

  display: flex;
  align-items: center;
  /* gap: 0.25rem; */
`;

const H = styled.h3`
  font-size: 1.02rem;
  font-weight: 600;
  font-style: italic;

  /* flex: 1; */

  /* padding: 0.25rem 0.75rem; */
  /* background-color: ${({ theme }) => theme.colors.background.lighter}; */
  /* background-color: red; */
  /* border-radius: 16px; */

  border-top-left-radius: 13px;
  border-bottom-right-radius: 13px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  span {
    font-size: 0.9rem;
    font-weight: 600;
    white-space: nowrap;
    font-style: normal;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const ArrowIcon = styled(motion.span)`
  /* position: absolute; */
  /* right: 0; */
  /* margin-right: 0.5rem; */
  background-color: ${({ theme }) => theme.colors.surface.main};

  border-radius: 50%;

  width: 22px;
  height: 22px;

  /* justify-self: flex-end; */

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const SubHeader = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TotalMats = styled(Mats)`
  background-color: transparent;
`;

type Props = {
  data: HoningFieldsNumber;
};

const HoningPieceResults = ({ data }: Props) => {
  const [expand, setExpand] = useState(false);
  const { getHoningByLvl } = useHoningState();

  const {
    honing_start,
    honing_end,
    tier,
    type,
    upgrades,
    totalCosts: totalUpgradeCosts,
  } = data;

  const showMore = expand && upgrades.length > 0;
  const drawerAnimProps = {
    variants: {
      collapsed: {
        height: 0,
      },
      expand: {
        height: "auto",
      },
    },
    initial: "collapsed",
    animate: "expand",
    exit: "collapsed",
    transition: { duration: 0.5 },
  };

  const iconAnimProps = {
    variants: {
      initial: {
        rotate: 0,
      },
      expand: {
        rotate: 180,
      },
    },
    initial: "initial",
    animate: expand ? "expand" : "initial",
  };

  const lvlAnimProps = {
    variants: {
      initial: (i: number) => ({
        x: 500,
        opacity: 0,
        // transition: { delay: i * 0.03, duration: 0.5 },
      }),
      expand: (i: number) => ({
        x: 0,
        opacity: 1,
        transition: { delay: i * 0.03, duration: 0.5 },
      }),
      remove: (i: number) => ({
        x: 500,
        opacity: 0,
        transition: { delay: i * 0.03, duration: 0.5 },
      }),
    },
    initial: "initial",
    animate: expand ? "expand" : "initial",
    exit: "remove",
    transition: { duration: 0.5 },
  };

  const startGearScore = getHoningByLvl(tier, type, honing_start)?.ilvl;
  const endGearScore = getHoningByLvl(tier, type, honing_end)?.ilvl;

  return (
    <Container>
      <Total>
        <TotalHeader onClick={() => setExpand((v) => !v)}>
          <ArrowIcon {...iconAnimProps} className="arrow-icon">
            <FaAngleDown />
            {/* <MdArrowDropDown /> */}
          </ArrowIcon>
          <H>
            <span>
              {startGearScore}
              <MdDoubleArrow />
              {endGearScore}
            </span>
          </H>
        </TotalHeader>
        <TotalContent>
          {upgrades.length === 0 && <NoResults>No materials needed.</NoResults>}
          {upgrades.length > 0 && (
            <MatsWrapper>
              {Object.entries(totalUpgradeCosts).map(([mat, cost]) => (
                <TotalMats
                  key={mat}
                  tier={tier}
                  material={mat as MaterialTypes}
                  cost={cost}
                />
              ))}
            </MatsWrapper>
          )}
        </TotalContent>
      </Total>

      <AnimatePresence>
        {showMore && (
          <LevelTotalContainer
            {...drawerAnimProps}
            onClick={() => console.log(data)}
          >
            {upgrades.map((upgradeLvl, i) => (
              <LevelTotal key={`${data.id}-${i}`} {...lvlAnimProps} custom={i}>
                <SubHeader>
                  <InfoLabel
                    tooltipTitle="honing level"
                    tooltipDescription={`Honing from level ${
                      honing_start + i
                    } to ${honing_start + i + 1}.`}
                  >
                    {honing_start + i}
                    <Arrow>-&gt;</Arrow>
                    {honing_start + i + 1}
                  </InfoLabel>
                  <InfoLabel
                    tooltipTitle="success rate"
                    tooltipDescription="Base honing success rate (does not include rate up materials)."
                  >
                    {upgradeLvl.honingLvl.initial_success_rate * 100}%
                  </InfoLabel>
                  <InfoLabel
                    tooltipTitle="expected value"
                    tooltipDescription={`Average number of trials estimated to succeed honing. Less than ${prettyNumber(
                      upgradeLvl.expectedValue
                    )} tap(s) is considered lucky. More than ${prettyNumber(
                      upgradeLvl.expectedValue
                    )} tap(s) is unlucky.`}
                  >
                    {prettyNumber(upgradeLvl.expectedValue)}
                  </InfoLabel>
                </SubHeader>
                <MatsWrapper>
                  {Object.entries(upgradeLvl.costs).map(([mat, cost]) => (
                    <Mats
                      key={mat}
                      tier={tier}
                      material={mat as MaterialTypes}
                      cost={cost}
                    />
                  ))}
                </MatsWrapper>
              </LevelTotal>
            ))}
          </LevelTotalContainer>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default HoningPieceResults;
