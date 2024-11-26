import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/system";
import { roleOptions } from "../../assets/data/cities";

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== "index",
})<{ index: number }>(({ theme, index }) => ({
  backgroundColor: index % 2 === 0 ? theme.palette.action.hover : "inherit",
}));

interface DataTableProps {
  data: {
    name: string;
    contactNumber: string;
    companyName: string;
    role: string;
    location: string;
  }[];
  searchQuery: string;
  isLoading: boolean;
}

const DataTable: FC<DataTableProps> = ({ data, searchQuery, isLoading }) => {
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const getRoleLabel = (value: string): string => {
    const role = roleOptions.find(
      (option) => option.value === value.toUpperCase()
    );
    return role ? role.label : "Unknown Role";
  };

  return (
    <TableContainer component={Paper} style={{ margin: "1rem" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 5 }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            // No Data Found Message
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="h6" color="textSecondary">
                  No data found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            // Display Data
            data.map((row, index) => (
              <StyledTableRow key={index} index={index}>
                <TableCell sx={{ letterSpacing: "1px" }}>
                  {highlightText(row.name, searchQuery)}
                </TableCell>
                <TableCell sx={{ letterSpacing: "1px" }}>
                  {highlightText(row.contactNumber, searchQuery)}
                </TableCell>
                <TableCell sx={{ letterSpacing: "1px" }}>
                  {highlightText(row.companyName, searchQuery)}
                </TableCell>
                <TableCell>{getRoleLabel(row.role)}</TableCell>
                <TableCell>{row.location}</TableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
