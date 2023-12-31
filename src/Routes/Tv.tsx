import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getTv, IGetMoviesResult } from '../api';
import { makeImagePath } from '../utils';
import { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPlay } from '@fortawesome/free-solid-svg-icons';
import TopTv from '../Components/TvSlide/TopTv';
import AiringTv from '../Components/TvSlide/AiringTv';
import PopTv from '../Components/TvSlide/PopularTv';
import TvLatest from '../Components/TvSlide/LatestTv';
import { Helmet } from 'react-helmet';

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
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

const Title = styled.h2`
  font-size: 60px;
  width: 70%;
  margin-bottom: 20px;
  font-weight: 400;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  line-height: 3.5rem;
`;

const Overview = styled.p`
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

const BannerBtnWrapper = styled.div`
  display: flex;
  margin-top: 1.5rem;
  column-gap: 0.75rem;
`;

const Play = styled.div`
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

const MoreInfo = styled.div`
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

const offset = 6;
const SliderWrapper = styled.div`
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

function Tv() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>('/tv/:movieId');
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ['movies', 'nowPlaying'],
    getTv
  );
  const [index, setIndex] = useState(0);
  const [isRight, setIsRight] = useState(1);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const incraseIndex = (right: number) => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setIsRight(right);
      const totalTv = data.results.length - 2;
      const maxIndex =
        totalTv % offset === 0
          ? Math.floor(totalTv / offset) - 1
          : Math.floor(totalTv / offset);
      right === 1
        ? setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
        : setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const moreInfoClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
    window.location.reload();
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Netflix</title>
      </Helmet>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || '')}>
            <Title>{data?.results[0].original_name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
            <BannerBtnWrapper>
              <Play>
                <FontAwesomeIcon icon={faPlay} style={{ fontSize: '20px' }} />
                재생
              </Play>
              <MoreInfo
                onClick={() => moreInfoClicked(Number(data?.results[0].id))}>
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  style={{ fontSize: '20px' }}
                />
                상세 정보
              </MoreInfo>
            </BannerBtnWrapper>
          </Banner>
          <SliderWrapper>
            <TopTv></TopTv>
            <AiringTv></AiringTv>
            <PopTv></PopTv>
            <TvLatest></TvLatest>
          </SliderWrapper>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
