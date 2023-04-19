import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './LayoutSidebar.css';

export default function SideBarProcess(props) {
  const { menuopt } = props;
  const { menukey } = props;
  return (
    <Link to={menuopt.path} id="sidebar-link">
      <div key={menukey}>
        {menuopt.icon}
        <span id="sidebar-text">{menuopt.title}</span>
      </div>
    </Link>
  );
}

SideBarProcess.defaultProps = {
  menuopt: true,
  menukey: true,
};

SideBarProcess.propTypes = {
  menuopt: PropTypes.shape,
  menukey: PropTypes.string,
};
