import { useQuery } from 'react-query';
import styled from 'styled-components';
import { BASE_PATH, IGetMoviesResult, API_KEY } from '../api';
import { useRouteMatch } from 'react-router-dom';
import { makeImagePath } from '../utils';
import { motion } from 'framer-motion';

const SimilarWrapper = styled.div`
  padding: 10px 40px;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(4, 1fr);
`;

const Similar = styled(motion.div)<{ bgPhoto: string }>`
  height: 300px;
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  border-radius: 5px;
  @media screen and (max-width: 1500px) {
    height: 250px;
  }
`;

function SimilarMovie() {
  const bigMovieMatch = useRouteMatch<{ movieId: string }>('/movies/:movieId');
  const keyword = bigMovieMatch?.params.movieId;
  const searchMulti = () => {
    return fetch(
      `${BASE_PATH}/movie/${keyword}/similar?api_key=${API_KEY}&language=ko`
    ).then((response) => response.json());
  };
  const { data } = useQuery<IGetMoviesResult>(
    ['movie', 'similar'],
    searchMulti
  );

  return (
    <>
      <p
        style={{
          padding: '40px 40px 20px',
          fontWeight: '400',
          fontSize: '18px',
        }}>
        비슷한 콘텐츠
      </p>
      <SimilarWrapper>
        {data?.results.slice(0, 4).map((movie) => (
          <Similar
            key={movie.id}
            bgPhoto={
              makeImagePath(movie.poster_path)
                ? makeImagePath(movie.poster_path || '', 'w500')
                : makeImagePath(movie.backdrop_path || '', 'w500')
            }></Similar>
        ))}
      </SimilarWrapper>
    </>
  );
}

export default SimilarMovie;
