describe("Login an account", () => {
  it("Login", () => {
    cy.visit("localhost:3000/login");
    cy.get("#sign-in-email").type("alexspx@hotmail.com");
    cy.get("#sign-in-password").type("123456");
    cy.get("#sign-in-button").click();
    cy.url().should("include", "/home");
  });
});
