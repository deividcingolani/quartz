import { createModel } from '@rematch/core';

const counter = createModel()({
  state: 0,
  reducers: {},
});

export default counter;
