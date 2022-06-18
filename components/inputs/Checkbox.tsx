import styled from "@emotion/styled";

const Container = styled.div<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  min-width: ${({ size }) => size}px;
  min-height: ${({ size }) => size}px;

  background-color: #0f0;
`;

type Props = { size?: number };

const Checkbox = ({ size = 25 }: Props) => {
  return <Container size={size}></Container>;
};

export default Checkbox;
