import { Link, useLocation } from "react-router-dom";
import React from "react";

const DashboardIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>;
const ProductsIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="20.5" r="1" /><circle cx="18" cy="20.5" r="1" /><path d="M2.5 2.5h3.19L8 14h9l3.5-7H6" /></svg>;
const OrdersIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4l4 4m-4-4L12 8m10 8L16 4 9 16l3 4" /><rect x="3" y="16" width="5" height="4" rx="1" /></svg>;
const CategoriesIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>;
// ---------------------------------------------------------------------------------------------

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}
const navItems = [
  { to: "/", name: "Dashboard", icon: <DashboardIcon /> },
  { to: "/products", name: "Products", icon: <ProductsIcon /> },
  { to: "/orders", name: "Orders", icon: <OrdersIcon /> },
  { to: "/categories", name: "Categories", icon: <CategoriesIcon /> },
  { to: "/addresses", name: "Addresses", icon: <CategoriesIcon /> },
  { to: "/brand", name: "Brand", icon: <CategoriesIcon /> },
];

export default function Sidebar({ sidebarOpen, }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={`
      w-64 bg-gray-900 h-screen p-4 fixed top-0 left-0 flex flex-col z-30
      transform ${sidebarOpen ? "translate-x-0 absolute" : "-translate-x-full relative"} md:translate-x-0
      transition-transform duration-300
    `}>
      <div className="mb-8 pb-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white tracking-wider">
          <img src={"../public/logo.png"} alt="BARCHA Medicous" />
        </h2>
      </div>

      <ul className="flex flex-col space-y-1 flex-grow">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <li key={item.to}>
              <Link
                to={item.to}

                className={`flex items-center p-3 text-sm rounded-lg transition-colors duration-200 w-full mb-1
                  ${isActive ? "bg-[#000055] text-white" : "hover:bg-white/5 text-[#737373]"}
                `}
              >

                <span className={`${isActive ? "text-white" : "text-[#737373]"} text-lg`}>
                  {item.icon}
                </span>


                <span
                  className={`font-semibold px-3 block
                    ${isActive ? "text-white" : "text-[#737373]"}
                  `}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

    </div>
  );
}