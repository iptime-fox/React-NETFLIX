import { useQuery } from 'react-query';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { styled } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { makeImagePath } from '../utils';

const API_KEY = '4ddf49e73410d99796b5b864968477b4';
const BASE_PATH = 'https://api.themoviedb.org/3';

const Wrapper = styled.div`
  background-color: black;
  margin: 4rem auto;
`;

const SearchKey = styled.p`
  padding: 3rem 4rem 1.5rem;
  font-weight: 400;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchList = styled(motion.div)`
  padding: 3rem;
  padding-top: 0;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(5, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 150px;
  margin-bottom: 3rem;
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
  /* @media screen and (max-width: 1400px) {
    height: 150px;
  } */
`;

const BoxImg = styled.img`
  height: 150px;
`;

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

const Overlay = styled(motion.div)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 150vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 50vw;
  height: auto;
  background-color: black;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 5px;
  overflow: hidden;
  @media screen and (max-width: 1400px) {
    width: 60vw;
  }
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

const BigBtnWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: transparent;
`;

const BigMoreBtn = styled.button`
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

const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 0 40px;
  width: 90%;
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
  font-size: 16px;
  position: absolute;
  top: 10px;
  right: 10px;
  &:hover {
    background-color: #fff;
    color: rgba(0, 0, 0, 0.7);
  }
`;

export interface IGenre {
  id: number;
  name: string;
}

interface IMovie {
  id: number;
  name: string;
  media_type: string;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  original_title: string;
  original_name: string;
  first_air_date: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  genres: IGenre[];
}

export interface IGetMoviesResult {
  dates: {
    maximun: string;
    minimun: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface IGetTvResult {
  dates: {
    maximun: string;
    minimun: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

function Search() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>('/search/:movieId');
  const location = useLocation();
  const { scrollY } = useScroll();
  const keyword = new URLSearchParams(location.search).get('keyword');
  const searchMulti = () => {
    return fetch(
      `${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}&include_adult=false&language=ko`
    ).then((response) => response.json());
  };
  const { data, isLoading } = useQuery<IGetTvResult>(
    ['tv', 'top_rated'],
    searchMulti
  );
  const onBoxClicked = (movieId: number) => {
    history.push(`/search/${movieId}`);
  };
  const onOverlayClick = () => history.push('/search');
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <SearchKey>' {keyword} ' (으)로 검색한 결과입니다.</SearchKey>
          <SearchList>
            {data?.results.map((movie) => (
              <Box
                layoutId={movie.id + ''}
                key={movie.id}
                variants={BoxVariants}
                initial='noraml'
                whileHover='hover'
                onClick={() => onBoxClicked(movie.id)}
                transition={{ type: 'tween' }}
                bgPhoto={makeImagePath(
                  movie.backdrop_path || '',
                  'w500'
                )}></Box>
            ))}
          </SearchList>
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
                        <BigTitle>
                          {clickedMovie.title
                            ? clickedMovie.title
                            : clickedMovie.name}
                        </BigTitle>{' '}
                        <SmallTitle>
                          {clickedMovie.original_title
                            ? clickedMovie.original_title
                            : clickedMovie.original_name}
                          |{' '}
                          {clickedMovie.release_date
                            ? clickedMovie.release_date.slice(0, 4)
                            : clickedMovie.first_air_date.slice(0, 4)}{' '}
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
                        <BigOverview>{clickedMovie.overview}</BigOverview>
                      </BigTitleWrapper>

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
export default Search;
