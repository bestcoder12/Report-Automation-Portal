import PropTypes from 'prop-types';

export default function DropDownMenu({
  domFor,
  domLabelId,
  domSelectId,
  label,
  value,
  options,
  onChange,
}) {
  return (
    <label htmlFor={domFor} id={domLabelId}>
      {label}
      <select value={value} onChange={onChange} id={domSelectId}>
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
  domSelectId: 'placeholder',
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
  domSelectId: PropTypes.string,
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
