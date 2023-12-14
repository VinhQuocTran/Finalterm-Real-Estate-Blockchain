import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import routes from "routes.js";

// Chakra imports
import { Box } from "@chakra-ui/react";

// Custom Chakra theme
export default function Auth() {
  // functions for changing the states from components
  const getRoute = () => {
    return window.location.pathname !== "/auth/full-screen-maps";
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      if (prop.collapse) {
        return getRoutes(prop.items);
      }
      if (prop.category) {
        return getRoutes(prop.items);
      } else {
        return null;
      }
    });
  };
  document.documentElement.dir = "ltr";
  return (
    <Box>
      {getRoute() ? (
          <Box mx='auto' minH='100vh'>
            <Switch>
              {getRoutes(routes)}
              <Redirect
                  from='/auth'
                  to='/auth/sign-in/default'
              />
            </Switch>
          </Box>
      ) : null}
    </Box>
  );
}
