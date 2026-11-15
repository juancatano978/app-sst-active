import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

/**
 * Logotipo oficial SST-Active conforme al Manual de Identidad Corporativa v1.0:
 * - Usa el archivo maestro /assets/aistudio/sst-active-logo_678efcf8.svg sobre fondo blanco
 *   respetando la zona de seguridad (X = 1/4 altura del escudo), sin sombras ni deformaciones.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = ''
}) => {
  const heightClass =
    size === 'sm'
      ? 'h-8'
      : size === 'lg'
      ? 'h-14'
      : 'h-10';

  const padClass =
    size === 'sm'
      ? 'px-2.5 py-1 rounded-lg'
      : size === 'lg'
      ? 'px-4 py-2 rounded-2xl'
      : 'px-3 py-1.5 rounded-xl';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className={`bg-white border border-[#C9D1D9]/40 flex items-center justify-center shrink-0 ${padClass}`}>
        <img
          src={`${import.meta.env.BASE_URL}assets/aistudio/sst-active-logo_678efcf8.svg`}
          alt="SST-Active — Prevención Digital e Inteligencia Laboral Industrial"
          className={`${heightClass} w-auto object-contain block`}
        />
      </div>
      {showTagline && (
        <div className="hidden md:block leading-tight">
          <div className="text-[11px] font-display font-bold tracking-wider uppercase text-[#5FA8E8]">
            Prevención Digital e Inteligencia Laboral Industrial
          </div>
        </div>
      )}
    </div>
  );
};
