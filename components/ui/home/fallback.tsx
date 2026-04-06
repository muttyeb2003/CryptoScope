import React from 'react';
import DataTable from '@/components/ui/DataTable';

export const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image skeleton" />
        <div className="info">
          <div className="header-line-sm skeleton"></div>
          <div className="header-line-lg skeleton"></div>
        </div>
      </div>
      <div className="chart">
        <div className="chart-skeleton skeleton"></div>
      </div>
    </div>
  );
};

export const TrendingCoinsFallback = () => {
  const skeletonData = Array.from({ length: 6 }, (_, i) => ({ id: `skeleton-${i}` }));

  const columns = [
    {
      header: 'Name',
      cell: () => (
        <div className="name-link">
          <div className="name-image skeleton" />
          <div className="name-line skeleton" />
        </div>
      ),
    },
    {
      header: '24h Change',
      cell: () => (
        <div className="change-cell">
          <div className="price-change">
            <div className="change-icon skeleton" />
            <div className="change-line skeleton" />
          </div>
        </div>
      ),
    },
    {
      header: 'Price',
      cell: () => (
        <div className="price-cell">
          <div className="price-line skeleton" />
        </div>
      ),
    },
  ];

  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <div className="bg-white/4 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <DataTable
          data={skeletonData}
          columns={columns}
          rowKey={(row) => row.id}
          tableClassName="trending-coins-table"
          headerCellClassName="py-3!"
          bodyCellClassName="py-2"
        />
      </div>
    </div>
  );
};

export const CategoriesFallback = () => {
  const skeletonData = Array.from({ length: 10 }, (_, i) => ({ id: `skeleton-${i}` }));

  const columns = [
    {
      header: 'Category',
      cellClassName: 'category-cell',
      cell: () => <div className="category-skeleton skeleton" />,
    },
    {
      header: 'Top Gainers',
      cellClassName: 'top-gainers-cell',
      cell: () => (
        <div className="flex gap-1 mr-5">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="coin-skeleton skeleton" />
          ))}
        </div>
      ),
    },
    {
      header: '24h Change',
      cellClassName: 'change-header-cell',
      cell: () => (
        <div className="change-cell">
          <div className="change-icon skeleton" />
          <div className="value-skeleton-sm skeleton" />
        </div>
      ),
    },
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell',
      cell: () => <div className="value-skeleton-sm skeleton" />,
    },
    {
      header: '24h Volume',
      cellClassName: 'volume-cell',
      cell: () => <div className="value-skeleton-sm skeleton" />,
    },
  ];

  return (
    <div id="categories-fallback" className="custom-scrollbar">
      <h4>Top Categories</h4>
      <DataTable
        columns={columns}
        data={skeletonData}
        rowKey={(row) => row.id}
        tableClassName="mt-3"
      />
    </div>
  );
};
