import styled from "@emotion/styled";
import { HoningFields } from "../pages/honing";

// icons:
import {
  MdArrowRightAlt,
  MdKeyboardArrowRight,
  MdDoubleArrow,
  MdRemove,
} from "react-icons/md";
import { ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GearImage from "./GearImage";

import StepperInput from "./inputs/StepperInput";

const squareSize = 7;

const Container = styled.div`
  position: relative;
  /* overflow: hidden; */

  width: ${squareSize}rem;
  height: ${squareSize}rem;
  min-width: ${squareSize}rem;
  min-height: ${squareSize}rem;

  background-color: ${({ theme }) => theme.colors.surface.dark};
  /* background-color: #fff; */

  border-radius: 16px;

  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
`;

const PositionContainer = styled.div`
  /* border: 1px solid red; */
  /* overflow: hidden; */

  position: absolute;
  bottom: 0;
  /* width: 100%; */

  border-radius: 16px;

  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);

  margin-bottom: 5px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Header = styled.h2`
  /* border: 1px solid red; */
  /* overflow: hidden; */

  height: 2.25rem;
  max-height: 2.25rem;

  /* position: absolute; */
  /* top: 0; */
  /* margin-top: 5px; */
  padding: 0.5rem;
  width: 100%;

  background-color: ${({ theme }) => theme.colors.background.dark};

  border-radius: 16px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;

  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 600;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ArrowIcon = styled.span`
  width: 1.25rem;
  height: 1.25rem;
  min-width: 1.25rem;
  min-height: 1.25rem;

  border-radius: 50%;
  /* background-color: #fff; */

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 11px;
    height: 11px;
  }
`;

type HoningPieceProps = {
  min?: number;
  max?: number;
  data: HoningFields;
  handleChange: (value: HoningFields) => void;
};

const HoningPieceInput = ({
  min = 0,
  max = 15,
  data,
  handleChange,
}: HoningPieceProps) => {
  const numToStr = (value: number) => (isNaN(value) ? "" : value.toString());
  // const strToNum = (value: string) => (isNaN(value) ? "" : value.toString());

  const validateInput = (value: string) => {
    const num = parseInt(value);

    if (num < min) return min;
    else if (num > max) return max;
    else if (isNaN(num)) return 0;
    else return num;
  };

  const updateField = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const rawInput = e.target.value;
    const newValue = validateInput(rawInput);

    handleChange({
      ...data,
      [key]: rawInput === "" ? "" : numToStr(newValue),
      // honing_end: numToStr(newEnd),
    });
  };

  const startHandler = (e: ChangeEvent<HTMLInputElement>) =>
    updateField(e, "honing_start");

  const endHandler = (e: ChangeEvent<HTMLInputElement>) =>
    updateField(e, "honing_end");

  const startStepper = (value: number) =>
    handleChange({ ...data, honing_start: value.toString() });

  const endStepper = (value: number) =>
    handleChange({ ...data, honing_end: value.toString() });

  const startBlurHandler = () => {
    const { honing_start, honing_end } = data;

    const start = validateInput(honing_start);
    const end = validateInput(honing_end);

    const newEnd = start >= end ? start : end;

    handleChange({
      ...data,
      honing_start: honing_start === "" ? honing_end : honing_start,
      honing_end: numToStr(newEnd),
    });
  };

  const endBlurHandler = () => {
    const { honing_end, honing_start } = data;

    const start = validateInput(honing_start);
    const end = validateInput(honing_end);

    const newStart = start >= end ? end : start;

    handleChange({
      ...data,
      honing_end: honing_end === "" ? honing_start : honing_end,
      honing_start: numToStr(newStart),
    });
  };

  return (
    <Container className="yes">
      <Header>
        {/* <GearImage piece={data.piece} size={20} /> */}
        {data.piece}
      </Header>
      <GearImage piece={data.piece} size={50} />

      <PositionContainer>
        <StepperInput
          min={min}
          max={max}
          value={data.honing_start}
          onChange={startHandler}
          onBlur={startBlurHandler}
          stepper={startStepper}
        />

        <ArrowIcon>
          <MdDoubleArrow />
        </ArrowIcon>
        <StepperInput
          min={min}
          max={max}
          value={data.honing_end}
          onChange={endHandler}
          onBlur={endBlurHandler}
          stepper={endStepper}
        />
      </PositionContainer>
    </Container>
  );
};

export default HoningPieceInput;
