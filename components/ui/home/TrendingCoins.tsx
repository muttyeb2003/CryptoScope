import { fetcher } from '@/lib/coingecko.actions';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingDown, TrendingUp } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { cn, formatCurrency } from '@/lib/utils';
import { TrendingCoinsFallback } from './fallback';

const TrendingCoins = async () => {
  let trendingCoins;
  try {
    trendingCoins = await fetcher<{ coins: TrendingCoin[] }>(
      '/search/trending',
      undefined,
      300
    );
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    return <TrendingCoinsFallback />;
  }
  const columns: DataTableColumn<TrendingCoin>[] = [
    {
      header: 'Name',
      cell: (coin) => {
        const item = coin.item;
        return (
          <Link href={`/coins/${item.id}`} className="flex items-center gap-2">
            <Image src={item.large} alt={item.name} width={36} height={36} />
            <p>{item.name}</p>
          </Link>
        );
      },
    },
    {
      header: '24h Change',
      cell: (coin) => {
        const change = coin.item.data.price_change_percentage_24h.usd;
        const isTrendingUp = change > 0;

        return (
          <div
            className={cn(
              'flex items-center gap-1',
              isTrendingUp ? 'text-green-500' : 'text-red-500'
            )}
          >
            {isTrendingUp ? (
              <TrendingUp width={16} height={16} />
            ) : (
              <TrendingDown width={16} height={16} />
            )}
            <p>{Math.abs(change).toFixed(2)}%</p>
          </div>
        );
      },
    },
    {
      header: 'Price',
      cell: (coin) => <p>{formatCurrency(coin.item.data.price)}</p>,
    },
  ];

  return (
    <div id="trending-coins">
      <h4>Trending Coins</h4>
      <div className="bg-white/4 backdrop-blur-sm rounded-xl overflow-hidden">
        <DataTable
          data={trendingCoins.coins.slice(0, 6)}
          columns={columns}
          rowKey={(coin) => coin.item.id}
          tableClassName="trending-coins-table"
          headerCellClassName="py-3!"
          bodyCellClassName="py-2"
        />
      </div>
    </div>
  );
};

export default TrendingCoins;
