import { useQuery } from 'react-query';
import styled from 'styled-components';
import { useScroll } from 'framer-motion';
import { getMovies, IGetMoviesResult } from '../api';
import { makeImagePath } from '../utils';
import { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPlay } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';

import PopularMV from '../Components/MovieSlide/PopularMovies';
import TopMV from '../Components/MovieSlide/TopMovies';
import UpcomingMV from '../Components/MovieSlide/UpcomingMovies';
import NowPlayingMv from '../Components/MovieSlide/NowPlayingMovies';
import {
  Banner,
  Loader,
  Wrapper,
  Title,
  Overview,
  BannerBtnWrapper,
  Play,
  MoreInfo,
  offset,
  SliderWrapper,
} from '../Style/HomeStyle';

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>('/movies/:movieId');
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ['movies', 'nowPlaying'],
    getMovies
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
      const totalMovies = data.results.length - 2;
      const maxIndex =
        totalMovies % offset === 0
          ? Math.floor(totalMovies / offset) - 1
          : Math.floor(totalMovies / offset);

      right === 1
        ? setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
        : setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const moreInfoClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
    // window.location.reload();
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
            <Title>{data?.results[0].original_title}</Title>
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
            <NowPlayingMv></NowPlayingMv>
            <PopularMV></PopularMV>
            <TopMV></TopMV>
            <UpcomingMV></UpcomingMV>
          </SliderWrapper>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
