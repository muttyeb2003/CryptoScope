import React, { Suspense } from 'react';
import Image from 'next/image';
import DataTable from '@/components/ui/DataTable';
import { Divide, TrendingDown, TrendingUp } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { fetcher } from '@/lib/coingecko.actions';
import CoinOverview from '@/components/home/CoinOverview';
import TrendingCoins from '@/components/home/TrendingCoins';
import {
  CoinOverviewFallback,
  TrendingCoinsFallback,
  CategoriesFallback,
} from '@/components/ui/home/fallback';
import Categories from '@/components/home/Categories';

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
    cell: (coin) => <p>${coin.item.data.price}</p>,
  },
];

const page = async () => {
  const coin = await fetcher<CoinDetailsData>('coins/bitcoin', {
    dex_pair_format: 'symbol',
  });
  const trendingCoins = await fetcher<{ coins: TrendingCoin[] }>(
    '/search/trending',
    undefined,
    300
  );
  return (
    <main className="main-container">
      <section className="home-grid">
        <Suspense fallback={<CoinOverviewFallback />}>
          <CoinOverview></CoinOverview>
        </Suspense>

        <Suspense fallback={<TrendingCoinsFallback />}>
          <TrendingCoins></TrendingCoins>
        </Suspense>
      </section>
      <section className="w-full mt-7 space-y-4">
        <Suspense fallback={<CategoriesFallback />}>
          <Categories />
        </Suspense>
      </section>
    </main>
  );
};

export default page;
