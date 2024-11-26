import { ChangeEvent, FC, useEffect, useState } from "react";
import PopupForm from "../../components/PopupForm";
import DataTable from "../../components/DataTable";
import axios from "axios";
import { notification } from "../../configs/notification.config";
import {
  Box,
  IconButton,
  InputAdornment,
  Pagination,
  TextField,
} from "@mui/material";
import RoleDropdown from "../../components/RoleDropdown";
import LocationDropdown from "../../components/LocationDropdown";
import { cities, roleOptions } from "../../assets/data/cities";
import { useLocation, useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";

type NEW_CONTACT_TYPE = {
  name: string;
  contactNumber: string;
  companyName: string;
  role: string;
  location: string;
};

const Home: FC = () => {
  const [data, setData] = useState<NEW_CONTACT_TYPE[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();

  const addHRData = async (newData: NEW_CONTACT_TYPE) => {
    await axios.post(
      `${import.meta.env.VITE_LOCAL_BASE_URL}/api/v1/contact/create`,
      { ...newData }
    );
  };

  const handleAddData = async (newData: NEW_CONTACT_TYPE) => {
    try {
      setData([...data, newData]);
      await addHRData({
        ...newData,
        companyName: newData.companyName,
        contactNumber: newData.contactNumber,
      });
      setData([...data, newData]);
      setIsPopupOpen(false);
      notification.success("New contact added successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        notification.error(error.message);
        throw new Error(error.message);
      }
    }
  };

  const updateQueryParams = (
    searchQuery: string,
    role: string,
    newLocation: string,
    page: number
  ) => {
    const searchParams = new URLSearchParams();

    if (searchQuery.trim()) searchParams.set("query", searchQuery);
    if (role) searchParams.set("role", role);
    if (newLocation) searchParams.set("location", newLocation);
    if (page && page !== 1) {
      searchParams.set("page", String(page));
    }

    // Navigate to the updated URL
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const fetchHRData = async (
    searchQuery: string = "",
    role: string = "",
    location: string = "",
    page: number = 1
  ) => {
    updateQueryParams(searchQuery, role, location, page);
    setLoadingData(true);
    const params: any = {};
    if (searchQuery) {
      params["searchQuery"] = searchQuery;
    }
    if (role) {
      params["role"] = role;
    }
    if (location) {
      params["location"] = location;
    }
    params["page"] = page;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_LOCAL_BASE_URL}/api/v1/contact/all`,
        { params }
      );
      setTotalPages(response.data.totalPages);
      setData(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const onClear = async () => {
    setValue("");
    await fetchHRData("", selectedRole, selectedLocation);
  };

  const debounceFetchHrDataFn = useDebounce(fetchHRData);

  const searchContact = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setLoadingData(true);
    debounceFetchHrDataFn(event.target.value);
  };

  const onSelectRole = async (newVal: string) => {
    newVal = newVal === "any" ? "" : newVal;
    setSelectedRole(newVal);
    await fetchHRData(value, newVal, selectedLocation);
  };

  const onSelectLocation = async (newVal: string) => {
    newVal = newVal === "any" ? "" : newVal;
    setSelectedLocation(newVal);
    await fetchHRData(value, selectedRole, newVal);
  };

  const onLoad = () => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query") || "";
    const role = queryParams.get("role") || "";
    const newLocation = queryParams.get("location") || "";
    const queryPage = queryParams.get("page") || 1;

    setValue(query);
    setSelectedRole(role);
    setSelectedLocation(newLocation);
    setCurrentPage(Number(queryPage));

    fetchHRData(query, role, newLocation);
  };

  const getRole = (value: string): { label: string; value: string } => {
    const role = roleOptions.find(
      (option) => option.value === value.toUpperCase()
    );
    return role ?? { label: "Any Role", value: "any" };
  };

  const getLocation = (value: string): { label: string; value: string } => {
    const role = cities.find((option) => option.value === value);
    return role ?? { label: "Anywhere", value: "any" };
  };

  const handlePageChange = async (
    _: React.ChangeEvent<unknown>,
    currPage: number
  ) => {
    setCurrentPage(currPage);
    await fetchHRData(value, selectedRole, selectedLocation, currPage);
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Box className="app-container">
      <Box sx={{ display: "flex", gap: "30px" }}>
        <Box sx={{ width: "50%", display: "flex", justifyContent: "flex-end" }}>
          <TextField
            value={value}
            placeholder="Search..."
            onChange={searchContact}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {value ? (
                    <IconButton
                      onClick={onClear}
                      edge="end"
                      aria-label="clear"
                      sx={{ fontSize: "10px" }}
                    >
                      ✖️
                    </IconButton>
                  ) : (
                    "🔍"
                  )}
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
                width: "300px",
                "&:hover fieldset": {
                  borderColor: "#888",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#007BFF",
                  boxShadow: "0 0 10px rgba(0, 123, 255, 0.25)",
                },
              },
              "& .MuiInputBase-input": {
                paddingLeft: "10px", // Space for the icon
              },
            }}
          />
        </Box>
        <RoleDropdown
          selectedOption={getRole(selectedRole)}
          placeholder="Any Role"
          onRoleChange={onSelectRole}
          options={[{ label: "Any Role", value: "any" }, ...roleOptions]}
          style={{ width: "200px" }}
        />
        <LocationDropdown
          selectedOption={getLocation(selectedLocation)}
          placeholder="Anywhere"
          onLocationChange={onSelectLocation}
          options={[{ label: "Anywhere", value: "any" }, ...cities]}
          style={{ width: "200px" }}
        />
        <button onClick={() => setIsPopupOpen(true)} className="open-popup-btn">
          Add HR Data
        </button>
      </Box>
      <DataTable data={data} searchQuery={value} isLoading={loadingData} />
      <PopupForm
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSave={handleAddData}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Pagination
          page={currentPage}
          count={totalPages}
          variant="outlined"
          color="secondary"
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
};

export default Home;
