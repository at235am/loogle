import styled from "@emotion/styled";

import { ChangeEvent, FocusEventHandler, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { clamp } from "../../utils/utils";
import { MdAdd, MdRemove } from "react-icons/md";

const InputContainer = styled(motion.div)`
  position: relative;

  /* border-radius: 25px; */

  /* overflow: hidden; */
  /* padding: 0.5rem; */
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  min-height: 2rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border-radius: 2px;

  /* background-color: ${({ theme }) => theme.colors.background.main}; */
  /* background-color: ${({ theme }) => theme.colors.background.lighter}; */
  /* background-color: ${({ theme }) => theme.colors.surface.lighter}; */

  /* border: 1px solid red; */

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:focus-within {
    input {
      background-color: ${({ theme }) => theme.colors.background.dark};
    }
  }
`;

const Input = styled.input`
  z-index: 1;
  position: relative;

  border-radius: 50%;
  /* border-radius: 6px; */

  font-weight: 600;
  text-align: center;

  width: 90%;
  height: 90%;

  background-color: transparent;

  font-size: 0.8rem;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }

  &[type="number"] {
    appearance: textfield; /* Firefox */
  }
  &:focus {
    /* border: 2px solid ${({ theme }) => theme.colors.primary.main};
    border: 2px solid ${({ theme }) => theme.colors.onSurface.main}; */

    /* background-color: ${({ theme }) => theme.colors.background.dark}; */
  }

  &::selection {
    background: white;
    color: #222;
  }
`;

const ButtonContainer = styled(motion.div)`
  z-index: 0;
  position: absolute;
  width: 100%;

  border-radius: 20px;
  overflow: hidden;

  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  /* filter: blur(5px); */

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  /* background-color: ${({ theme }) => theme.colors.background.main}; */
  cursor: default;

  color: white;
  padding: 0.3rem;

  background-color: transparent;

  width: 100%;
  height: 2.25rem;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  /* padding: 0.2rem; */

  svg {
    /* width: 12px; */
    /* height: 12px; */
  }

  &:hover {
    .add {
      fill: ${({ theme }) => theme.colors.success.main};
    }

    .remove {
      fill: ${({ theme }) => theme.colors.danger.main};
    }
  }
`;

const BottomButton = styled(Button)`
  align-items: flex-end;
`;

type BubbleInputProps = {
  min?: number;
  max?: number;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void | undefined;
  stepper?: (value: number) => void;
};
const StepperInput = ({
  min = 0,
  max = 15,
  value,
  onChange,
  onBlur,
  stepper,
}: BubbleInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const bubbleAnimProps = {
    variants: {
      initial: {
        scaleY: 0,
        opacity: 0,
        // border: "0px solid white",
      },
      expand: {
        scaleY: 1,
        opacity: 1,
        // border: "3px solid white",
        // scale: 1.1,
      },
    },
    initial: "initial",
    animate: "expand",
    exit: "initial",

    transition: { duration: 0.25 },
  };

  const increment = () => {
    if (stepper) {
      const t = parseInt(value) ?? 0;
      stepper(clamp(t + 1, min, max));
    }
  };

  const decrement = () => {
    if (stepper) {
      const t = parseInt(value) ?? 0;
      stepper(clamp(t - 1, min, max));
    }
  };

  return (
    <InputContainer
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        onBlur && onBlur();
        setIsFocused(false);
      }}
    >
      <AnimatePresence>
        {isFocused && (
          <ButtonContainer {...bubbleAnimProps}>
            <Button
              type="button"
              onClick={(e) => {
                increment && increment();
              }}
            >
              <MdAdd className="add" shapeRendering="crispEdges" />
            </Button>{" "}
            <BottomButton
              type="button"
              onClick={(e) => {
                decrement && decrement();
              }}
            >
              <MdRemove className="remove" shapeRendering="crispEdges" />
            </BottomButton>
          </ButtonContainer>
        )}
      </AnimatePresence>

      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
      />
    </InputContainer>
  );
};

export default StepperInput;
