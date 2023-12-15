import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdPerson,
  MdHome,
  MdLock,
  MdPeople,
  MdHouse,
  MdManageAccounts,
  MdSave,
  MdList
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import User from "views/admin/user";
import Property from "views/admin/property";
import PropertyManager from "views/admin/propertyManager";
import ListingProperty from "views/admin/listingProperty";
import SubmitListingProperty from "views/admin/submitListingProperty";

// Auth Imports
import SignInCentered from "views/auth/signIn";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "User",
    layout: "/admin",
    icon: <Icon as={MdPeople} width='20px' height='20px' color='inherit' />,
    path: "/user",
    component: User,
  },
  {
    name: "Property Manager",
    layout: "/admin",
    icon: <Icon as={MdManageAccounts} width='20px' height='20px' color='inherit' />,
    path: "/manager-property",
    component: PropertyManager,
  },
  {
    name: "Property",
    layout: "/admin",
    icon: <Icon as={MdHouse} width='20px' height='20px' color='inherit' />,
    path: "/property",
    component: Property,
  },
  {
    name: "Submit Listing Property",
    layout: "/admin",
    icon: <Icon as={MdSave} width='20px' height='20px' color='inherit' />,
    path: "/submit-listing-property",
    component: SubmitListingProperty,
  },
  {
    name: "Listing Property",
    layout: "/admin",
    icon: <Icon as={MdList} width='20px' height='20px' color='inherit' />,
    path: "/listing-property",
    component: ListingProperty,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    component: Profile,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: SignInCentered,
  },
];

export default routes;
