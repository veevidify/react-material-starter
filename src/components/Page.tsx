import React, { forwardRef } from 'react';
import { Helmet } from 'react-helmet';

interface Props {
  title: string;
  className?: string;
  children: React.ReactElement;
}

const Page = forwardRef<HTMLDivElement, Props>(({
  children,
  title = '',
  ...rest
}, ref) => {
  return (
    <div
      ref={ref}
      {...rest}
    >
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </div>
  );
});

export default Page;
