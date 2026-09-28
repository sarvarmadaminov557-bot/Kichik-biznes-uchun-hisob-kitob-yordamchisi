import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Search, Filter, ShieldAlert, Clock, User } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export const AuditLogTab: React.FC = () => {
  const { auditLogs, user, t } = useApp();
  const [search, setSearch] = useState('');

  const isAuthorized = user?.role === 'owner' || user?.role === 'manager';

  if (!isAuthorized) {
    return (
      <div className="py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-800">{t('permissionDenied')}</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Tizim jurnali (Audit Log) faqat Biznes egasi yoki Menejerlar uchun ochiq.
        </p>
      </div>
    );
  }

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.objectType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('auditTitle')}</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">{t('auditSubtitle')}</p>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Harakat yoki xodim ismi bo'yicha qidirish..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Logs Table */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="w-7 h-7" />}
          title="Audit qaydlari topilmadi"
          description="Hozircha hech qanday xavfsizlik jurnali yozilmagan."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">{t('auditTime')}</th>
                <th className="py-3 px-4">{t('auditUser')}</th>
                <th className="py-3 px-4">{t('auditAction')}</th>
                <th className="py-3 px-4">{t('auditObject')}</th>
                <th className="py-3 px-4">{t('auditDetails')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    <div>{new Date(log.createdAt).toLocaleDateString()}</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{log.userName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{log.objectType}</td>
                  <td className="py-3 px-4 text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
