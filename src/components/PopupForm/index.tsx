import { FC, useState } from "react";
import LocationDropdown from "../LocationDropdown";
import RoleDropdown from "../RoleDropdown";
import { Box, CircularProgress, ClickAwayListener } from "@mui/material";
import { cities, roleOptions } from "../../assets/data/cities";

interface PopupFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    contactNumber: string;
    companyName: string;
    role: string;
    location: string;
  }) => void;
}

const PopupForm: FC<PopupFormProps> = ({ open, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name) newErrors.name = "Name is required.";
    if (!contactNumber) {
      newErrors.contactNumber = "Contact number is required.";
    } else if (!/^\d{10}$/.test(contactNumber)) {
      newErrors.contactNumber = "Contact number must be exactly 10 digits.";
    }
    if (!companyName) newErrors.companyName = "Company name is required.";
    if (!role) newErrors.role = "Role is required.";
    if (!location) newErrors.location = "Location is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (validate()) {
        await onSave({ name, contactNumber, companyName, role, location });
        setName("");
        setContactNumber("");
        setCompanyName("");
        setRole("");
        setLocation("");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (value: string): { label: string; value: string } => {
    const role = roleOptions.find(
      (option) => option.value === value.toUpperCase()
    );
    return role ?? { label: "", value: "" };
  };

  const getLocation = (value: string): { label: string; value: string } => {
    const role = cities.find((option) => option.value === value);
    return role ?? { label: "", value: "" };
  };

  if (!open) return null;

  return (
    <div className="popup-overlay">
      <ClickAwayListener onClickAway={onClose}>
        <div className="popup-form">
          <Box
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontWeight: 600,
              fontSize: "20px",
              cursor: "pointer",
            }}
            onClick={() => onClose()}
          >
            X
          </Box>
          <h3>Add HR Data</h3>
          <Box className="input-wrapper">
            <input
              type="text"
              placeholder="Hr Name*"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: "" });
              }}
              style={{ borderColor: errors.name ? "red" : "" }}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </Box>
          <Box className="input-wrapper">
            <input
              type="text"
              maxLength={10}
              placeholder="Contact Number*"
              value={contactNumber}
              onChange={(e) => {
                setContactNumber(e.target.value);
                setErrors({ ...errors, contactNumber: "" });
              }}
              style={{ borderColor: errors.contactNumber ? "red" : "" }}
            />
            {errors.contactNumber && (
              <p className="error-text">{errors.contactNumber}</p>
            )}
          </Box>
          <Box className="input-wrapper">
            <input
              type="text"
              placeholder="Company*"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                setErrors({ ...errors, companyName: "" });
              }}
              style={{ borderColor: errors.companyName ? "red" : "" }}
            />
            {errors.companyName && (
              <p className="error-text">{errors.companyName}</p>
            )}
          </Box>
          <Box className="input-wrapper">
            <LocationDropdown
              selectedOption={getLocation(location)}
              onLocationChange={(value) => {
                setLocation(value);
                setErrors({ ...errors, location: "" });
              }}
              required
              error={errors.location}
            />
            {errors.location && <p className="error-text">{errors.location}</p>}
          </Box>
          <Box className="input-wrapper">
            <RoleDropdown
              selectedOption={getRoleLabel(role)}
              required
              onRoleChange={(value) => {
                setRole(value);
                setErrors({ ...errors, role: "" });
              }}
              error={errors.role}
            />
            {errors.role && <p className="error-text">{errors.role}</p>}
          </Box>

          <button onClick={handleSave}>
            {loading ? (
              <CircularProgress
                sx={{
                  color: "#FFF",
                  height: "12px !important",
                  width: "12px !important",
                }}
              />
            ) : (
              "Save"
            )}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default PopupForm;
