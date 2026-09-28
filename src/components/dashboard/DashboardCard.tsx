import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  subtext?: string;
  icon: ReactNode;
  iconBg?: string;
  changePct?: number;
  comparisonText?: string;
  isPositiveGood?: boolean; // if false (e.g. for expenses or debt), an increase is bad
  highlightBorder?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtext,
  icon,
  iconBg = 'bg-blue-50 text-blue-600',
  changePct,
  comparisonText,
  isPositiveGood = true,
  highlightBorder,
}) => {
  const isUp = changePct !== undefined && changePct > 0;
  const isDown = changePct !== undefined && changePct < 0;
  const isNeutral = changePct === undefined || changePct === 0;

  // If isPositiveGood = true (revenue, profit): up is green, down is red.
  // If isPositiveGood = false (expenses, debt): up is red, down is green.
  let badgeColor = 'bg-slate-100 text-slate-600';
  if (changePct !== undefined) {
    if (changePct > 0) {
      badgeColor = isPositiveGood ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700';
    } else if (changePct < 0) {
      badgeColor = isPositiveGood ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700';
    }
  }

  return (
    <div
      className={`bg-white rounded-2xl p-5 border shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between ${
        highlightBorder || 'border-slate-200/80'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{title}</span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            {icon}
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
          {subtext && <div className="text-xs text-slate-400 mt-0.5">{subtext}</div>}
        </div>
      </div>

      {changePct !== undefined && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] ${badgeColor}`}>
            {isUp && <TrendingUp className="w-3.5 h-3.5" />}
            {isDown && <TrendingDown className="w-3.5 h-3.5" />}
            {isNeutral && <Minus className="w-3.5 h-3.5" />}
            <span>
              {changePct > 0 ? '+' : ''}
              {changePct.toFixed(1)}%
            </span>
          </div>
          {comparisonText && <span className="text-[11px] text-slate-400">{comparisonText}</span>}
        </div>
      )}
    </div>
  );
};
