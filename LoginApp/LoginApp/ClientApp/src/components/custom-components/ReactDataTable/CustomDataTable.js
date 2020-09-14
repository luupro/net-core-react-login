import React, { memo, useReducer, useMemo, useCallback, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { DataTableProvider } from 'react-data-table-component';
import { tableReducer } from 'react-data-table-component';
import Table from 'react-data-table-component';
import TableHead from 'react-data-table-component';
import TableHeadRow from 'react-data-table-component';
import TableRow from 'react-data-table-component';
import TableCol from 'react-data-table-component';
import TableColCheckbox from 'react-data-table-component';
import TableHeader from 'react-data-table-component';
import TableSubheader from 'react-data-table-component';
import TableBody from 'react-data-table-component';
import ResponsiveWrapper from 'react-data-table-component';
import ProgressWrapper from 'react-data-table-component';
import TableWrapper from 'react-data-table-component';
import TableColExpander from 'react-data-table-component';
import { CellBase } from 'react-data-table-component';
import NoData from 'react-data-table-component';
import NativePagination from 'react-data-table-component';
import useDidUpdateEffect from 'react-data-table-component';
import { propTypes, defaultProps } from 'react-data-table-component';
import { isEmpty, sort, decorateColumns, getNumberOfPages, recalculatePage, isRowSelected } from 'react-data-table-component';
import { getSortDirection } from './common';
import { createStyles } from 'react-data-table-component';

const CustomDataTable = memo(({
  data,
  columns,
  title,
  actions,
  keyField,
  striped,
  highlightOnHover,
  pointerOnHover,
  dense,
  selectableRows,
  selectableRowsHighlight,
  selectableRowsNoSelectAll,
  selectableRowsVisibleOnly,
  selectableRowSelected,
  selectableRowDisabled,
  selectableRowsComponent,
  selectableRowsComponentProps,
  onRowExpandToggled,
  onSelectedRowsChange,
  expandableIcon,
  onChangeRowsPerPage,
  onChangePage,
  paginationServer,
  paginationServerOptions,
  paginationTotalRows,
  paginationDefaultPage,
  paginationResetDefaultPage,
  paginationPerPage,
  paginationRowsPerPageOptions,
  paginationIconLastPage,
  paginationIconFirstPage,
  paginationIconNext,
  paginationIconPrevious,
  paginationComponent,
  paginationComponentOptions,
  className,
  style,
  responsive,
  overflowY,
  overflowYOffset,
  progressPending,
  progressComponent,
  persistTableHead,
  noDataComponent,
  disabled,
  noTableHead,
  noHeader,
  fixedHeader,
  fixedHeaderScrollHeight,
  pagination,
  subHeader,
  subHeaderAlign,
  subHeaderWrap,
  subHeaderComponent,
  noContextMenu,
  contextMessage,
  contextActions,
  contextComponent,
  expandableRows,
  onRowClicked,
  onRowDoubleClicked,
  sortIcon,
  onSort,
  sortFunction,
  sortServer,
  expandableRowsComponent,
  expandableRowDisabled,
  expandableRowsHideExpander,
  expandOnRowClicked,
  expandOnRowDoubleClicked,
  expandableRowExpanded,
  expandableInheritConditionalStyles,
  defaultSortField,
  defaultSortAsc,
  clearSelectedRows,
  conditionalRowStyles,
  theme,
  customStyles,
  direction,
}) => {
  const initialState = {
    allSelected: false,
    selectedCount: 0,
    selectedRows: [],
    sortColumn: defaultSortField,
    selectedColumn: {},
    sortDirection: getSortDirection(defaultSortAsc),
    currentPage: paginationDefaultPage,
    rowsPerPage: paginationPerPage,
  };

  const [{
    rowsPerPage,
    currentPage,
    selectedRows,
    allSelected,
    selectedCount,
    sortColumn,
    selectedColumn,
    sortDirection,
  }, dispatch] = useReducer(tableReducer, initialState);
  const { persistSelectedOnSort, persistSelectedOnPageChange } = paginationServerOptions;
  const mergeSelections = paginationServer && (persistSelectedOnPageChange || persistSelectedOnSort);
  const enabledPagination = pagination && !progressPending && data.length > 0;
  const Pagination = paginationComponent || NativePagination;
  const columnsMemo = useMemo(() => decorateColumns(columns), [columns]);
  const currentTheme = useMemo(() => createStyles(customStyles, theme), [customStyles, theme]);
  const expandableRowsComponentMemo = useMemo(() => expandableRowsComponent, [expandableRowsComponent]);
  const wrapperProps = useMemo(() => ({ ...direction !== 'auto' && ({ dir: direction }) }), [direction]);
  const handleRowClicked = useCallback((row, e) => onRowClicked(row, e), [onRowClicked]);
  const handleRowDoubleClicked = useCallback((row, e) => onRowDoubleClicked(row, e), [onRowDoubleClicked]);
  const handleChangePage = page => dispatch({
    type: 'CHANGE_PAGE',
    page,
    paginationServer,
    visibleOnly: selectableRowsVisibleOnly,
    persistSelectedOnPageChange,
  });

  useDidUpdateEffect(() => {
    onSelectedRowsChange({ allSelected, selectedCount, selectedRows });
  }, [selectedCount]);

  useDidUpdateEffect(() => {
    onChangePage(currentPage, paginationTotalRows || data.length);
  }, [currentPage]);

  useDidUpdateEffect(() => {
    onChangeRowsPerPage(rowsPerPage, currentPage);
  }, [rowsPerPage]);

  useDidUpdateEffect(() => {
    onSort(selectedColumn, sortDirection);
  }, [sortColumn, sortDirection]);

  useEffect(() => {
    dispatch({ type: 'CLEAR_SELECTED_ROWS', selectedRowsFlag: clearSelectedRows });
  }, [clearSelectedRows]);

  useDidUpdateEffect(() => {
    handleChangePage(paginationDefaultPage);
  }, [paginationDefaultPage, paginationResetDefaultPage]);

  useEffect(() => {
    if (selectableRowSelected) {
      const preSelectedRows = data.filter(row => selectableRowSelected(row));

      dispatch({ type: 'SELECT_MULTIPLE_ROWS', selectedRows: preSelectedRows, rows: data, mergeSelections });
    }
    // We only want to re-render if the data changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useDidUpdateEffect(() => {
    if (pagination && paginationServer && paginationTotalRows > 0) {
      const updatedPage = getNumberOfPages(paginationTotalRows, rowsPerPage);
      const recalculatedPage = recalculatePage(currentPage, updatedPage);
      if (currentPage !== recalculatedPage) {
        handleChangePage(recalculatedPage);
      }
    }
  }, [paginationTotalRows]);

  const columnsBySelector = useMemo(() => {
    return columns.reduce((acc, item) => ({ ...acc, [item.selector]: item }), {});
  }, [columns]);

  const sortedData = useMemo(() => {
    // server-side sorting bypasses internal sorting
    if (sortServer) {
      return data;
    }

    // use general sorting function when columns has no sort function on it's own
    const column = sortColumn && columnsBySelector[sortColumn];
    if (!column || !column.sortFunction) {
      return sort(data, sortColumn, sortDirection, sortFunction);
    }

    // use column's custom sorting function
    const customSortFunction = sortDirection === 'asc'
      ? column.sortFunction
      : (a, b) => column.sortFunction(a, b) * -1;

    return [...data].sort(customSortFunction);
  }, [sortServer, sortColumn, columnsBySelector, sortDirection, data, sortFunction]);

  const calculatedRows = useMemo(() => {
    if (pagination && !paginationServer) {
      // when using client-side pagination we can just slice the data set
      const lastIndex = currentPage * rowsPerPage;
      const firstIndex = lastIndex - rowsPerPage;

      return sortedData.slice(firstIndex, lastIndex);
    }

    return sortedData;
  }, [currentPage, pagination, paginationServer, rowsPerPage, sortedData]);

  // recalculate the pagination and currentPage if the data length changes
  if (pagination && !paginationServer && data.length > 0 && calculatedRows.length === 0) {
    const updatedPage = getNumberOfPages(data.length, rowsPerPage);
    const recalculatedPage = recalculatePage(currentPage, updatedPage);

    handleChangePage(recalculatedPage);
  }

  const handleChangeRowsPerPage = newRowsPerPage => {
    const rowCount = paginationTotalRows || calculatedRows.length;
    const updatedPage = getNumberOfPages(rowCount, newRowsPerPage);
    const recalculatedPage = recalculatePage(currentPage, updatedPage);

    // update the currentPage for client-side pagination
    // server - side should be handled by onChangeRowsPerPage
    if (!paginationServer) {
      handleChangePage(recalculatedPage);
    }

    dispatch({ type: 'CHANGE_ROWS_PER_PAGE', page: recalculatedPage, rowsPerPage: newRowsPerPage });
  };

  const init = {
    dispatch,
    data: selectableRowsVisibleOnly ? calculatedRows : data,
    allSelected,
    selectedRows,
    selectedCount,
    sortColumn,
    sortDirection,
    keyField,
    contextMessage,
    contextActions,
    contextComponent,
    sortServer,
    selectableRowsVisibleOnly,
    selectableRowSelected,
    selectableRowDisabled,
    selectableRowsComponent,
    selectableRowsComponentProps,
    persistSelectedOnSort,
    expandableIcon,
    pagination,
    paginationServer,
    paginationServerOptions,
    paginationTotalRows,
    paginationRowsPerPageOptions,
    paginationIconLastPage,
    paginationIconFirstPage,
    paginationIconNext,
    paginationIconPrevious,
    paginationComponentOptions,
    direction,
    mergeSelections,
  };

  const showTableHead = () => {
    if (noTableHead) {
      return false;
    }

    if (persistTableHead) {
      return true;
    }

    return data.length > 0 && !progressPending;
  };

  const showSelectAll = persistSelectedOnPageChange || selectableRowsNoSelectAll;

  return (
    <ThemeProvider theme={currentTheme}>
      <DataTableProvider initialState={init}>
        <ResponsiveWrapper
          responsive={responsive}
          className={className}
          style={style}
          overflowYOffset={overflowYOffset}
          overflowY={overflowY}
          {...wrapperProps}
        >
        {enabledPagination && (
            <Pagination
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                rowCount={paginationTotalRows || data.length}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
            />
            )}
          {!noHeader && (
            <TableHeader
              title={title}
              actions={actions}
              showMenu={!noContextMenu}
            />
          )}

          {subHeader && (
            <TableSubheader
              align={subHeaderAlign}
              wrapContent={subHeaderWrap}
            >
              {subHeaderComponent}
            </TableSubheader>
          )}

          <TableWrapper>
            {progressPending && !persistTableHead && (
              <ProgressWrapper>
                {progressComponent}
              </ProgressWrapper>
            )}

            <Table disabled={disabled} className="rdt_Table" role="table">
              {showTableHead() && (
                <TableHead className="rdt_TableHead" role="rowgroup">
                  <TableHeadRow
                    className="rdt_TableHeadRow"
                    role="row"
                    dense={dense}
                    disabled={progressPending || data.length === 0}
                  >
                    {selectableRows && (
                      showSelectAll
                        ? <CellBase style={{ flex: '0 0 48px' }} />
                        : <TableColCheckbox />
                    )}
                    {expandableRows && !expandableRowsHideExpander && (
                      <TableColExpander />
                    )}
                    {columnsMemo.map(column => (
                      <TableCol
                        key={column.id}
                        column={column}
                        sortIcon={sortIcon}
                      />
                    ))}
                  </TableHeadRow>
                </TableHead>
              )}

              {!data.length > 0 && !progressPending && (
                <NoData>
                  {noDataComponent}
                </NoData>
              )}

              {progressPending && persistTableHead && (
                <ProgressWrapper>
                  {progressComponent}
                </ProgressWrapper>
              )}

              {!progressPending && data.length > 0 && (
                <TableBody
                  fixedHeader={fixedHeader}
                  fixedHeaderScrollHeight={fixedHeaderScrollHeight}
                  hasOffset={overflowY}
                  offset={overflowYOffset}
                  className="rdt_TableBody"
                  role="rowgroup"
                >
                  {calculatedRows.map((row, i) => {
                    const id = isEmpty(row[keyField]) ? i : row[keyField];
                    const selected = isRowSelected(row, selectedRows, keyField);
                    const expanderExpander = expandableRows
                      && expandableRowExpanded
                      && expandableRowExpanded(row);

                    const expanderDisabled = expandableRows
                      && expandableRowDisabled
                      && expandableRowDisabled(row);

                    return (
                      <TableRow
                        id={id}
                        key={id}
                        keyField={keyField}
                        row={row}
                        columns={columnsMemo}
                        selectableRows={selectableRows}
                        expandableRows={expandableRows}
                        striped={striped}
                        highlightOnHover={highlightOnHover}
                        pointerOnHover={pointerOnHover}
                        dense={dense}
                        expandOnRowClicked={expandOnRowClicked}
                        expandOnRowDoubleClicked={expandOnRowDoubleClicked}
                        expandableRowsComponent={expandableRowsComponentMemo}
                        expandableRowsHideExpander={expandableRowsHideExpander}
                        onRowExpandToggled={onRowExpandToggled}
                        defaultExpanderDisabled={expanderDisabled}
                        defaultExpanded={expanderExpander}
                        inheritConditionalStyles={expandableInheritConditionalStyles}
                        onRowClicked={handleRowClicked}
                        onRowDoubleClicked={handleRowDoubleClicked}
                        conditionalRowStyles={conditionalRowStyles}
                        selected={selected}
                        selectableRowsHighlight={selectableRowsHighlight}
                        rowIndex={i}
                      />
                    );
                  })}
                </TableBody>
              )}
            </Table>
          </TableWrapper>

          
        </ResponsiveWrapper>
      </DataTableProvider>
    </ThemeProvider>
  );
});

CustomDataTable.propTypes = propTypes;
CustomDataTable.defaultProps = defaultProps;

export default CustomDataTable;
