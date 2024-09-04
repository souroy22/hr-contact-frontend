import { Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import useForm from "../../hooks/useForm";
import TextInput from "../../components/TextInput";
import CustomButton from "../../components/CustomButton";
import { notification } from "../../configs/notification.config";
import { useDispatch } from "react-redux";
import "./style.css";
import { setUserData } from "../../store/user/userReducer";

const formFields = [
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    StartIcon: MdOutlineAlternateEmail,
    validation: (value: string) =>
      /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email format",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    StartIcon: RiLockPasswordFill,
    validation: (value: string) =>
      value.length >= 6 ? null : "Password must be at least 6 characters long",
  },
];

const Login = () => {
  const { formData, errors, handleChange, handleSubmit, loading } =
    useForm(formFields);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (data: { [key: string]: string }) => {
    try {
      console.log("Data", data);
      const todo = await fetch("https://jsonplaceholder.typicode.com/todos/1");
      dispatch(
        setUserData({
          firstName: "Sourav",
          lastName: "Roy",
          email: "sou@gmail.com",
          avatar: null,
        })
      );
      console.log("Todo", todo);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error", error.message);

        notification.error(error.message);
      }
    }
  };

  return (
    <Box>
      <h2 className="title">Login Form</h2>
      <form
        action="#"
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        {formFields.map((field) => (
          <TextInput
            key={field.name}
            name={field.name}
            type={field.type}
            required={field.required}
            StartIcon={field.StartIcon}
            onChange={handleChange}
            placeholder={field.label}
            value={formData[field.name]}
            error={errors[field.name]}
          />
        ))}
        <CustomButton
          name="Login"
          loading={loading}
          type="submit"
          disabled={loading}
          variant="contained"
          onClick={() => handleSubmit(handleLogin)}
        />
      </form>
      <span>
        Click here to <Link to="/signup">signup</Link>
      </span>
    </Box>
  );
};

export default Login;
