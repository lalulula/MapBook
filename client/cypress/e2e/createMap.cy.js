import { nextStep } from '../../src/Components/createmap/CreateMap';

describe("Create Map Page", () => {
  it("should select topics and templates from dropdowns", () => {
    cy.visit("https://mapbook-f381d1faf354.herokuapp.com/createmap");

    cy.get('[data-testid="custom-dropdown"]').should('be.visible');
    cy.get('[data-testid="custom-dropdown"]').contains('Select Topic').click();
    cy.get('[data-testid="flowbite-dropdown"]').contains("Education");
    cy.get('[data-testid="custom-dropdown"]').contains('Select Topic').click();
    cy.get('[data-testid="custom-dropdown"]').contains('Select Template').click();
    cy.get('[data-testid="flowbite-dropdown"]').contains("Bar Chart");
  });

  it("should trigger the 'nextStep' function when 'Go To Step2' is clicked", () => {
    cy.visit("https://mapbook-f381d1faf354.herokuapp.com/createmap");
    /* cy.window().then((win) => {
      cy.stub(win, "nextStep");
    }); */
    cy.get('[data-testid="custom-dropdown"]').contains("Select Topic").click();
    cy.get('[data-testid="flowbite-dropdown"]').contains("Education").click();
    cy.get('[data-testid="custom-dropdown"]').contains("Select Template").click();
    cy.get('[data-testid="flowbite-dropdown"]').contains("Bar Chart").click();
    cy.get(".step1_btn").click();
    cy.get('.back_to_step1_btn').should("be.visible");



  });
});
