import { AppTabs } from '../../smart-components/app-tabs/app-tabs';
import { toolbarComponentTypes } from '../toolbar-mapper';
import AsyncPagination from '../../smart-components/common/async-pagination';

export const createRequestsToolbarSchema = ({
  searchValue,
  onFilterChange,
  title
}) => ({
  fields: [
    {
      component: toolbarComponentTypes.TOP_TOOLBAR,
      key: 'requests-toolbar',
      fields: [
        {
          component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
          key: 'requests-toolbar-title',
          title
        },
        {
          component: toolbarComponentTypes.LEVEL,
          key: 'requests-toolbar-actions',
          fields: [
            {
              component: toolbarComponentTypes.LEVEL_ITEM,
              key: 'input-level-item',
              fields: [
                {
                  component: toolbarComponentTypes.FILTER_TOOLBAR_ITEM,
                  key: 'requests-toolbar-filter-input',
                  searchValue,
                  onFilterChange,
                  placeholder: 'Filter by request...'
                }
              ]
            },
            {
              component: toolbarComponentTypes.LEVEL_ITEM,
              key: 'pagination-level-item',
              fields: []
            }
          ]
        }
      ]
    }
  ]
});

export const createRequestsTopToolbarSchema = ({
  title,
  paddingBottom,
  tabItems
}) => ({
  fields: [
    {
      component: toolbarComponentTypes.TOP_TOOLBAR,
      key: 'requests-toolbar',
      paddingBottom,
      fields: [
        {
          component: toolbarComponentTypes.TOP_TOOLBAR_TITLE,
          key: 'requests-toolbar-title',
          title
        },
        {
          component: toolbarComponentTypes.LEVEL_ITEM,
          key: 'tabs-level-item',
          fields: tabItems
            ? [
              {
                component: AppTabs,
                key: 'request-tabs',
                tabItems
              }
            ]
            : []
        }
      ]
    }
  ]
});

export const createRequestsFilterToolbarSchema = ({
  searchValue,
  onFilterChange,
  meta,
  apiRequest,
  filterPlaceholder
}) => ({
  fields: [
    {
      component: toolbarComponentTypes.TOOLBAR,
      key: 'requests-filter-toolbar',
      className: 'pf-u-pt-md pf-u-pb-md pf-u-pr-lg pf-u-pl-lg toolbar',
      fields: [
        {
          component: toolbarComponentTypes.LEVEL,
          key: 'requests-toolbar-actions',
          className: 'pf-m-grow',
          fields: [
            {
              component: toolbarComponentTypes.LEVEL_ITEM,
              key: 'input-level-item',
              fields: [
                {
                  component: toolbarComponentTypes.FILTER_TOOLBAR_ITEM,
                  key: 'requests-toolbar-filter-input',
                  searchValue,
                  onFilterChange,
                  placeholder: filterPlaceholder
                }
              ]
            },
            {
              component: toolbarComponentTypes.LEVEL_ITEM,
              key: 'pagination-level-item',
              fields:
                  meta.count > 0
                    ? [
                      {
                        component: AsyncPagination,
                        key: 'request-pagination',
                        apiRequest,
                        meta,
                        isCompact: true
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
