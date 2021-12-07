import React from 'react';

const Logo = (props) => {
  return (
    <img
      alt="Logo"
      src="/static/images/logotop.png"
      {...props}
      style={{height:'40px'}}
    />
  );
};

export default Logo;
