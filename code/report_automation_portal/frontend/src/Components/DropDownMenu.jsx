import PropTypes from 'prop-types';

export default function DropDownMenu({
  domFor,
  domLabelId,
  label,
  value,
  options,
  onChange,
}) {
  return (
    <label htmlFor={domFor} id={domLabelId}>
      {label}
      <select value={value} onChange={onChange} id={domFor}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

DropDownMenu.defaultProps = {
  domFor: 'placeholder',
  domLabelId: 'placeholder',
  label: 'placeholder',
  value: 'placeholder',
  options: {
    label: 'placeholder',
    value: 'placeholder',
  },
  onChange: () => null,
};

DropDownMenu.propTypes = {
  domFor: PropTypes.string,
  domLabelId: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  onChange: PropTypes.func,
};
