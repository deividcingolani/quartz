import { Colors, NodeTypes } from '../types';

const getColor = (type: NodeTypes): Colors => {
  const colorsMap = {
    [NodeTypes.featureGroup]: Colors.orange,
    [NodeTypes.model]: Colors.skyblue,
    [NodeTypes.storageConnector]: Colors.red,
    [NodeTypes.trainingDataset]: Colors.purple,
    [NodeTypes.link]: Colors.gray,
    [NodeTypes.experiment]: Colors.yellow,
  };
  return colorsMap[type];
};

export default getColor;
