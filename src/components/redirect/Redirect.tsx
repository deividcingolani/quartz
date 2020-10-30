import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface RedirectProps {
  to: string;
}

const Redirect: FC<RedirectProps> = ({ to }: RedirectProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to);
  }, [to, navigate]);

  return null;
};

export default Redirect;
