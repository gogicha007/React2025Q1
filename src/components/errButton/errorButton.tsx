import { useState } from 'react';

const ErrorButton = () => {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  const errorThrown = () => {
    setShouldThrowError(true);
  };

  if (shouldThrowError) {
    throw new Error('Error throwing button was clicked');
  }
  return (
    <button type="button" onClick={errorThrown}>
      Error Thrower
    </button>
  );
};

export default ErrorButton;
