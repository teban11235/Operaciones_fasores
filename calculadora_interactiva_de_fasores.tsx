import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, X, Divide, RotateCw, Info, Calculator, MoveRight, ChevronRight } from 'lucide-react';

const App = () => {
  const [m1, setM1] = useState(10);
  const [a1, setA1] = useState(30);
  const [m2, setM2] = useState(5);
  const [a2, setA2] = useState(-45);
  const [operation, setOperation] = useState('add');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const getRect = (m: number, a: number) => ({
    x: m * Math.cos(toRad(a)),
    y: m * Math.sin(toRad(a))
  });

  const getPolar = (x: number, y: number) => ({
    m: Math.sqrt(x * x + y * y),
    a: toDeg(Math.atan2(y, x))
  });

  const calculate = () => {
    const p1 = getRect(m1, a1);
    const p2 = getRect(m2, a2);
    let resX, resY, resM, resA;

    switch (operation) {
      case 'add':
        resX = p1.x + p2.x;
        resY = p1.y + p2.y;
        const addP = getPolar(resX, resY);
        resM = addP.m;
        resA = addP.a;
        break;
      case 'sub':
        resX = p1.x - p2.x;
        resY = p1.y - p2.y;
        const subP = getPolar(resX, resY);
        resM = subP.m;
        resA = subP.a;
        break;
      case 'mult':
        resM = m1 * m2;
        resA = a1 + a2;
        const multR = getRect(resM, resA);
        resX = multR.x;
        resY = multR.y;
        break;
      case 'div':
        resM = m2 !== 0 ? m1 / m2 : 0;
        resA = a1 - a2;
        const divR = getRect(resM, resA);
        resX = divR.x;
        resY = divR.y;
        break;
      default:
        resX = 0; resY = 0; resM = 0; resA = 0;
    }

    return { 
      v1: { x: p1.x, y: p1.y, m: m1, a: a1 }, 
      v2: { x: p2.x, y: p2.y, m: m2, a: a2 }, 
      res: { x: resX, y: resY, m: resM, a: resA } 
    };
  };

  const results = calculate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const center = { x: w / 2, y: h / 2 };
    
    const maxVal = Math.max(results.v1.m, results.v2.m, results.res.m, 5);
    const scale = (w / 2.8) / maxVal;

    ctx.clearRect(0, 0, w, h);

    // Grid simple
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for(let i = 0; i < 10; i++) {
        const dist = (w / 10) * i;
        ctx.beginPath(); ctx.moveTo(dist, 0); ctx.lineTo(dist, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, dist); ctx.lineTo(w, dist); ctx.stroke();
    }

    // Ejes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, center.y); ctx.lineTo(w, center.y);
    ctx.moveTo(center.x, 0); ctx.lineTo(center.x, h);
    ctx.stroke();

    const drawVector = (x: number, y: number, color: string, label: string) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.moveTo(center.x, center.y);
      const targetX = center.x + x * scale;
      const targetY = center.y - y * scale;
      ctx.lineTo(targetX, targetY);
      ctx.stroke();

      const angle = Math.atan2(y, x);
      ctx.beginPath();
      ctx.moveTo(targetX, targetY);
      ctx.lineTo(targetX - 12 * Math.cos(angle - 0.4), targetY + 12 * Math.sin(angle - 0.4));
      ctx.lineTo(targetX - 12 * Math.cos(angle + 0.4), targetY + 12 * Math.sin(angle + 0.4));
      ctx.fillStyle = color;
      ctx.fill();

      ctx.font = 'bold 14px sans-serif';
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(255,255,255,0.8)';
      ctx.fillText(label, targetX + 8, targetY - 8);
      ctx.shadowBlur = 0;
    };

    drawVector(results.v1.x, results.v1.y, '#2563eb', 'V₁');
    drawVector(results.v2.x, results.v2.y, '#059669', 'V₂');
    drawVector(results.res.x, results.res.y, '#dc2626', 'Resultado');

  }, [results]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Calculadora de Fasores Interactiva</h1>
          <p className="text-slate-600">Basado en: Operaciones Fasoriales Fundamentales</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Panel de Entradas */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6 text-slate-700">
                <Calculator size={20} className="text-blue-600" />
                <h2 className="font-bold text-lg">Parámetros</h2>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <label className="block text-sm font-bold text-blue-700 mb-3">Fasor V₁</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Magnitud</span>
                      <input type="number" value={m1} onChange={(e) => setM1(Number(e.target.value))} className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Ángulo (°)</span>
                      <input type="number" value={a1} onChange={(e) => setA1(Number(e.target.value))} className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center px-2">
                  {[
                    { id: 'add', icon: <Plus size={20}/>, label: 'Suma' },
                    { id: 'sub', icon: <Minus size={20}/>, label: 'Resta' },
                    { id: 'mult', icon: <X size={20}/>, label: 'Mult.' },
                    { id: 'div', icon: <Divide size={20}/>, label: 'Div.' }
                  ].map(op => (
                    <button
                      key={op.id}
                      onClick={() => setOperation(op.id)}
                      className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${operation === op.id ? 'bg-slate-800 text-white scale-110 shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                      title={op.label}
                    >
                      {op.icon}
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <label className="block text-sm font-bold text-emerald-700 mb-3">Fasor V₂</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Magnitud</span>
                      <input type="number" value={m2} onChange={(e) => setM2(Number(e.target.value))} className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Ángulo (°)</span>
                      <input type="number" value={a2} onChange={(e) => setA2(Number(e.target.value))} className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resultado de la Operación</span>
              <div className="text-3xl font-mono mt-2 text-red-400">
                {results.res.m.toFixed(2)} <span className="text-slate-500 text-xl">∠</span> {results.res.a.toFixed(1)}°
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-sm">
                <span className="text-slate-400">Rectangular:</span>
                <span className="font-mono">{results.res.x.toFixed(2)} {results.res.y >= 0 ? '+' : '-'} j{Math.abs(results.res.y).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Panel de Visualización y Pasos */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-700">Representación en el Plano</h3>
                    <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-blue-600">V₁: {m1}∠{a1}°</span>
                        <span className="text-emerald-600">V₂: {m2}∠{a2}°</span>
                    </div>
                </div>
                <div className="relative flex justify-center">
                    <canvas ref={canvasRef} width={600} height={400} className="max-w-full h-auto bg-slate-50 rounded-xl" />
                    <div className="absolute bottom-4 left-4 text-[10px] text-slate-400 bg-white/80 p-2 rounded border">
                        Ejes: Re (Horizontal), Im (Vertical)
                    </div>
                </div>
            </div>

            {/* Procedimiento Detallado */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <Info size={20} className="text-amber-500" />
                <h3 className="font-bold text-lg">Procedimiento Matemático</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-500 border-b pb-1 uppercase tracking-tighter">Paso 1: Conversión</h4>
                    <p className="text-sm text-slate-600">Para operar, identificamos las formas necesarias:</p>
                    <div className="space-y-2 font-mono text-xs">
                        <div className="p-2 bg-slate-50 rounded">V₁ = {results.v1.x.toFixed(2)} + j({results.v1.y.toFixed(2)})</div>
                        <div className="p-2 bg-slate-50 rounded">V₂ = {results.v2.x.toFixed(2)} + j({results.v2.y.toFixed(2)})</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-500 border-b pb-1 uppercase tracking-tighter">Paso 2: Operación</h4>
                    {(operation === 'add' || operation === 'sub') ? (
                        <div className="text-sm text-slate-600 space-y-2">
                            <p>Se opera parte real e imaginaria por separado:</p>
                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                Re: {results.v1.x.toFixed(2)} {operation === 'add' ? '+' : '-'} {results.v2.x.toFixed(2)} = <strong>{results.res.x.toFixed(2)}</strong><br/>
                                Im: {results.v1.y.toFixed(2)} {operation === 'add' ? '+' : '-'} {results.v2.y.toFixed(2)} = <strong>{results.res.y.toFixed(2)}</strong>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-slate-600 space-y-2">
                            <p>Operación en forma polar:</p>
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                                Mag: {m1} {operation === 'mult' ? '×' : '÷'} {m2} = <strong>{results.res.m.toFixed(2)}</strong><br/>
                                Áng: {a1}° {operation === 'mult' ? '+' : '-'} ({a2}°) = <strong>{results.res.a.toFixed(1)}°</strong>
                            </div>
                        </div>
                    )}
                </div>
              </div>

              {/* Rotación rápida (Operador j) */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h4 className="font-bold text-purple-700 flex items-center gap-2">
                            <RotateCw size={16} /> Aplicar Operador j
                        </h4>
                        <p className="text-xs text-slate-500">Multiplicar por j rota el fasor 90° en sentido antihorario.</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setA1(prev => prev + 90)} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors">
                            V₁ × j (+90°)
                        </button>
                        <button onClick={() => setA1(prev => prev - 90)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300 transition-colors">
                            V₁ × -j (-90°)
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><ChevronRight size={14} /> Suma/Resta → Rectangular</span>
                <span className="flex items-center gap-1"><ChevronRight size={14} /> Mult/Div → Polar</span>
            </div>
            <div className="italic">Fuente: Educarchile (2018), Rauf (2021)</div>
        </footer>
      </div>
    </div>
  );
};

export default App;