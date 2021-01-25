import { useEffect } from 'react';

const defaultTitle = 'Hopsworks';

const useTitle = (title = defaultTitle) => {
  const titleTag = document.querySelector('title');

  useEffect(() => {
    if (titleTag) {
      titleTag.innerText = title;
    }
  }, [title, titleTag]);
};

export default useTitle;
