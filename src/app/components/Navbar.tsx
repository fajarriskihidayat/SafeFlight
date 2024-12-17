import Link from "next/link";
import NavbarAuth from "./NavbarAuth";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav
      id="Navbar"
      className="container max-w-[1130px] mx-auto flex justify-between items-center pt-[30px]"
    >
      <Link
        href="/"
        className="flex items-center shrink-0 text-2xl font-medium"
      >
        <Image
          width={120}
          height={60}
          src="/assets/images/logos/logo.svg"
          alt="logo"
        />
      </Link>
      <ul className="nav-menus flex gap-[30px] items-center w-fit">
        <li>
          <Link href="/" className="font-medium">
            Flash Sale
          </Link>
        </li>
        <li>
          <Link href="/#Services" className="font-medium">
            Discover
          </Link>
        </li>
        <li>
          <Link href="/#Selected" className="font-medium">
            Packages
          </Link>
        </li>
        <li>
          <Link href="/#Testimonials" className="font-medium">
            Stories
          </Link>
        </li>
        <li>
          <Link href="/" className="font-medium">
            About
          </Link>
        </li>
        <NavbarAuth />
      </ul>
    </nav>
  );
};

export default Navbar;
