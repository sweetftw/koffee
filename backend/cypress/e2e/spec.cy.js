describe("Coffee API Tests", () => {
  context("Ingredients EndPoint", () => {
    it("should fetch ingredients successfully", () => {
      cy.request("GET", `/ingredients`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.be.greaterThan(0);

        response.body.forEach((ingredient) => {
          expect(ingredient).to.have.property("id");
          expect(ingredient).to.have.property("ingredient");
          expect(ingredient).to.have.property("additional");
          expect(ingredient.id).to.be.a("number");
          expect(ingredient.ingredient).to.be.a("string");
          expect(ingredient.additional).to.be.a("boolean");
        });
      });
    });

    it("should have proper response headers for ingredients", () => {
      cy.request("GET", `/ingredients`).then((response) => {
        expect(response.headers).to.have.property("content-type");
        expect(response.headers["content-type"]).to.include("application/json");
      });
    });

    it("should return base and additional ingredients", () => {
      cy.request("GET", `/ingredients`).then((response) => {
        const baseIngredients = response.body.filter(
          (item) => !item.additional
        );
        const additionalIngredients = response.body.filter(
          (item) => item.additional
        );

        expect(baseIngredients.length).to.be.greaterThan(0);
        expect(additionalIngredients.length).to.be.greaterThan(0);
      });
    });

    it("should handle ingredients API errors gracefully", () => {
      cy.request({
        method: "GET",
        url: `/invalid-ingredients`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([404, 500]);
      });
    });

    it("should respond quickly to ingredients request", () => {
      const startTime = Date.now();

      cy.request("GET", `/ingredients`).then((response) => {
        const responseTime = Date.now() - startTime;
        expect(response.status).to.eq(200);
        expect(responseTime).to.be.lessThan(1000); // 1 Seg
      });
    });
  });

  context("Order EndPoint", () => {
    const validOrderPayload = [
      {
        id: 1,
        ingredient: "Expresso",
        additional: false,
        price: 5,
      },
      {
        id: 3,
        ingredient: "Chocolate",
        additional: false,
        price: 4,
      },
    ];

    it("should accept valid order submit", () => {
      cy.request({
        method: "POST",
        url: `/order`,
        body: validOrderPayload,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.a("string");
        expect(response.body.message).to.not.be.empty;
      });
    });

    it("should validate order payload structure", () => {
      const orderWithMissingFields = [{ ingredient: "Expresso" }];

      cy.request({
        method: "POST",
        url: `/order`,
        body: orderWithMissingFields,
        headers: {
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
      }).then((response) => {
        // Should return validation error
        expect(response.status).to.eq(400);
      });
    });

    it("should reject empty order", () => {
      cy.request({
        method: "POST",
        url: `/order`,
        body: [],
        headers: {
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
        expect(response.body).to.have.property("error");
      });
    });

    it("should handle malformed JSON in order request", () => {
      cy.request({
        method: "POST",
        url: `/order`,
        body: '{"invalid": json}',
        headers: {
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it("should handle large invalid order payloads", () => {
      const largeOrderPayload = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        ingredient: `Ingredient${i + 1}`,
        additional: i % 2 === 0,
      }));

      cy.request({
        method: "POST",
        url: `/order`,
        body: largeOrderPayload,
        headers: {
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
      }).then((response) => {
        // Should handle large payloads gracefully
        expect(response.status).to.be.oneOf([400, 413, 422]);
      });
    });

    it("should handle concurrent order submit", () => {
      const orders = Array.from({ length: 5 }, () => validOrderPayload);
      const requests = orders.map((order) =>
        cy.request({
          method: "POST",
          url: `/order`,
          body: order,
          headers: {
            "Content-Type": "application/json",
          },
        })
      );

      // All requests should succeed
      requests.forEach((request) => {
        request.then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property("message");
        });
      });
    });

    it("should respond quickly to order submit", () => {
      const startTime = Date.now();

      cy.request({
        method: "POST",
        url: `/order`,
        body: validOrderPayload,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        const responseTime = Date.now() - startTime;
        expect(response.status).to.eq(200);
        expect(responseTime).to.be.lessThan(2000); // Should respond within 2 seconds
      });
    });
  });

  context("API Security and Validation", () => {
    it("should handle SQL injection attempts", () => {
      const maliciousPayload = [
        {
          id: "1'; DROP TABLE ingredients; --",
          ingredient: "Expresso",
          additional: false,
        },
      ];

      cy.request({
        method: "POST",
        url: `/order`,
        body: maliciousPayload,
        headers: {
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it("should handle XSS attempts in ingredient names", () => {
      const xssPayload = [
        {
          id: 1,
          ingredient: '<script>alert("xss")</script>',
          additional: false,
        },
      ];

      cy.request({
        method: "POST",
        url: `/order`,
        body: xssPayload,
        headers: {
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it("should validate data types in order payload", () => {
      const invalidTypesPayload = [
        {
          id: "not-a-number",
          ingredient: 123,
          additional: "not-a-boolean",
        },
      ];

      cy.request({
        method: "POST",
        url: `/order`,
        body: invalidTypesPayload,
        headers: {
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it("should handle oversized payloads", () => {
      const oversizedPayload = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        ingredient: "A".repeat(1000), // Very long ingredient name
        additional: false,
      }));

      cy.request({
        method: "POST",
        url: `/order`,
        body: oversizedPayload,
        headers: {
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
        timeout: 10000,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 413, 422, 500]);
      });
    });
  });

  context("API Error Handling", () => {
    it("should return proper error format", () => {
      cy.request({
        method: "POST",
        url: `/order`,
        body: null,
        headers: {
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status >= 400) {
          expect(response.body).to.have.property("error");
          expect(response.body.error).to.be.a("string");
        }
      });
    });

    it("should handle invalid HTTP methods", () => {
      cy.request({
        method: "DELETE",
        url: `/order`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([405, 404]);
      });

      cy.request({
        method: "PUT",
        url: `/ingredients`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([405, 404]);
      });
    });

    it("should handle missing endpoints", () => {
      cy.request({
        method: "GET",
        url: `/nonexistent`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  context("API Performance", () => {
    const validOrderPayload = [
      {
        id: 1,
        ingredient: "Expresso",
        additional: false,
        price: 5,
      },
      {
        id: 3,
        ingredient: "Chocolate",
        additional: false,
        price: 4,
      },
    ];
    it("should handle multiple simultaneous requests", () => {
      const simultaneousRequests = 10;
      const requests = [];

      for (let i = 0; i < simultaneousRequests; i++) {
        requests.push(cy.request("GET", `/ingredients`));
      }

      requests.forEach((request) => {
        request.then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });

    it("should maintain performance under load", () => {
      const loadTestRequests = 20;
      const startTime = Date.now();

      const requests = Array.from({ length: loadTestRequests }, () =>
        cy.request({
          method: "POST",
          url: `/order`,
          body: validOrderPayload,
          headers: {
            "Content-Type": "application/json",
          },
        })
      );

      Promise.all(requests).then(() => {
        const totalTime = Date.now() - startTime;
        const averageTime = totalTime / loadTestRequests;
        expect(averageTime).to.be.lessThan(1000);
      });
    });
  });

  context("API Data Integrity", () => {
    it("should maintain consistent ingredient data across requests", () => {
      let firstResponse;

      cy.request("GET", `/ingredients`)
        .then((response) => {
          firstResponse = response.body;
          expect(firstResponse).to.be.an("array");
        })
        .then(() => {
          // Make second request
          return cy.request("GET", `/ingredients`);
        })
        .then((response) => {
          // Data should be consistent
          expect(response.body).to.deep.equal(firstResponse);
        });
    });
  });

  context("CORS and Headers", () => {
    it("should include proper CORS headers", () => {
      cy.request({
        method: "OPTIONS",
        url: `/ingredients`,
        failOnStatusCode: false,
      }).then((response) => {
        // Check for CORS headers if implemented
        if (response.headers["access-control-allow-origin"]) {
          expect(response.headers).to.have.property(
            "access-control-allow-origin"
          );
          expect(response.headers).to.have.property(
            "access-control-allow-methods"
          );
        }
      });
    });
  });
});
