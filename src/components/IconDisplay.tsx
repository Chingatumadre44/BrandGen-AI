import type { BrandIcon } from '../types';

interface IconSetProps {
  icons: BrandIcon[];
  color?: string;
  size?: number;
}

export function IconSet({ icons, color = '#6366f1', size = 32 }: IconSetProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
      {icons.map((icon, index) => (
        <div
          key={index}
          className="group flex flex-col items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <div
            className="p-3 rounded-xl bg-slate-50 group-hover:bg-violet-50 transition-colors flex items-center justify-center"
            style={{ width: size + 16, height: size + 16 }}
          >
            {icon.svg.startsWith('data:') ? (
              <img 
                src={icon.svg} 
                alt={icon.name}
                className="w-full h-full object-contain"
                style={{ maxWidth: size, maxHeight: size }}
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{ 
                  __html: icon.svg.replace(/currentColor/g, color).replace(/stroke-width="2"/g, `stroke-width="1.5"`) 
                }}
              />
            )}
          </div>
          <p className="mt-3 text-xs text-slate-600 font-medium text-center">{icon.name}</p>
        </div>
      ))}
    </div>
  );
}

interface IconGridProps {
  icons: BrandIcon[];
  color?: string;
}

export function IconGrid({ icons, color = '#6366f1' }: IconGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {icons.map((icon, index) => (
        <div
          key={index}
          className="flex flex-col items-center p-3 bg-slate-50 rounded-xl hover:bg-violet-50 transition-colors cursor-pointer"
        >
          {icon.svg.startsWith('data:') ? (
            <img 
              src={icon.svg} 
              alt={icon.name}
              className="w-8 h-8 object-contain"
            />
          ) : (
            <div
              className="p-2"
              dangerouslySetInnerHTML={{ 
                __html: icon.svg.replace(/currentColor/g, color).replace(/stroke-width="2"/g, `stroke-width="1.5"`) 
              }}
              style={{ color }}
            />
          )}
          <p className="mt-2 text-xs text-slate-500 text-center truncate w-full">{icon.name}</p>
        </div>
      ))}
    </div>
  );
}

interface SingleIconProps {
  icon: BrandIcon;
  color?: string;
  size?: number;
  showName?: boolean;
}

export function SingleIcon({ icon, color = '#6366f1', size = 48, showName = true }: SingleIconProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="p-4 bg-white rounded-2xl shadow-md flex items-center justify-center"
        style={{ width: size + 32, height: size + 32 }}
      >
        {icon.svg.startsWith('data:') ? (
          <img 
            src={icon.svg} 
            alt={icon.name}
            className="object-contain"
            style={{ maxWidth: size, maxHeight: size }}
          />
        ) : (
          <div
            dangerouslySetInnerHTML={{ 
              __html: icon.svg.replace(/currentColor/g, color).replace(/stroke-width="2"/g, `stroke-width="1.5"`) 
            }}
          />
        )}
      </div>
      {showName && (
        <p className="mt-3 text-sm text-slate-600 font-medium">{icon.name}</p>
      )}
    </div>
  );
}

interface IconShowcaseProps {
  icons: BrandIcon[];
  title?: string;
}

export function IconShowcase({ icons, title }: IconShowcaseProps) {
  if (!icons || icons.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{title || 'Iconos'}</h3>
        <p className="text-slate-500 text-center py-8">No hay iconos disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
      {title && <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {icons.map((icon, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 bg-slate-50 rounded-xl hover:bg-violet-50 hover:shadow-md transition-all cursor-pointer group"
          >
            <div
              className="group-hover:scale-110 transition-transform"
              dangerouslySetInnerHTML={{ 
                __html: icon.svg.replace(/currentColor/g, '#6366f1').replace(/stroke-width="2"/g, `stroke-width="1.5"`) 
              }}
            />
            <p className="mt-3 text-xs text-slate-600 text-center">{icon.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
