// Central icon component using Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Icon({ icon, className = '', size, spin, pulse }) {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={className}
      size={size}
      spin={spin}
      pulse={pulse}
    />
  );
}
