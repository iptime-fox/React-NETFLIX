import { useQuery } from 'react-query';
import styled from 'styled-components';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { getMovies, IGetMoviesResult } from '../api';
import { makeImagePath } from '../utils';
import { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faInfoCircle,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';

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

const ArrowBtn = styled(motion.div)`
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

const ArrowBox_L = styled(ArrowBtn)`
  left: -2rem;
`;

const ArrowBox_R = styled(ArrowBtn)`
  right: -2rem;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  margin: 0px 60px;

  &:hover ${ArrowBtn} {
    opacity: 1;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
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
`;

const SliderTitle = styled.p`
  font-size: 18px;
  font-weight: 400;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 0.25rem;
`;

const rowVariants = {
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

const BoxVariants = {
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

const Logo = styled.img`
  width: 15px;
  position: absolute;
  display: flex;
  top: 10px;
  margin-left: 10px;
`;

const Overlay = styled(motion.div)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 150vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const offset = 6;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 60vw;
  height: 90vh;
  background-color: black;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 5px;
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 450px;
`;

const BigTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  top: -170px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 35px;
  padding-bottom: 10px;
  font-size: 36px;
  font-weight: 600;
`;

const SmallTitle = styled.h4`
  color: #fff;
  padding: 5px 40px 20px;
  font-size: 20px;
  font-weight: 600;
`;

const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 40px;
  position: absolute;
  top: 80%;
  transform: translateY(-80%);
  right: 0;
  width: 70%;
`;

const BigBtn = styled.button`
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
  font-size: 18px;
  position: absolute;
  top: 10px;
  right: 10px;
`;

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>('/movies/:movieId');
  const { scrollY } = useScroll();
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

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const moreInfoClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const onOverlayClick = () => history.push('/');
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || '')}>
            <Title>{data?.results[0].title}</Title>
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
          <Slider>
            <SliderTitle>지금 상영하는 영화</SliderTitle>
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
                  .slice(1)
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
                      bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}>
                      <Logo src='/img/Netflix_N_logo.svg.png' />
                    </Box>
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
                        <Play style={{ margin: '10px 40px' }}>
                          <FontAwesomeIcon
                            icon={faPlay}
                            style={{ fontSize: '20px' }}
                          />
                          재생
                        </Play>
                        <SmallTitle>
                          {[1, 2, 3, 4, 5].map((score) =>
                            score <=
                            Math.round(clickedMovie.vote_average / 2) ? (
                              <span
                                style={{ color: '#FEE501', fontSize: '20px' }}>
                                ★
                              </span>
                            ) : (
                              <span style={{ fontSize: '20px' }}>★</span>
                            )
                          )}{' '}
                          {clickedMovie.vote_average}
                        </SmallTitle>
                      </BigTitleWrapper>

                      <BigOverview>{clickedMovie.overview}</BigOverview>
                      <BigBtn onClick={onOverlayClick}>✕</BigBtn>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
