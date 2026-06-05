export default function RBARateSection({
  rbaCashRate,
  rbaNote,
}: {
  rbaCashRate: string;
  rbaNote: string;
}) {
  return (
    <div className="bg-[#1A2B5E]/5 border border-[#1A2B5E]/10 rounded-xl px-5 py-4 my-2">
      <p className="text-base">
        <strong className="text-[#1A2B5E]">当前现金利率：{rbaCashRate}%</strong>
        <span className="text-gray-600 ml-1">（{rbaNote}）</span>
      </p>
      <p className="text-sm text-gray-500 mt-1">
        RBA 现金利率是澳洲银行间隔夜借贷的基准利率，直接影响各银行浮动房贷利率走势。
      </p>
    </div>
  );
}
