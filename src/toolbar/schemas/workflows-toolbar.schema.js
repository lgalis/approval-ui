import { Pagination } from '@redhat-cloud-services/frontend-components';

import { toolbarComponentTypes } from '../toolbar-mapper';

export const createApprovalFilterToolbarSchema = ({
  searchValue,
  onFilterChange,
  pagination
}) => ({
  fields: [
    {
      component: toolbarComponentTypes.TOOLBAR,
      key: 'approval-filter-toolbar',
      fields: [
        {
          component: toolbarComponentTypes.LEVEL,
          key: 'approval-toolbar-actions',
          fields: [
            {
              component: toolbarComponentTypes.LEVEL_ITEM,
              key: 'input-level-item',
              fields: [
                {
                  component: toolbarComponentTypes.FILTER_TOOLBAR_ITEM,
                  key: 'approval-toolbar-filter-input',
                  searchValue,
                  onFilterChange,
                  placeholder: 'Filter by name...'
                }
              ]
            },
            {
              component: toolbarComponentTypes.LEVEL_ITEM,
              key: 'pagination-level-item',
              fields: pagination
                ? [
                    {
                      component: Pagination,
                      key: 'platform-pagination',
                      ...pagination
                    }
                  ]
                : []
            }
          ]
        }
      ]
    }
  ]
});
