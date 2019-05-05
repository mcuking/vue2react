// Life-cycle methods relations mapping
export const cycle = {
  created: 'componentWillMount',
  mounted: 'componentDidMount',
  updated: 'componentDidUpdate',
  beforeDestroy: 'componentWillUnmount',
  errorCaptured: 'componentDidCatch'
};
