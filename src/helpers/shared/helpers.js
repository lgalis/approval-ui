import React from 'react';
import { DateFormat } from '@redhat-cloud-services/frontend-components';

const activeStates = [ 'notified' ];

export const scrollToTop = () => document.getElementById('root').scrollTo({
  behavior: 'smooth',
  top: 0,
  left: 0
});

export const getCurrentPage = (limit = 1, offset = 0) => Math.floor(offset / limit) + 1;

export const getNewPage = (page = 1, offset) => (page - 1) * offset;

export const isRequestStateActive = (state) => activeStates.includes(state);

export const timeAgo = (date) => (
  <span key={ date }>
    <DateFormat date={ date } type="relative" />
  </span>
);

