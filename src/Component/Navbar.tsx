import { Navbar, NavbarProps } from "@mantine/core";

const NavbarMantine = (props: NavbarProps) => {
  return <Navbar {...props}>{props.children}</Navbar>;
};

export default NavbarMantine;
