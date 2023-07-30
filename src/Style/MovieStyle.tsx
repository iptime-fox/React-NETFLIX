import { styled } from 'styled-components';
import { motion } from 'framer-motion';

export const Play = styled.div`
  width: 100px;
  height: auto;
  padding: 0.65rem 1rem;
  background-color: #fff;
  display: flex;
  color: black;
  border-radius: 5px;
  justify-content: center;
  font-weight: 400;
  column-gap: 0.5rem;
  align-items: center;
  transition: 0.4s;
  &:hover {
    background-color: rgba(188, 188, 188, 0.7);
    color: #fff;
  }
`;

export const ArrowBtn = styled(motion.div)`
  position: absolute;
  display: flex;
  top: 40%;
  z-index: 98;
  font-size: 2.5rem;
  opacity: 0;
  &:hover {
    cursor: pointer;
    scale: 1.1;
  }
`;

export const ArrowBox_L = styled(ArrowBtn)`
  left: -2rem;
`;

export const ArrowBox_R = styled(ArrowBtn)`
  right: -2rem;
`;

export const Slider = styled.div`
  position: relative;

  margin: 0px 60px;

  &:hover ${ArrowBtn} {
    opacity: 1;
  }
`;

export const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

export const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 200px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  border-radius: 5px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  cursor: pointer;
  @media screen and (max-width: 1400px) {
    height: 150px;
  }
  @media screen and (max-width: 1200px) {
    height: 120px;
  }
  @media screen and (max-width: 980px) {
    height: 100px;
  }
`;

export const SliderTitle = styled.p`
  font-size: 18px;
  font-weight: 400;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 0.25rem;
`;

export const rowVariants = {
  hidden: (right: number) => {
    return {
      x: right === 1 ? window.innerWidth + 5 : -window.innerWidth - 5,
    };
  },
  visible: {
    x: 0,
    y: 0,
  },
  exit: (right: number) => {
    return {
      x: right === 1 ? -window.innerWidth - 5 : window.innerWidth + 5,
    };
  },
};

export const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    zIndex: 99,
    scale: 1.3,
    y: -25,
    transition: { delay: 0.5, type: 'tween', duration: 0.3 },
  },
};

export const Logo = styled.img`
  width: 15px;
  position: absolute;
  display: flex;
  top: 10px;
  margin-left: 10px;
`;

export const offset = 6;

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  z-index: 99;
`;

export const BigMovie = styled(motion.div)`
  position: fixed;
  width: 50vw;
  height: auto;
  background-color: black;
  left: 0;
  top: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 5px;
  overflow: auto;
  z-index: 100;
  @media screen and (max-width: 1400px) {
    width: 60vw;
  }
  @media screen and (max-width: 1400px) {
    width: 70vw;
  }
  @media screen and (max-width: 1200px) {
    width: 80vw;
  }
`;
export const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 450px;
`;

export const BigTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  top: -170px;
  @media screen and (max-width: 1400px) {
    top: -300px;
  }
`;

export const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 35px;
  padding-bottom: 10px;
  font-size: 36px;
  font-weight: 600;
`;

export const SmallTitle = styled.h4`
  color: #fff;
  padding: 5px 40px 20px;
  font-size: 20px;
  font-weight: 600;
`;

export const BigBtnWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: transparent;
`;

export const BigMoreBtn = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid rgba(109, 109, 110, 0.7);
  background-color: transparent;
  border-radius: 20px;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 35px;
  margin-right: 10px;
  color: #ffffffd5;
  transition: 0.4s;
  &:hover {
    border: 2px solid #ffffffd5;
  }
`;

export const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 0 40px;
  width: 90%;
`;

export const BigBtn = styled.button`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0.5rem;
  font-size: 16px;
  position: absolute;
  top: 10px;
  right: 10px;
  &:hover {
    background-color: #fff;
    color: rgba(0, 0, 0, 0.7);
  }
`;
