// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// state:
import { useState } from "react";
import { RiXboxFill } from "react-icons/ri";

const Container = styled.div`
  padding: 1rem 0;
`;

const Content = styled.div`
  width: 55%;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// general

const Cutter = styled.section`
  background-color: grey;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  padding: 1rem;
`;

// includes malus
const Engraving = styled.div`
  background-color: black;

  display: flex;
  flex-direction: row;
  gap: 1rem;

  align-items: center;

  padding: 1rem;
`;

// mining, maximise one, maximise two, maximise both
// later: probability specifics....
const Button = styled.div``;

type Trial = { trial: boolean | null };
const Node = styled.div<Trial>`
  width: 10px;
  height: 10px;

  border: 1px solid white;
  background-color: ${(props) =>
    props.trial ? `blue` : props.trial === null ? `none` : `red`};

  transform: rotate(45deg);
`;

// specific

const NodeInput = styled.div``;

type CustomButtonProps = {
  svg: SVGElement | null;
  text: string;
  function: Function | null;
};

const CustomButton = (props: CustomButtonProps) => {
  return <div>Yo!</div>;
};

type trials = {
  position: number;
  trials: (boolean | null)[];
};

const StoneCutter = () => {
  const [nodes, setNodes] = useState<number>(6);
  const [probability, setProbability] = useState<number>(0.75);
  // Array(3) for Engraving 1, Engraving 2, and Malus
  const [engravings, setEngravings] = useState<trials[]>(
    Array(3).fill({ position: 0, trials: Array(nodes).fill(null) })
  );

  const selectNodes = (nodes: number) => {
    let newTrials = Array(nodes).fill(null);
    setNodes(nodes);
    setEngravings(Array(3).fill({ position: 0, trials: newTrials }));
    console.log(nodes);
    console.log(engravings);
  };

  const maximise = (engraving: number) => {
    if (0 <= engraving && engraving <= 2) {
      console.log("Invalid engraving maximisation selection.");
      console.log("0 - Maximise engraving one.");
      console.log("1 - Maximise engraving two.");
      console.log("2 - Maxismise both engravings.");
      return;
    }
    // probability calculations here
  };

  const succeed = (engraving: number, succeed: boolean) => {
    let updatedSuccess = { ...engravings[engraving] };
    updatedSuccess.trials = [...engravings[engraving].trials];
    if (updatedSuccess.position < nodes) {
      succeed
        ? (updatedSuccess.trials[updatedSuccess.position] = true)
        : (updatedSuccess.trials[updatedSuccess.position] = false);
      updatedSuccess.position++;
      let updatedEngravings: trials[] = [];
      engravings.map((x, index) => {
        updatedEngravings[index] = {
          position: x.position,
          trials: [...x.trials],
        };
      });
      console.log(updatedEngravings);
      updatedEngravings[engraving] = updatedSuccess;
      console.log(updatedSuccess);
      setEngravings(updatedEngravings);
    }
  };

  return (
    <Container>
      <Content>
        <div
          onClick={() => {
            console.log(nodes);
            console.log(probability);
          }}
        >
          StoneCutter
        </div>
        <Cutter>
          <Button>Maximise First</Button>
          <Button>Maximise Second</Button>
          <Button>Maximise Both</Button>
          <Button>Undo</Button>
          <Button
            onClick={() => {
              console.log(engravings);
            }}
          >
            Reset
          </Button>
          <Button
            onClick={() => {
              selectNodes(10);
            }}
          >
            Change Node Amount
          </Button>
          {engravings.map((engraving, index) => (
            <Engraving key={index}>
              {engraving.trials.map((trial, index) => (
                <Node key={index} trial={trial} />
              ))}
              <Button
                onClick={() => {
                  succeed(index, true);
                }}
              >
                Success
              </Button>
              <Button
                onClick={() => {
                  succeed(index, false);
                }}
              >
                Fail
              </Button>
            </Engraving>
          ))}
        </Cutter>
      </Content>
    </Container>
  );
};

export default StoneCutter;
