export const openApiReducerMock = {
  schema: {
    components: {
      schemas: {
        Portfolio: {
          properties: {}
        },
        PortfolioItem: {
          properties: {
            portfolio_id: {
              readOnly: true
            }
          }
        }
      }
    }
  }
};
