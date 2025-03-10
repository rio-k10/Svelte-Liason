describe('App Basic Functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the application and display posts', () => {
    cy.get('ul > li').should('have.length.greaterThan', 1);

    cy.get('ul > li')
      .first()
      .within(() => {
        cy.get('h3').should('be.visible');
        cy.get('p').should('be.visible');
        cy.get('button').should('contain', 'Remove');
      });
  });

  it('should allow the user to search for posts', () => {
    cy.get('input[placeholder="Search posts..."]')
      .type('qui')
      .should('have.value', 'qui');

    cy.get('ul > li').each(($post) => {
      cy.wrap($post).within(() => {
        cy.get('h3').should('contain.text', 'qui');
      });
    });
  });

  it('should allow the user to delete a post', () => {
    cy.get('ul > li').then(($posts) => {
      const initialPostCount = $posts.length;

      cy.get('ul > li')
        .first()
        .within(() => {
          cy.get('button').click();
        });

      cy.get('ul > li').should('have.length', initialPostCount - 1);
    });
  });

  it('should display a message if no posts match the search term', () => {
    cy.get('input[placeholder="Search posts..."]').type(
      'nonexistentsearchterm'
    );

    cy.get('p').should('contain', 'No posts found.');
  });
});
