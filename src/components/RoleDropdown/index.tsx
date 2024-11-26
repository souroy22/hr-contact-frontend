import Select from "react-select";
import { roleOptions } from "../../assets/data/cities";
import { CSSProperties } from "react";

interface Option {
  value: string;
  label: string;
}

type PROP_TYPE = {
  onRoleChange: (role: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  style?: CSSProperties;
  options?: Option[];
  selectedOption: Option;
};

const RoleDropdown = ({
  onRoleChange,
  error,
  placeholder,
  required,
  options,
  style = {},
  selectedOption,
}: PROP_TYPE) => {
  return (
    <Select
      value={selectedOption}
      options={options ?? roleOptions}
      onChange={(selectedOption) => onRoleChange(selectedOption?.value || "")}
      placeholder={`${placeholder ?? "Select a role"}${required ? "*" : ""}`}
      styles={{
        control: (baseStyles) => ({
          ...style,
          ...baseStyles,
          borderColor: !!error ? "red" : baseStyles.borderColor,
        }),
      }}
    />
  );
};

export default RoleDropdown;
