import styled from "@emotion/styled";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";

import { MdArrowDropDown } from "react-icons/md";

const Container = styled.div`
  z-index: 2;
  position: relative;
`;

const Options = styled(motion.ul)`
  z-index: 1;

  position: absolute;
  width: 100%;
  margin-top: 0.5rem;
  padding: 3px;

  border: 1px solid ${({ theme }) => theme.colors.surface.light};

  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.surface.main};
  background-color: ${({ theme }) => theme.colors.surface.dark};
`;

const Option = styled.li`
  cursor: pointer;
  color: white;
  border-radius: 5px;
  padding: 0.5rem;
  user-select: none;

  text-transform: uppercase;
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.darker};
    font-weight: 600;
  }
`;

const SelectedOption = styled.div`
  z-index: 2;
  position: relative;

  cursor: pointer;
  user-select: none;

  border-radius: 5px;
  padding: 0.5rem;
  /* padding-right: 0; */

  border: 1px solid ${({ theme }) => theme.colors.surface.light};
  background-color: ${({ theme }) => theme.colors.surface.dark};

  display: flex;
  justify-content: center;
  align-items: center;
  /* gap: 0.5rem; */
`;

const SelectedText = styled.p`
  /* color: white; */
  /* border: 1px solid red; */

  flex: 1;
  font-weight: 600;
  white-space: nowrap;

  text-transform: uppercase;
`;

const ArrowIcon = styled(motion.span)`
  background-color: ${({ theme }) => theme.colors.surface.lighter};

  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export type OptionType = {
  id: string;
  label: string | number;
};

type Props = {
  options: OptionType[];
  value: OptionType;
  onChange: Dispatch<SetStateAction<OptionType>>;
  className?: string;
};

const SelectInput = ({ options, value, onChange, className }: Props) => {
  const [showOptions, setShowOptions] = useState(false);

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
    animate: showOptions ? "expand" : "initial",

    // transition: { duration: 0.5 },
  };
  const optionsAnimProps = {
    variants: {
      initial: {
        y: -80,
        opacity: 0,
      },
      expand: {
        y: 0,
        opacity: 1,
      },
    },
    initial: "initial",
    animate: showOptions ? "expand" : "initial",
    exit: "initial",

    transition: { duration: 0.25 },
  };

  const toggleShowOptions = () => setShowOptions((v) => !v);

  return (
    <Container
      className={className}
      tabIndex={0}
      onBlur={() => setShowOptions(false)}
    >
      <SelectedOption onClick={toggleShowOptions}>
        <SelectedText>{value.label}</SelectedText>
        <ArrowIcon {...iconAnimProps}>
          <MdArrowDropDown />
        </ArrowIcon>
      </SelectedOption>
      <AnimatePresence>
        {showOptions && (
          <Options
            {...optionsAnimProps}
            role="listbox"
            aria-activedescendant={value.id}
          >
            {options.map((v) => (
              <Option
                key={v.id}
                role="option"
                aria-selected={value.id === v.id}
                onClick={() => {
                  onChange(v);
                  setShowOptions(false);
                }}
              >
                {v.label}
              </Option>
            ))}
          </Options>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default SelectInput;
