import { fetcher } from '@/lib/coingecko.actions';
import { cn, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import CandlestickChart from '@/components/CandlestickChart';
import CoinConverter from '@/components/CoinConverter';

const getFirstValidLink = (
  links?: (string | null | undefined)[]
): string | null => {
  if (!links) return null;

  for (const link of links) {
    if (link && link.trim() !== '' && link !== '#') {
      return link;
    }
  }

  return null;
};

const Page = async ({ params }: NextPageProps) => {
  const { id } = await params;

  const [coinData, coinOHLCData] = await Promise.all([
    fetcher<CoinDetailsData>(`coins/${id}`, {
      dex_pair_format: 'contract_address',
    }),
    fetcher<OHLCData[]>(`coins/${id}/ohlc`, {
      vs_currency: 'usd',
      days: 1,
      precision: 'full',
    }),
  ]);

  const currentPrice = coinData.market_data.current_price.usd;
  const priceChange24h =
    coinData.market_data.price_change_percentage_24h_in_currency.usd;

  const descriptionText = coinData.description?.en
    ? `${coinData.description.en
        .replace(/<[^>]+>/g, '')
        .split('. ')
        .slice(0, 2)
        .join('. ')}.`
    : 'No description available.';

  const coinDetails = [
    {
      label: 'Market Cap',
      value: formatCurrency(coinData.market_data.market_cap.usd),
    },
    {
      label: 'Market Cap Rank',
      value: `# ${coinData.market_cap_rank}`,
    },
    {
      label: 'Total Volume',
      value: formatCurrency(coinData.market_data.total_volume.usd),
    },
    {
      label: 'Website',
      value: '-',
      link: getFirstValidLink(coinData.links.homepage),
      linkText: 'Homepage',
    },
    {
      label: 'Explorer',
      value: '-',
      link: getFirstValidLink(coinData.links.blockchain_site),
      linkText: 'Explorer',
    },
    {
      label: 'Community',
      value: '-',
      link:
        coinData.links.subreddit_url ||
        getFirstValidLink(coinData.links.official_forum_url) ||
        getFirstValidLink(coinData.links.repos_url?.github),
      linkText: 'Community',
    },
  ];

  return (
    <main id="coin-details-page">
      <section className="primary space-y-6">
        <div className="rounded-xl bg-dark-500 p-6 space-y-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={coinData.image.large}
                alt={coinData.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full"
              />
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.35em] text-purple-100/70">
                  {coinData.symbol}
                </p>
                <h1 className="text-3xl font-semibold">{coinData.name}</h1>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <p className="text-4xl font-semibold tracking-tight">
                {formatCurrency(currentPrice)}
              </p>

              <div
                className={cn(
                  'mt-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                  priceChange24h >= 0
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                )}
              >
                <span>{priceChange24h >= 0 ? '↗' : '↘'}</span>
                <span>{Math.abs(priceChange24h).toFixed(1)}%</span>
                <span className="opacity-70">~ (24h)</span>
              </div>
            </div>
          </div>

          <CandlestickChart data={coinOHLCData} coinId={id}>
            <div className="header pt-2">
              <h2 className="text-2xl font-semibold">Trending Overview</h2>
            </div>
          </CandlestickChart>

          <p className="text-sm leading-7 text-purple-100/80">
            {descriptionText}
          </p>
        </div>
      </section>

      <section className="secondary">
        <div className="details">
          <h4 className="mb-4">{coinData.symbol.toUpperCase()} Converter</h4>
          <CoinConverter
            symbol={coinData.symbol}
            name={coinData.name}
            image={
              coinData.image.small ||
              coinData.image.thumb ||
              coinData.image.large
            }
            prices={coinData.market_data?.current_price ?? {}}
          />
        </div>

        <div className="details">
          <h4>Coin Details</h4>
          <ul className="details-grid">
            {coinDetails.map(({ label, value, link, linkText }, index) => (
              <li key={index}>
                <p className="label">{label}</p>
                {link ? (
                  <div className="link">
                    <Link href={link} target="_blank" rel="noreferrer">
                      {linkText || label}
                    </Link>
                    <ArrowUpRight size={16} />
                  </div>
                ) : (
                  <p className="text-base font-medium">{value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default Page;