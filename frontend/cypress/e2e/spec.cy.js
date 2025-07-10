describe("Coffee App E2E Tests", () => {
  // mock data for test
  const mockIngredients = [
    { id: 1, ingredient: "Expresso", additional: false },
    { id: 2, ingredient: "Leite", additional: false },
    { id: 3, ingredient: "Chocolate", additional: false },
    { id: 4, ingredient: "Sorvete", additional: false },
    { id: 5, ingredient: "Espuma", additional: false },
    { id: 6, ingredient: "Caramelo", additional: true },
    { id: 7, ingredient: "Calda de Chocolate", additional: true },
    { id: 8, ingredient: "Chantily", additional: true },
    { id: 9, ingredient: "Canela", additional: true },
  ];

  beforeEach(() => {
    // Intercept API calls
    cy.intercept("GET", "http://localhost:5000/api/v1/ingredients", {
      statusCode: 200,
      body: mockIngredients,
    }).as("getIngredients");

    cy.intercept("POST", "http://localhost:5000/api/v1/order", {
      statusCode: 200,
      body: { message: "Pedido confirmado com sucesso!" },
    }).as("submitOrder");

    // Visit the application
    cy.visit("/");

    // Wait for ingredients to load
    cy.wait("@getIngredients");
  });

  context("App Loading", () => {
    it("should load the application with correct data", () => {
      cy.get("#list-selection-ingredients ul li").should(
        "have.length.greaterThan",
        0
      );
      cy.get("#list-selection-additional ul li").should(
        "have.length.greaterThan",
        0
      );
    });

    it("should display ingredients correctly", () => {
      // Check base ingredients
      cy.get("#list-selection-ingredients").within(() => {
        cy.contains("Expresso").should("be.visible");
        cy.contains("Leite").should("be.visible");
        cy.contains("Chocolate").should("be.visible");
        cy.contains("Sorvete").should("be.visible");
        cy.contains("Espuma").should("be.visible");
      });

      // Check additional ingredients
      cy.get("#list-selection-additional").within(() => {
        cy.contains("Caramelo").should("be.visible");
        cy.contains("Calda de Chocolate").should("be.visible");
        cy.contains("Chantily").should("be.visible");
        cy.contains("Canela").should("be.visible");
      });
    });
  });

  context("Ingredient Selection", () => {
    it("should select and display single base ingredient", () => {
      cy.get("#Expresso").click();

      cy.get("#Expresso").should("have.class", "selected");
      cy.get("#Expresso-recipe").should("be.visible");
      cy.get("#coffee-name").should("contain.text", "Expresso");
    });

    it("should select multiple base ingredients and build coffee name correctly", () => {
      cy.get("#Expresso").click();
      cy.get("#Chocolate").click();
      cy.get("#Espuma").click();

      cy.get("#Expresso").should("have.class", "selected");
      cy.get("#Chocolate").should("have.class", "selected");
      cy.get("#Espuma").should("have.class", "selected");

      cy.get("#coffee-name").should(
        "contain.text",
        "Expresso com Chocolate, Espuma"
      );
    });

    it("should deselect ingredients when clicked again", () => {
      cy.get("#Expresso").click();
      cy.get("#Expresso").should("have.class", "selected");
      cy.get("#Expresso-recipe").should("exist");

      cy.get("#Expresso").click();
      cy.get("#Expresso").should("not.have.class", "selected");
      cy.get("#Expresso-recipe").should("not.exist");
      cy.get("#coffee-name").should("be.empty");
    });

    it("should prevent selecting more than 3 base ingredients", () => {
      cy.get("#Expresso").click();
      cy.get("#Leite").click();
      cy.get("#Espuma").click();

      cy.get("#Chocolate").click();

      cy.get("#list-selection-ingredients .selected").should("have.length", 3);
      cy.get("#Chocolate").should("not.have.class", "selected");

      cy.get(".toast-container").should(
        "contain",
        "Maximo de ingredientes base atingido!"
      );
    });

    it("should select additional ingredients correctly", () => {
      cy.get("#Expresso").click();

      cy.get("#Canela").click();
      cy.get("#Chantily").click();

      cy.get("#Canela").should("have.class", "selected");
      cy.get("#Chantily").should("have.class", "selected");
      cy.get("#Canela-recipe").should("exist");
      cy.get("#Chantily-recipe").should("exist");
    });

    it("should prevent selecting more than 2 additional ingredients", () => {
      cy.get("#Expresso").click();

      // Select 2 additional ingredients
      cy.get("#Canela").click();
      cy.get("#Chantily").click();

      cy.get("#Caramelo").click();

      cy.get("#list-selection-additional .selected").should("have.length", 2);
      cy.get("#Caramelo").should("not.have.class", "selected");

      cy.get(".toast-container").should(
        "contain",
        "Maximo de ingredientes adicionais atingido!"
      );
    });
  });

  context("Special Coffee Recognition", () => {
    it("should recognize Affogato special coffee", () => {
      cy.get("#Sorvete").click();
      cy.get("#Expresso").click();

      cy.get("#especial-coffee-name").should(
        "contain.text",
        "Affogato Especial:"
      );

      cy.get(".toast-container").should(
        "contain",
        "Cafe especial criado: Affogato"
      );
    });

    it("should show custom coffee for non-special recipes", () => {
      cy.get("#Expresso").click();
      cy.get("#Chocolate").click();

      cy.get("#especial-coffee-name").should(
        "contain.text",
        "Cafe Personalizado:"
      );
    });
  });

  context("Recipe Management", () => {
    it("should clear all selections when clear button is clicked", () => {
      cy.get("#Expresso").click();
      cy.get("#Leite").click();
      cy.get("#Canela").click();

      cy.get(".selected").should("have.length", 3);
      cy.get("#item-list-selection-recipe li").should("have.length", 3);

      cy.get("#ingredients-recipe-button-clean").click();

      cy.get(".selected").should("have.length", 0);
      cy.get("#item-list-selection-recipe li").should("have.length", 0);
      cy.get("#coffee-name").should("be.empty");
      cy.get("#especial-coffee-name").should("be.empty");
    });
  });

  context("Order Submission", () => {
    //TODO:
    it("should submit valid order successfully", () => {
      cy.get("#Expresso").click();
      cy.get("#Leite").click();

      cy.get("#ingredients-recipe-button-submit").click();

      cy.wait("@submitOrder");

      cy.get("@submitOrder").should((interception) => {
        expect(interception.request.body).to.have.length(2);
        expect(interception.request.body[0]).to.have.property(
          "ingredient",
          "Expresso"
        );
        expect(interception.request.body[1]).to.have.property(
          "ingredient",
          "Leite"
        );
      });

      cy.get(".selected").should("have.length", 0);
      cy.get("#coffee-name").should("be.empty");
    });

    it("should prevent submit order without base ingredients", () => {
      cy.get("#ingredients-recipe-button-submit").click();

      cy.get(".toast-container").should(
        "contain",
        "Minimo 1 ingrediente base deve ser selecionado"
      );
    });

    it("should handle API error during order submission", () => {
      cy.intercept("POST", "http://localhost:5000/api/v1/order", {
        statusCode: 500,
        body: { error: "Internal server error" },
      }).as("submitOrderError");

      cy.get("#Expresso").click();
      cy.get("#ingredients-recipe-button-submit").click();

      cy.wait("@submitOrderError");

      cy.get("#Expresso").should("have.class", "selected");
      cy.get("#coffee-name").should("contain.text", "Expresso");
    });
  });

  context("Error Handling", () => {
    it("should handle ingredients API failure gracefully", () => {
      cy.intercept("GET", "http://localhost:5000/api/v1/ingredients", {
        statusCode: 500,
        body: { error: "Server error" },
      }).as("getIngredientsError");

      cy.visit("/");
      cy.wait("@getIngredientsError");

      cy.get("#list-selection-ingredients ul li").should("have.length", 0);
      cy.get("#list-selection-additional ul li").should("have.length", 0);
    });
  });

  context("Performance", () => {
    it("should load ingredients in 3 seg or less", () => {
      const start = Date.now();

      cy.visit("/").then(() => {
        cy.get("#list-selection-ingredients ul li").should(
          "have.length.greaterThan",
          0
        );
        const loadTime = Date.now() - start;
        expect(loadTime).to.be.lessThan(3000); // 3 seg
      });
    });
  });
});
