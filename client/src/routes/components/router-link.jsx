import { forwardRef } from 'react';
import { Link } from 'react-router';

// ----------------------------------------------------------------------

const RouterLink = forwardRef(({ href, ...other }, ref) => <Link ref={ref} to={href} {...other} />);

export default RouterLink;
