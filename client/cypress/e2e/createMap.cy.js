// import { nextStep } from '../../src/Components/createmap/CreateMap';

describe("Create Map Page", () => {
  it("should select topics and templates from dropdowns", () => {
    // cy.visit("https://mapbook-f381d1faf354.herokuapp.com/createmap");

    cy.visit("http://localhost:3000/createmap");

    cy.get(".Dropdown-control").should("be.visible");
    cy.get(".Dropdown-control").contains("Select Topic").click();
    cy.get(".Dropdown-menu").contains("Education").click();
    cy.get(".Dropdown-control").contains("Select Template").click();
    cy.get(".Dropdown-menu").contains("Bar Chart").click();
  });

  it("should trigger the 'nextStep' function when 'Go To Step2' is clicked", () => {
    // cy.visit("https://mapbook-f381d1faf354.herokuapp.com/createmap");
    cy.visit("http://localhost:3000/createmap");
    /* cy.window().then((win) => {
      cy.stub(win, "nextStep");
    }); */
    cy.get(".Dropdown-control").contains("Select Topic").click();
    cy.get(".Dropdown-menu").contains("Education").click();
    cy.get(".Dropdown-control").contains("Select Template").click();
    cy.get(".Dropdown-menu").contains("Bar Chart").click();
    cy.get(".next_btn").click();
    cy.get(".before_btn").should("be.visible");
  });
});
