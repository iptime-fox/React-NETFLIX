import { useQuery } from 'react-query';
import styled from 'styled-components';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { TopRatedMovie, IGetMoviesResult } from '../../api';
import { makeImagePath } from '../../utils';
import { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faPlay,
  faPlus,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import SimilarMovie from '../../Routes/SimilarMovie';
import {
  Play,
  ArrowBtn,
  ArrowBox_L,
  ArrowBox_R,
  Slider,
  Row,
  Box,
  rowVariants,
  SliderTitle,
  BoxVariants,
  Overlay,
  offset,
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

function TopMV() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>('/movies/:movieId');
  const { scrollY } = useScroll();
  const { data } = useQuery<IGetMoviesResult>(
    ['movies', 'TopRated'],
    TopRatedMovie
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

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
    window.location.reload();
  };

  const onOverlayClick = () => history.push('/');
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);

  return (
    <>
      <Slider>
        <SliderTitle>Top 20 영화</SliderTitle>
        <AnimatePresence
          custom={isRight}
          initial={false}
          onExitComplete={toggleLeaving}>
          <Row
            variants={rowVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            custom={isRight}
            transition={{ type: 'tween', duration: 1 }}
            key={index}>
            {data?.results
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={movie.id + ''}
                  key={movie.id}
                  variants={BoxVariants}
                  initial='noraml'
                  whileHover='hover'
                  onClick={() => onBoxClicked(movie.id)}
                  transition={{ type: 'tween' }}
                  bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}></Box>
              ))}
            <ArrowBox_L onClick={() => incraseIndex(-1)}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </ArrowBox_L>
            <ArrowBox_R onClick={() => incraseIndex(+1)}>
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
                    <BigTitle>{clickedMovie.title}</BigTitle>{' '}
                    <SmallTitle>
                      {clickedMovie.original_title} |{' '}
                      {clickedMovie.release_date.slice(0, 4)}{' '}
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
                          <span style={{ color: '#FEE501', fontSize: '20px' }}>
                            ★
                          </span>
                        ) : (
                          <span style={{ fontSize: '20px' }}>★</span>
                        )
                      )}{' '}
                      {clickedMovie.vote_average}
                    </SmallTitle>
                    <BigOverview>{clickedMovie.overview}</BigOverview>
                    <SimilarMovie />
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
export default TopMV;
