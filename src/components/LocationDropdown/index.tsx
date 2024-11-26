import { CSSProperties, useState } from "react";
import Select from "react-select";
import { cities } from "../../assets/data/cities";

// Define the type for your location option
interface Option {
  value: string;
  label: string;
}

type PROP_TYPE = {
  onLocationChange: (location: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  options?: Option[];
  selectedOption: Option;
  style?: CSSProperties;
};

const LocationDropdown = ({
  onLocationChange,
  error,
  placeholder,
  required,
  options,
  selectedOption,
  style = {},
}: PROP_TYPE) => {
  const [cityOptions] = useState<Option[]>(cities);

  return (
    <Select
      value={selectedOption}
      options={options ?? cityOptions}
      onChange={(selectedOption: Option | null) =>
        onLocationChange(selectedOption?.value || "")
      }
      isSearchable
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

export default LocationDropdown;
