import { useQuery } from 'react-query';
import styled from 'styled-components';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { AiringTodayTv, IGetMoviesResult } from '../../api';
import { makeImagePath } from '../../utils';
import { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faInfoCircle,
  faPlay,
  faPlus,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import SimilarTv from '../../Routes/SimilarTv';
import {
  ArrowBtn,
  ArrowBox_L,
  ArrowBox_R,
  Slider,
  Row,
  Box,
  rowVariants,
  SliderTitle,
  BoxVariants,
  Logo,
  Overlay,
  BigMovie,
  BigCover,
  BigTitleWrapper,
  BigTitle,
  SmallTitle,
  BigBtnWrapper,
  BigMoreBtn,
  BigOverview,
  BigBtn,
} from '../../Style/MovieStyle';

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

const offset = 6;

function AiringTv() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>('/tv/:movieId');
  const { scrollY } = useScroll();
  const { data } = useQuery<IGetMoviesResult>(
    ['movies', 'AiringToday'],
    AiringTodayTv
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = data.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };

  const onOverlayClick = () => history.push('/tv');
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((tv) => tv.id === +bigMovieMatch.params.movieId);
  return (
    <>
      <Slider>
        <SliderTitle>오늘 방영되는 시리즈</SliderTitle>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            variants={rowVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            transition={{ type: 'tween', duration: 1 }}
            key={index}>
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((tv) => (
                <Box
                  layoutId={tv.id + ''}
                  key={tv.id}
                  variants={BoxVariants}
                  initial='noraml'
                  whileHover='hover'
                  onClick={() => onBoxClicked(tv.id)}
                  transition={{ type: 'tween' }}
                  bgPhoto={makeImagePath(tv.backdrop_path, 'w500')}>
                  <Logo src='/img/Netflix_N_logo.svg.png' />
                </Box>
              ))}
            <ArrowBox_L onClick={incraseIndex}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </ArrowBox_L>
            <ArrowBox_R onClick={incraseIndex}>
              <FontAwesomeIcon icon={faChevronRight} />
            </ArrowBox_R>
          </Row>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}></Overlay>
            <BigMovie
              layoutId={bigMovieMatch.params.movieId}
              style={{ top: scrollY.get() + 30 }}>
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), URL(${makeImagePath(
                        clickedMovie.backdrop_path,
                        'w500'
                      )})`,
                    }}
                  />
                  <BigTitleWrapper>
                    <BigTitle>{clickedMovie.name}</BigTitle>{' '}
                    <SmallTitle>
                      {clickedMovie.original_name} |{' '}
                      {clickedMovie.first_air_date.slice(0, 4)}{' '}
                    </SmallTitle>
                    <BigBtnWrapper>
                      <Play
                        style={{
                          margin: '10px 40px',
                          marginRight: '10px',
                        }}>
                        <FontAwesomeIcon
                          icon={faPlay}
                          style={{ fontSize: '20px' }}
                        />
                        재생
                      </Play>
                      <BigMoreBtn>
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{ fontSize: '20px' }}
                        />
                      </BigMoreBtn>
                      <BigMoreBtn>
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          style={{ fontSize: '16px' }}
                        />
                      </BigMoreBtn>
                    </BigBtnWrapper>
                    <SmallTitle>
                      {[1, 2, 3, 4, 5].map((score) =>
                        score <= Math.round(clickedMovie.vote_average / 2) ? (
                          <span
                            style={{
                              color: '#FEE501',
                              fontSize: '20px',
                            }}>
                            ★
                          </span>
                        ) : (
                          <span style={{ fontSize: '20px' }}>★</span>
                        )
                      )}{' '}
                      {clickedMovie.vote_average}
                    </SmallTitle>
                    <BigOverview>{clickedMovie.overview}</BigOverview>
                    <SimilarTv />
                  </BigTitleWrapper>

                  <BigBtn onClick={onOverlayClick}>✕</BigBtn>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
export default AiringTv;
