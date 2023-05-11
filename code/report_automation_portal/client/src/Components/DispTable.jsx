/* eslint-disable react/jsx-props-no-spreading */
import { useTable, usePagination } from 'react-table';
import PropTypes from 'prop-types';

export default function DispTable({ columns, data, cssClass }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: data || [],
      initialState: { pageIndex: 0 },
    },
    usePagination
  );
  return (
    <>
      <table className={cssClass} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <input
          type="button"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          value="<<"
        />{' '}
        <input
          type="button"
          value="<"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        />{' '}
        <input
          type="button"
          value=">"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        />{' '}
        <input
          type="button"
          value=">>"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        />{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const pageVal = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(pageVal);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          className="pagination-select"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pgSize) => (
            <option key={pgSize} value={pgSize}>
              Show {pgSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

DispTable.defaultProps = {
  columns: [],
  data: [],
  cssClass: '',
};

DispTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          Header: PropTypes.string,
          accessor: PropTypes.string,
        })
      ),
    })
  ),
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.arrayOf(PropTypes.object),
  cssClass: PropTypes.string,
};
