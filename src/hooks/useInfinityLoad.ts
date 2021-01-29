import { useCallback, useEffect } from 'react';

const useInfinityLoad = (
  loaderRef: any,
  elementRef: any,
  isLoadingMore: boolean,
  handleLoadMore: () => void,
) => {
  const handleScroll = useCallback(() => {
    if (loaderRef.current) {
      const bounding = loaderRef.current.getBoundingClientRect();

      if (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.right <=
          (window.innerWidth || document.documentElement.clientWidth) &&
        bounding.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        !isLoadingMore
      ) {
        handleLoadMore();
      }
    }
  }, [handleLoadMore, isLoadingMore, loaderRef]);

  useEffect(() => {
    elementRef?.addEventListener('scroll', handleScroll);

    return () => elementRef?.removeEventListener('scroll', handleScroll);
  }, [elementRef, handleScroll]);
};

export default useInfinityLoad;
