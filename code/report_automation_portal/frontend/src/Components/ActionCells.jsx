import PropTypes from 'prop-types';

export default function ActionCells({ original, onEdit, onDelete }) {
  return (
    <div>
      <input
        type="button"
        className="button-users"
        value="Edit"
        onClick={() => onEdit(original)}
      />
      <input
        type="button"
        className="button-users"
        value="Delete"
        onClick={() => onDelete(original)}
      />
    </div>
  );
}

ActionCells.defaultProps = {
  original: {
    username: '',
    user_type: '',
    user_role: '',
  },
  onEdit: () => {},
  onDelete: () => {},
};

ActionCells.propTypes = {
  original: PropTypes.shape({
    username: PropTypes.string,
    user_type: PropTypes.string,
    user_role: PropTypes.string,
  }),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
