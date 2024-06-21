import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
    return (
      <>
        <div className="flex">
          <div className="overflow-x-auto flex-1 ">
            <div className="flex flex-col h-screen justify-between">
              <div>
                <Navbar />
                <Outlet/>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default Layout;
  