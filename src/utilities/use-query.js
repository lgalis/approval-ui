import { useLocation } from 'react-router-dom';

const useQuery = (requiredParams = []) => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  return [
    requiredParams.reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: query.get(curr)
      }),
      {}
    ),
    search,
    query
  ];
};

export default useQuery;
