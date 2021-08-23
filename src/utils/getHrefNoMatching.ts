import { generatePath } from 'react-router-dom';

// named this way temporarily to distinguish from useGetHrefForRoute, that
// performs pattern matching on the relativeTo string, with the current uri
const getHrefNoMatching = (
  to: string,
  relativeTo = '*',
  absolute = false,
  params?: any,
) => {
  const pattern = `${relativeTo}${to}`;
  const path = params ? generatePath(pattern, params) : pattern;
  return path.length > 0 && path.charAt(0) !== '/' && absolute
    ? `/${path}`
    : path;
};

export default getHrefNoMatching;
