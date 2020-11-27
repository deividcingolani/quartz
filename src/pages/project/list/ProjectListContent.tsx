import React, { FC } from 'react';

// Components
import Card from './Card';
// Types
import { Project } from '../../../types/project';

export interface FeatureGroupListContentProps {
  data: Project[];
}

const ProjectListContent: FC<FeatureGroupListContentProps> = ({ data }) => {
  return (
    <>
      {data.map((item) => (
        <Card key={item.id} data={item} />
      ))}
    </>
  );
};

export default ProjectListContent;
