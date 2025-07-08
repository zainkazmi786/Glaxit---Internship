import React from 'react';
import { RiseLoader } from 'react-spinners';

const Spinner = ({
  loading = true,
  color = '#7f5af0', // stylish purple
  size = 15,
  margin = 5,
  speedMultiplier = 1,
  cssOverride = {}
}) => {
  // Default CSS to center and add some spacing
  const defaultOverride = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // full viewport height
    ...cssOverride
  };

  return (
    <RiseLoader
      loading={loading}
      color={color}
      size={size}
      margin={margin}
      speedMultiplier={speedMultiplier}
      cssOverride={defaultOverride}
      aria-label="Fancy Loading Spinner"
      data-testid="fancy-loader"
    />
  );
};

export default Spinner;
