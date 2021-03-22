import { useContext, useEffect, useState } from 'react';
import { ContentContext } from '../layouts/app/AppLayout';

const useScreenWithScroll = () => {
  const { current: content } = useContext(ContentContext);

  const [hasScrollOnScreen, setHasScrollOnScreen] = useState(
    content?.scrollHeight === content?.clientHeight,
  );

  useEffect(() => {
    if (content) {
      //@ts-ignore
      const checkScrollObserver = new window.ResizeObserver(() => {
        if (content) {
          setHasScrollOnScreen(content.scrollHeight > content.clientHeight);
        }
      });

      checkScrollObserver.observe(content);

      return () => {
        checkScrollObserver.unobserve(content);
      };
    }
  }, [content]);

  return hasScrollOnScreen;
};

export default useScreenWithScroll;
