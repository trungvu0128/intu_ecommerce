import { Link } from 'react-router-dom';

const MenuDropdown = () => {
  return (
    <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-sm z-[100]">
      <ul className="py-2">
        <li>
          <Link to="/campaign" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">CAMPAIGN</Link>
        </li>
        <li>
          <Link to="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ABOUT US</Link>
        </li>
        <li>
          <Link to="/shop" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">SHOP</Link>
        </li>
      </ul>
    </div>
  );
};

export default MenuDropdown;