"use client";
import { DynamicWidget, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
} from "@nextui-org/react";

export default function WebsiteNavbar() {
  const isLoggedIn = useIsLoggedIn();

  return (
    <Navbar position="static">
      <NavbarBrand>
        <p className="font-bold text-inherit">EVM Actions</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            href="https://evm-actions.builders.garden"
            isExternal={true}
            color="primary"
            variant="flat"
          >
            Docs
          </Button>
        </NavbarItem>
        {isLoggedIn && (
          <NavbarItem>
            <Button
              as={Link}
              href="/actions"
              isExternal={false}
              color="primary"
            >
              My actions
            </Button>
          </NavbarItem>
        )}
        <NavbarItem>
          <DynamicWidget />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
