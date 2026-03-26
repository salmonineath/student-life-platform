export default function TrustBar() {
  return (
    <div className="py-8 border-b border-slate-100 bg-white">
      <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-75">
        <p className="text-sm font-medium text-slate-500">
          Trusted by students at:
        </p>
        <div className="flex gap-10 text-slate-400 font-medium">
          <div>CADT</div>
          <div>ITC</div>
          <div>RUPP</div>
          <div>UEC</div>
          <div>NPIC</div>
        </div>
      </div>
    </div>
  );
}
