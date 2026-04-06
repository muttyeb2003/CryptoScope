'use client';
import {
  getCandlestickConfig,
  getChartConfig,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
} from '@/constants';
import { fetcher } from '@/lib/coingecko.actions';
import { convertOHLCData } from '@/lib/utils';
import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
} from 'lightweight-charts';
import React, { useEffect, useRef, useState, useTransition } from 'react';

const CandlestickChart = ({
  children,
  data,
  coinId,
  height = 360,
  initialPeriod = 'daily',
}: CandlestickChartProps) => {
  const [period, setPeriod] = useState(initialPeriod);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
  const [isPending, startTransition] = useTransition();

  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const fetchOHCLCData = async (selectPeriod: Period) => {
    try {
      const { days } = PERIOD_CONFIG[selectPeriod];
      const newData = await fetcher<OHLCData[]>(`coins/${coinId}/ohlc`, {
        vs_currency: 'usd',
        days,
      });
      setOhlcData(newData ?? []);
    } catch (e) {
      console.error('Failed to fetch OHLCData', e);
      // If max period fails (often due to API limits), fallback to yearly
      if (selectPeriod === 'max') {
        try {
          console.log('Retrying with yearly (365 days) fallback...');
          const fallbackData = await fetcher<OHLCData[]>(
            `coins/${coinId}/ohlc`,
            {
              vs_currency: 'usd',
              days: 365,
            }
          );
          setOhlcData(fallbackData ?? []);
        } catch (fallbackError) {
          console.error('Fallback fetch failed for max period:', fallbackError);
        }
      }
    }
  };

  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;
    startTransition(async () => {
      setPeriod(newPeriod);
      await fetchOHCLCData(newPeriod);
    });
  };

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const showTime = ['daily', 'weekly', 'monthly'].includes(period);

    const chart = createChart(container, {
      ...getChartConfig(height, showTime),
      width: container.clientWidth,
    });
    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

    const convertedToSeconds = ohlcData.map(
      (item) =>
        [
          Math.floor(item[0] / 1000),
          item[1],
          item[2],
          item[3],
          item[4],
        ] as OHLCData
    );
    series.setData(convertOHLCData(convertedToSeconds));
    chart.timeScale().fitContent();

    chartRef.current = chart;
    candleSeriesRef.current = series;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      chart.applyOptions({ width: entries[0].contentRect.width });
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [height, period]);

  useEffect(() => {
    if (!candleSeriesRef.current) return;

    const convertToSeconds = ohlcData.map(
      (item) =>
        [
          Math.floor(item[0] / 1000),
          item[1],
          item[2],
          item[3],
          item[4],
        ] as OHLCData
    );
    const converted = convertOHLCData(convertToSeconds);
    candleSeriesRef.current.setData(converted);
    chartRef.current?.timeScale().fitContent();
  }, [ohlcData, period]);

  return (
    <div
      id="candlestick-chart"
      className="w-full overflow-hidden rounded-xl bg-dark-500 p-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">{children}</div>
        <div className="flex gap-1 xl:gap-2 items-center">
          <span className="text-sm mx-2 font-medium text-purple-100/50">
            Period:
          </span>
          {PERIOD_BUTTONS.map(({ value, label }) => (
            <button
              key={value}
              className={
                period === value ? 'config-button-active' : 'config-button'
              }
              onClick={() => {
                handlePeriodChange(value);
              }}
              disabled={isPending}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full overflow-hidden rounded-xl bg-dark-500">
        <div
          ref={chartContainerRef}
          className="w-full"
          style={{ width: '100%', height, boxSizing: 'border-box' }}
        />
      </div>
    </div>
  );
};

export default CandlestickChart;
