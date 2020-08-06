const { defineMessages } = require('react-intl');

const tableToolbarMessages = defineMessages({
  name: {
    id: 'tableToolbar.name',
    defaultMessage: 'Name'
  },
  filterByTitle: {
    id: 'tableToolbar.filterByTitle',
    defaultMessage: 'Filter by {title}'
  },
  noResultsFound: {
    id: 'tableToolbar.noResultsFound',
    defaultMessage: 'No results found'
  },
  noResult: {
    id: 'tableToolbar.noResult',
    defaultMessage: 'No {results}'
  },
  clearAllFilters: {
    id: 'tableToolbar.clearAllFilters',
    defaultMessage: 'Clear all filters'
  },
  clearAllFiltersDescription: {
    id: 'tableToolbar.clearAllFiltersDescription',
    defaultMessage: 'No results match the filter criteria. Remove all filters or clear all filters to show results.'
  },
  ariaLabel: {
    id: 'tableToolbar.ariaLabel',
    defaultMessage: '{title} table'
  }
});

export default tableToolbarMessages;
