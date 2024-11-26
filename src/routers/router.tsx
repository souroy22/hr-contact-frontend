import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import FallBack from "../components/FallBack";

const HomePage = lazy(() => import("../pages/Home"));

const RouterComponent = () => {
  return (
    <Suspense fallback={<FallBack />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Suspense>
  );
};

export default RouterComponent;
