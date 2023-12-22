import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdPerson,
  MdHome,
  MdLock,
  MdPeople,
  MdHouse,
  MdCheck,
  MdSafetyCheck,
  MdCheckCircle,
  MdList
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import User from "views/admin/user";
import Property from "views/admin/property";
import ListingProperty from "views/admin/listingProperty";
import BackgroundCheckService from "views/admin/backgroundCheck";
import HouseInspectionService from "views/admin/houseInspection";
import HouseValuationService from "views/admin/houseValuation";


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
    name: "Property",
    layout: "/admin",
    icon: <Icon as={MdHouse} width='20px' height='20px' color='inherit' />,
    path: "/property",
    component: Property,
  },
  {
    name: "Listing Property",
    layout: "/admin",
    icon: <Icon as={MdList} width='20px' height='20px' color='inherit' />,
    path: "/listing-property",
    component: ListingProperty,
  },
  {
    name: "Background Check Services",
    layout: "/admin",
    icon: <Icon as={MdCheckCircle} width='20px' height='20px' color='inherit' />,
    path: "/bg-check-service",
    component: BackgroundCheckService,
  },
  {
    name: "House Inspection Services",
    layout: "/admin",
    icon: <Icon as={MdCheck} width='20px' height='20px' color='inherit' />,
    path: "/inspection-service",
    component: HouseInspectionService,
  },
  {
    name: "House Valuation Services",
    layout: "/admin",
    icon: <Icon as={MdSafetyCheck} width='20px' height='20px' color='inherit' />,
    path: "/valuation-service",
    component: HouseValuationService,
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