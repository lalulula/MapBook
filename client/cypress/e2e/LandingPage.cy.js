import React from "react";
import LandingPage from "../../src/Components/landing/LandingPage";

describe("<LandingPage />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<LandingPage />);
  });
});
