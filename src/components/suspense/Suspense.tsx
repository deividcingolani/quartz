import React, { FC, Suspense as ReactSuspense } from 'react';
import Loader from '../loader/Loader';

export interface SuspenseProps {
  children: React.ReactElement;
}

const Suspense: FC<SuspenseProps> = ({ children }: SuspenseProps) => (
  <ReactSuspense fallback={<Loader />}>{children}</ReactSuspense>
);

export default Suspense;
