import React, { useState } from 'react';
import {
  Radio,
  Maximize2,
  Minimize2,
  Battery,
  HardDrive
} from 'lucide-react';

interface DeviceFrameProps {
  channel: 'Tótem Fijo IK10/IP65' | 'Tablet ATEX IP68' | 'Consola Web / PC' | 'Consola Gerencial';
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ channel, children }) => {
  const [hardwareSkinsEnabled, setHardwareSkinsEnabled] = useState<boolean>(true);

  if (!hardwareSkinsEnabled) {
    return (
      <div className="w-full bg-[#0A2342] rounded-2xl border border-[#14508F]/70 p-6 relative">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#14508F]/50 text-xs text-[#C9D1D9]">
          <span className="font-semibold text-white">Modo Pantalla Completa ({channel})</span>
          <button
            type="button"
            onClick={() => setHardwareSkinsEnabled(true)}
            className="text-[#FF8A00] hover:text-[#ff9c24] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Ver con Chasis de Hardware Industrial</span>
          </button>
        </div>
        {children}
      </div>
    );
  }

  // 1. Tótem Industrial IK10/IP65 Kiosk Shell (Gris Grafito #2B3036 + Azul Marino #0A2342 + Naranja #FF8A00 per Manual p. 11-12)
  if (channel === 'Tótem Fijo IK10/IP65') {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="p-3 sm:p-5 rounded-3xl bg-[#2B3036] border-4 border-[#1F2429] shadow-2xl relative">
          {/* Top Metal Bezel */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#3D434B] text-[11px] font-mono text-[#C9D1D9]">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-[#FF8A00] text-[#0A2342] font-bold">
                IK10 IMPACT RESISTANT · IP65
              </span>
              <span className="hidden sm:inline text-[#C9D1D9]">KIOSCO FIJO #04 · VESTIERES PLANTA</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[#2ECC71]">
                <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" />
                <span className="text-[10px]">RED INDUSTRIAL LAN 1Gbps</span>
              </div>
              <button
                type="button"
                onClick={() => setHardwareSkinsEnabled(false)}
                className="text-[#C9D1D9] hover:text-white transition-colors cursor-pointer"
                title="Alternar vista simple"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Touchscreen Glass Surface */}
          <div className="mt-3 p-4 sm:p-6 rounded-2xl bg-[#061529] border border-[#14508F]/70 overflow-hidden shadow-inner">
            {children}
          </div>

          {/* Bottom Physical Bar: RFID Antenna Target */}
          <div className="mt-4 px-4 py-3 rounded-2xl bg-[#0A2342] border border-[#14508F]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1F6FB5]/25 border border-[#5FA8E8]/40 flex items-center justify-center text-[#5FA8E8]">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-[#5FA8E8] tracking-wider uppercase">
                  SENSOR FÍSICO RFID / NFC MIFARE ISO-14443
                </div>
                <div className="text-[#C9D1D9] text-[11px]">
                  Zona de lectura por aproximación de carné corporativo (&lt; 2s)
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-[#C9D1D9] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2ECC71]" />
              <span>GABINETE SELLADO NEMA 4X / SIN CELULARES EN PLANTA</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Tablet Ruguerizada ATEX / IP68 Shell (Borde Naranja Seguridad #FF8A00 + Grafito #2B3036 per Manual p. 12)
  if (channel === 'Tablet ATEX IP68') {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="p-3 sm:p-5 rounded-3xl bg-[#2B3036] border-4 border-[#FF8A00] shadow-2xl relative">
          {/* Top Rugged Tablet Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#3D434B] text-[11px] font-mono">
            <div className="flex items-center gap-2.5">
              <div className="px-2 py-0.5 rounded bg-[#FF8A00] text-[#0A2342] font-black text-xs">
                Ex II 2 G Ex ib IIC T4 Gb
              </div>
              <span className="text-white font-bold text-xs">TABLET ATEX IP68 CERTIFICADA ANTIEXPLOSIÓN</span>
            </div>

            <div className="flex items-center gap-3 text-[#C9D1D9]">
              <span className="flex items-center gap-1 text-[#2ECC71]">
                <HardDrive className="w-3.5 h-3.5" />
                SQLiteOfflineCache.db
              </span>
              <span className="flex items-center gap-1 text-[#5FA8E8]">
                <Battery className="w-4 h-4" />
                94%
              </span>
              <button
                type="button"
                onClick={() => setHardwareSkinsEnabled(false)}
                className="text-[#C9D1D9] hover:text-white cursor-pointer"
                title="Alternar vista simple"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Screen Content */}
          <div className="mt-3 p-4 sm:p-6 rounded-2xl bg-[#061529] border border-[#14508F]/70 overflow-hidden shadow-inner">
            {children}
          </div>

          {/* Bottom Tablet Grip Detail */}
          <div className="mt-3 flex items-center justify-between px-4 py-1.5 text-[10px] font-mono text-[#C9D1D9]">
            <span>RESISTENCIA A CAÍDAS MIL-STD-810H (1.8m sobre concreto)</span>
            <span>BOTÓN PTT / CÁMARA INDUSTRIAL MACRO</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Web Workstation / Consola Gerencial (Azul Marino #0A2342 + Azul Profundo #14508F)
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="rounded-2xl bg-[#0A2342] border border-[#14508F]/80 shadow-2xl overflow-hidden">
        {/* Browser Top Window Frame */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#061529] border-b border-[#14508F]/60 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#E63946]/80" />
              <div className="w-3 h-3 rounded-full bg-[#FF8A00]/80" />
              <div className="w-3 h-3 rounded-full bg-[#2ECC71]/80" />
            </div>
            <div className="ml-3 px-3 py-1 rounded-md bg-[#0A2342] border border-[#14508F]/60 text-[11px] font-mono text-[#C9D1D9] flex items-center gap-1.5">
              <span className="text-[#2ECC71]">https://</span>
              <span>app.sstactive.co/console/{channel === 'Consola Gerencial' ? 'gerencia' : 'auditoria'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#C9D1D9] text-xs">
            <span className="font-mono text-[11px] text-[#5FA8E8]">TLS 1.3 / AWS S3 REDUNDANT</span>
            <button
              type="button"
              onClick={() => setHardwareSkinsEnabled(false)}
              className="text-[#C9D1D9] hover:text-white cursor-pointer"
              title="Alternar vista simple"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-[#061529]">
          {children}
        </div>
      </div>
    </div>
  );
};
