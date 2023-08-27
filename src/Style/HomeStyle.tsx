import { styled } from 'styled-components';

export const Wrapper = styled.div`
  background: black;
  height: auto;
`;

export const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.5)
    ),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

export const Title = styled.h2`
  font-size: 60px;
  width: 70%;
  margin-bottom: 20px;
  font-weight: 400;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  line-height: 3.5rem;
`;

export const Overview = styled.p`
  font-size: 20px;
  width: 50%;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: keep-all;
  overflow: hidden;
`;

export const BannerBtnWrapper = styled.div`
  display: flex;
  margin-top: 1.5rem;
  column-gap: 0.75rem;
`;

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

export const MoreInfo = styled.div`
  width: 130px;
  height: auto;
  padding: 0.65rem 1rem;
  background-color: rgba(109, 109, 110, 0.7);
  display: flex;
  color: #fff;
  border-radius: 5px;
  justify-content: center;
  font-weight: 400;
  column-gap: 0.5rem;
  align-items: center;
  &:hover {
    background-color: rgba(48, 48, 48, 0.7);
  }
`;
export const offset = 6;
export const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 230px;
  position: relative;
  top: -170px;
  @media screen and (max-width: 1400px) {
    row-gap: 200px;
  }
  @media screen and (max-width: 1200px) {
    row-gap: 160px;
  }
  @media screen and (max-width: 980px) {
    row-gap: 120px;
  }
  margin-bottom: 6rem;
`;
