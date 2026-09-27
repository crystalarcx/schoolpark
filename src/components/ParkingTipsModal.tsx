import React from 'react';
import { X, AlertTriangle, ShieldCheck, Clock, Ban, Info } from 'lucide-react';

interface ParkingTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParkingTipsModal: React.FC<ParkingTipsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              台南週末校園臨時停車須知
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-4 py-4 text-xs leading-relaxed text-slate-600">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-amber-900">
              <strong className="font-bold">切勿過夜停放：</strong>
              校園停車僅限日間臨時停車，每日閉門時間（約 17:00 或 20:00，以各校門口公告為準）前務必將車輛駛離，逾時鐵捲門拉下將無法取車。
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-md bg-indigo-50 text-indigo-600 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-800">開放時間與特殊限制</div>
                <p className="text-slate-500 mt-0.5">
                  大部分學校僅於例假日（週六、日及國定假日）開放；部分學校有特殊規定，例如：<strong>勝利國小</strong>僅週六日開放、<strong>大灣高中</strong>僅週日開放、<strong>文元國小</strong>為委外經營每日全日收費開放。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-md bg-emerald-50 text-emerald-600 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-800">收費與免費標準</div>
                <p className="text-slate-500 mt-0.5">
                  註記「收費」之學校由交通局委外或裝設車牌辨識計費系統，多為每小時 20 元；註記「免費」之學校請依照現場警衛引導或指示停放，請勿阻礙消防通道與他人進出。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-md bg-red-50 text-red-600 mt-0.5">
                <Ban className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-800">學校活動優先暫停</div>
                <p className="text-slate-500 mt-0.5">
                  若遇學校舉辦校慶、國家考試、校際運動賽事或重大校園工程，該校將暫停對外開放停車，請以校門口現場告示為準。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors"
          >
            我瞭解了
          </button>
        </div>
      </div>
    </div>
  );
};
