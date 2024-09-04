import { Box } from "@mui/material";
import { FC, ReactNode } from "react";
import "./style.css";

type PropTypes = {
  children: ReactNode | null;
};

const AuthLayout: FC<PropTypes> = ({ children }) => {
  return <Box>{children}</Box>;
};

export default AuthLayout;
