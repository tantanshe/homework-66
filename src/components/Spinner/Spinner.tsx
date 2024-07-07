import React from 'react';

const Spinner = () => (
  <div className="d-flex justify-content-center align-items-center spinner mt-5">
    <div className="spinner-border text-primary mt-2" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default Spinner;