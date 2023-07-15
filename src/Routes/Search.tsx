import { useQuery } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom';
import { styled } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faInfoCircle,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { makeImagePath } from '../utils';

const API_KEY = '4ddf49e73410d99796b5b864968477b4';
const BASE_PATH = 'https://api.themoviedb.org/3';

const Wrapper = styled.div`
  background-color: black;
  margin: 6rem auto;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchList = styled(motion.div)`
  padding: 3rem;
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

export interface IGenre {
  id: number;
  name: string;
}

interface IMovie {
  id: number;
  name: string;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  original_title: string;
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
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('keyword');
  const searchMulti = () => {
    return fetch(
      `${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}`
    ).then((response) => response.json());
  };
  const { data, isLoading } = useQuery<IGetTvResult>(
    ['tv', 'top_rated'],
    searchMulti
  );
  const onBoxClicked = (movieId: number) => {
    history.push(`/search/${movieId}`);
  };
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
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
        </>
      )}
    </Wrapper>
  );
}
export default Search;
