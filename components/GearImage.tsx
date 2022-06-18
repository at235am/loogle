import Image, { StaticImageData } from "next/image";

// images:
import Head from "../assets/gear/head.png";
import Shoulder from "../assets/gear/shoulder.png";
import Chest from "../assets/gear/chest.png";
import Pants from "../assets/gear/pants.png";
import Gloves from "../assets/gear/gloves.png";
import Weapon from "../assets/gear/weapon.png";
import styled from "@emotion/styled";

type ImgProps = {
  img: StaticImageData;
  size: number;
};

type GearImages = {
  head: ImgProps;
  shoulder: ImgProps;
  chest: ImgProps;
  pants: ImgProps;
  gloves: ImgProps;
  weapon: ImgProps;
};

export type GearPiece = keyof GearImages;

const defaultSize = 72;

const imageMap: GearImages = {
  head: { img: Head, size: defaultSize },
  shoulder: { img: Shoulder, size: defaultSize },
  chest: { img: Chest, size: defaultSize },
  pants: { img: Pants, size: defaultSize },
  gloves: { img: Gloves, size: defaultSize },
  weapon: { img: Weapon, size: defaultSize },
};

type Props = {
  piece: GearPiece;
  size?: number;
};

const Img = styled.img`
  image-rendering: pixelated;
  /* filter: blur(1px); */
  /* object-fit: cover; */
  /* width: 120%; */
  /* height: 120%; */
  /* width: 75%; */
  /* height: 75%; */
`;

const GearImage = ({ piece = "chest", size }: Props) => {
  const materialData = imageMap[piece];
  const x = size ?? materialData.size;
  const img = materialData.img;

  // return <Image src={img} width={x} height={x} />;
  return <Img src={img.src} width={x} height={x} />;
};

export default GearImage;
