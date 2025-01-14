/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import shortid from 'shortid';
import { t } from '@superset-ui/core';
import { areObjectsEqual } from 'src/reduxUtils';
import { DataMaskUnit } from 'src/dataMask/types';
import { FilterSet } from 'src/dashboard/reducers/types';

export const generateFiltersSetId = () => `FILTERS_SET-${shortid.generate()}`;

export const APPLY_FILTERS_HINT = t('Please apply filter changes');

export const getFilterValueForDisplay = (
  value?: string[] | null | string | number | object,
): string => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return `${value}`;
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return t('Unknown value');
};

export const findExistingFilterSet = ({
  filterSetFilterValues,
  dataMaskApplied,
  dataMaskSelected,
}: {
  filterSetFilterValues: FilterSet[];
  dataMaskApplied: DataMaskUnit;
  dataMaskSelected: DataMaskUnit;
}) =>
  filterSetFilterValues.find(({ dataMask }) => {
    if (dataMask?.nativeFilters) {
      return Object.values(dataMask?.nativeFilters).every(
        filterFromFilterSet => {
          let currentValueFromFiltersTab =
            dataMaskApplied[filterFromFilterSet.id]?.currentState ?? {};
          if (dataMaskSelected[filterFromFilterSet.id]) {
            currentValueFromFiltersTab =
              dataMaskSelected[filterFromFilterSet.id]?.currentState;
          }
          return areObjectsEqual(
            filterFromFilterSet.currentState ?? {},
            currentValueFromFiltersTab,
          );
        },
      );
    }
    return false;
  });
