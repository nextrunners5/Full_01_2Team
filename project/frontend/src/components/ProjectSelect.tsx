import classNames from "classnames";

interface Common{
  common_id: number;
  common_detail: string;
}

interface SelectBoxProps {
  label: string;
  name: string;
  value: string;
  options: Common[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

// const SelectBox: React.FC<SelectBoxProps> = ({ label, name, value, options, onChange, className}) => {
const SelectBox: React.FC<SelectBoxProps> = ({ name, value, options, onChange, className}) => {
  const selectClass = classNames("selectContainer", className);

  return (
  <div className={selectClass}>
    {/* <h3 className="h3">{label}</h3> */}
    <select name={name} value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.common_id} value={option.common_detail}>
          {option.common_detail}
        </option>
      ))}
    </select>
  </div>
  )
}

export default SelectBox;