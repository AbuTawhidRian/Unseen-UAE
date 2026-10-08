'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useMapStore } from '@/store/useMapStore';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { Download, Upload, Palette } from 'lucide-react';
import { EMIRATES_DATA } from './RegionSelectorPanel';
import { motion } from 'framer-motion';

const THEMES = [
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ef4444', // Red
  '#14b8a6', // Teal
  '#0f172a', // Slate
];

const TOTAL_REGIONS = EMIRATES_DATA.reduce((acc, emirate) => acc + emirate.regions.length, 0);

// Geographic bounds calibration
const REGION_COORDS: Record<string, { x: number, y: number, name: string }> = {
  'ad-city': { x: 35, y: 40, name: 'Abu Dhabi City' },
  'al-ain': { x: 75, y: 60, name: 'Al Ain' },
  'al-dhafra': { x: 30, y: 75, name: 'Al Dhafra' },
  'dxb-city': { x: 60, y: 30, name: 'Dubai City' },
  'hatta': { x: 85, y: 45, name: 'Hatta' },
  'marmoom': { x: 65, y: 38, name: 'Al Marmoom' },
  'shj-city': { x: 63, y: 28, name: 'Sharjah City' },
  'khorfakkan': { x: 88, y: 28, name: 'Khorfakkan' },
  'kalba': { x: 88, y: 35, name: 'Kalba' },
  'dibba': { x: 85, y: 18, name: 'Dibba' },
  'dhaid': { x: 75, y: 30, name: 'Al Dhaid' },
  'rak-city': { x: 72, y: 15, name: 'RAK City' },
  'jebel-jais': { x: 78, y: 10, name: 'Jebel Jais' },
  'fuj-city': { x: 88, y: 32, name: 'Fujairah City' },
  'dibba-fuj': { x: 86, y: 22, name: 'Dibba Al-Fujairah' },
  'wadi-wurayah': { x: 84, y: 25, name: 'Wadi Wurayah' },
  'ajman-city': { x: 65, y: 26, name: 'Ajman City' },
  'masfout': { x: 82, y: 42, name: 'Masfout' },
  'uaq-city': { x: 68, y: 24, name: 'UAQ City' },
  'al-sinniyah': { x: 70, y: 22, name: 'Al Sinniyah Island' }
};

// Exact topological paths for the 7 Emirates
const EMIRATE_PATHS = [
  { id: 'abu-dhabi', path: "M93.209,473.488L88.309,473.201L90.409,480.233L94.709,478.797ZM476.448,476.43L482.548,472.914L495.45,469.47L497.55,463.586L494.749,458.779L488.349,456.77L480.948,457.057L474.847,459.281L473.647,463.945L471.047,464.591L470.447,459.281L464.846,455.981L458.046,454.761L451.245,455.407L439.244,460.286L430.043,461.075L427.543,463.443L433.443,467.891L440.744,470.69L447.245,475.497L452.645,476.43L457.146,474.923L463.546,479.228L471.547,482.6ZM546.255,480.233L544.454,474.923L542.454,478.654L528.353,484.179L525.953,489.56L528.853,493.865L533.353,495.587L543.954,485.399ZM556.456,486.547L552.255,486.188L542.954,493.148L543.254,497.74L547.255,501.184L553.255,501.973L557.056,495.516L561.656,490.636ZM215.822,483.461L212.421,480.376L209.721,483.031L205.021,491.497L205.421,495.659L211.421,502.619L216.422,505.274L221.222,503.91L223.522,500.538L224.222,492.071ZM574.557,503.336L572.557,494.439L569.057,492.932L562.856,503.408L569.557,501.471L565.557,507.642L568.257,507.929ZM386.039,496.018L373.937,490.349L366.037,487.695L364.236,482.313L361.336,485.614L354.535,487.623L352.435,484.609L341.634,486.044L335.934,485.04L337.534,490.636L345.335,489.13L365.637,497.596L369.437,494.224L373.337,494.009L372.337,500.61L380.038,511.086L383.738,513.453L385.139,509.148L390.039,506.637L388.739,498.601ZM602.66,516.036L594.359,516.108L574.457,521.848L574.457,525.149L587.159,536.27L585.759,531.893L587.359,528.162L598.66,521.92ZM157.116,527.588L154.715,526.512L148.215,530.961L148.115,533.687L153.715,539.786L158.516,536.844L159.916,531.893ZM34.403,552.271L35.304,550.405L33.403,545.096L31.703,551.195ZM314.431,609.313L313.631,605.008L310.231,609.098L309.731,613.331L313.731,612.829ZM552.955,686.087L554.655,678.84L549.455,679.988L546.055,683.647L548.755,687.235ZM878.888,571.715L882.588,561.383L876.788,556.432L875.488,549.473L870.487,543.804L873.287,530.602L873.587,516.18L881.088,508.574L880.388,498.529L870.887,482.385L869.587,475.569L888.689,471.694L900.29,475.999L906.491,473.56L912.191,457.272L919.892,444.644L917.592,441.272L904.49,438.33L880.288,429.289L876.388,429.72L870.987,433.594L863.886,431.729L847.085,432.877L835.384,429.791L825.283,424.697L816.482,421.612L807.581,420.033L808.581,413.289L819.482,406.257L822.882,401.665L824.482,379.996L823.582,377.198L811.981,360.48L805.181,334.721L790.579,317.501L788.279,310.612L783.978,289.876L779.378,277.105L759.576,245.175L753.075,225.157L752.375,218.986L753.675,188.707L751.375,158.428L737.674,141.71L734.473,141.279L210.621,205.712L201.32,210.591L5.001,443.998L0.8,454.259L1.3,472.914L0,480.95L4.4,486.834L4.6,495.946L1,503.408L5.001,507.713L11.201,498.242L12.101,482.098L13.501,474.851L16.402,473.129L19.502,476.071L21.502,485.47L26.303,474.349L30.903,474.062L35.504,485.399L39.304,488.053L43.604,482.098L44.204,477.649L42.004,464.304L44.904,449.308L44.904,439.98L49.905,427.854L64.906,426.419L74.607,420.392L75.208,425.199L94.409,425.199L103.41,420.177L113.911,421.683L121.712,420.751L124.912,422.186L136.114,422.257L147.415,427.998L160.316,429.289L168.017,435.603L174.417,437.182L181.718,440.769L184.318,445.29L190.519,447.801L196.42,452.608L208.821,459.281L210.121,469.183L214.121,471.192L221.122,467.174L228.623,457.774L239.024,459.138L252.025,456.411L263.826,459.353L268.527,457.774L286.229,456.411L295.63,459.353L297.13,462.151L311.131,453.039L319.432,456.339L327.533,452.895L326.733,462.151L331.533,463.156L341.934,457.129L349.935,448.231L361.336,447.657L387.939,452.608L396.54,447.227L405.041,447.801L413.841,442.778L417.942,437.756L427.843,439.55L433.643,437.827L443.144,442.42L449.245,440.769L474.547,440.626L482.048,442.994L494.749,449.308L507.851,451.245L521.852,456.339L530.353,457.774L536.854,462.079L543.754,469.972L557.456,473.631L571.957,483.964L584.358,480.591L593.659,488.412L597.56,493.363L605.761,508.359L605.261,516.036L608.661,517.615L605.761,520.557L617.162,517.615L611.561,526.297L624.162,520.557L623.562,526.01L619.662,527.732L608.561,529.095L591.559,538.853L605.761,546.028L607.461,540.36L611.461,534.764L616.462,531.248L621.462,531.965L617.162,534.907L625.763,533.328L629.363,537.562L637.164,551.912L632.863,556.719L638.564,558.728L640.364,564.469L644.164,566.047L637.964,579.967L640.464,585.133L648.565,590.156L651.765,594.748L658.566,591.806L664.566,594.245L662.766,600.201L685.369,612.327L705.971,626.82L711.171,628.399L715.672,627.036L741.274,560.092L745.875,552.988L754.275,551.338L798.28,552.917L810.381,556.145L824.382,563.608L847.185,572.146L851.985,575.016L868.187,571.213Z" },
  { id: 'dubai', path: "M741.074,659.611L745.575,656.238L744.574,655.521L740.474,659.252ZM955.996,598.909L952.495,591.16L948.095,586.137L944.894,580.469L936.194,579.393L936.094,583.913L942.394,598.12L955.896,598.909ZM711.171,628.399L704.97,631.413L703.87,635.861L706.371,640.094L704.67,632.632L711.871,628.829L714.271,629.619L710.671,635.431L707.871,637.081L713.171,638.875L711.071,636.65L714.871,629.906L717.872,635.646L716.772,630.767L722.972,634.067L721.872,638.301L729.673,638.946L745.275,655.521L766.477,680.203L767.277,686.374L771.277,689.603L774.577,689.172L778.778,682.284L775.178,675.683L780.878,677.333L782.078,680.921L775.778,694.267L780.078,699.218L791.079,696.204L797.08,696.634L805.881,699.146L811.081,693.764L817.782,690.249L822.582,686.159L837.384,677.046L843.184,669.656L849.285,646.839L848.985,644.184L841.384,635.359L846.585,623.735L849.885,613.69L850.585,602.712L854.085,587.501L853.985,581.258L851.985,575.016L847.185,572.146L824.382,563.608L810.381,556.145L798.28,552.917L754.275,551.338L745.875,552.988L741.274,560.092L715.672,627.036Z" },
  { id: 'sharjah', path: "M979.098,688.527L974.997,687.235L974.297,692.76L977.198,693.908L980.198,691.971ZM977.598,617.565L974.197,617.78L972.897,613.546L962.796,614.766L957.996,619.358L959.696,626.892L955.996,636.866L951.995,642.821L954.495,646.48L958.296,645.117L973.097,630.695L976.498,622.802L976.798,620.865ZM978.998,625.385L980.698,631.126L983.098,633.709L983.898,639.736L982.598,641.673L979.698,651.718L983.398,652.149L995.6,649.637L995.5,647.413L1000,630.982L988.699,629.834L986.699,627.681L985.999,620.937L981.998,622.013ZM996.2,723.326L996.9,717.801L995.2,711.774L999.9,702.231L994.399,698.357L992.899,696.491L984.698,698.07L980.698,703.451L974.497,704.168L976.998,710.052L986.799,715.936ZM905.491,707.684L908.791,703.092L911.591,708.617L913.291,715.362L916.092,716.366L920.592,714.572L916.892,704.384L913.491,701.729L912.991,699.074L915.692,694.051L917.992,687.809L917.492,682.284L912.291,677.262L910.591,672.311L915.992,665.638L910.191,652.938L909.991,644.543L914.291,636.076L915.392,629.691L906.991,630.839L898.89,628.973L891.689,624.74L884.888,619.071L878.688,611.753L876.488,605.367L878.188,589.438L877.288,577.814L878.888,571.715L868.187,571.213L851.985,575.016L853.985,581.258L854.085,587.501L850.585,602.712L849.885,613.69L846.585,623.735L841.384,635.359L848.985,644.184L849.285,646.839L843.184,669.656L837.384,677.046L822.582,686.159L817.782,690.249L811.081,693.764L805.881,699.146L797.08,696.634L791.079,696.204L780.078,699.218L783.078,702.231L788.079,702.805L787.279,707.828L790.879,711.272L793.079,709.621L800.78,717.371L805.681,714.501L819.182,710.985L836.784,710.124L839.284,711.272L843.984,721.317L840.884,723.039L828.383,725.12L814.881,731.003L817.782,734.089L815.282,735.308L819.682,742.053L833.883,734.16L842.584,727.846L857.286,722.393L870.887,712.061L875.088,706.895L876.488,701.514L880.188,694.841L883.488,693.19L891.989,693.693L900.49,696.778L902.49,700.366L900.69,706.536Z" },
  { id: 'rak', path: "M867.587,772.978L872.687,778.216L877.188,779.148L881.488,782.162L887.589,783.741L894.989,789.122L906.291,802.181L911.991,806.557L907.291,796.799L910.491,795.867L914.591,810.576L923.392,817.966L926.693,822.558L928.893,829.374L921.992,823.778L927.393,832.029L931.793,840.783L936.394,855.851L941.294,856.209L951.795,858.721L954.195,858.505L958.496,846.236L956.696,836.191L955.796,817.607L950.395,809.499L950.295,802.898L955.096,797.015L954.595,791.633L949.695,787.687L950.495,774.772L951.995,772.189L949.195,770.395L940.494,768.242L934.693,768.745L929.993,766.018L924.992,761.067L920.892,759.417L915.792,759.417L913.291,755.255L916.792,738.394L922.792,736.241L933.593,736.672L938.794,739.327L942.094,739.398L946.995,732.151L945.195,728.492L939.394,722.178L940.994,719.308L945.895,718.949L948.395,717.012L948.095,711.2L942.094,707.612L936.394,706.68L926.293,709.478L920.592,714.572L916.092,716.366L913.291,715.362L911.591,708.617L908.791,703.092L905.491,707.684L895.49,717.227L897.19,722.178L895.89,726.124L888.089,733.802L885.889,739.111L884.888,748.726L879.288,765.587L872.887,768.673ZM977.498,608.811L970.497,602.712L966.797,601.062L955.996,598.909L955.896,598.909L942.394,598.12L930.993,607.663L925.593,611.107L923.892,620.219L921.492,626.318L915.392,629.691L914.291,636.076L909.991,644.543L910.191,652.938L915.992,665.638L910.591,672.311L912.291,677.262L917.492,682.284L930.993,680.921L934.793,681.925L942.994,680.706L949.395,684.509L950.695,690.464L956.696,694.769L957.296,697.28L952.295,697.495L947.295,700.724L954.195,705.029L960.796,703.379L962.996,699.433L968.897,700.366L971.297,693.19L963.696,688.455L963.296,682.571L954.895,681.064L953.495,678.84L954.695,669.871L952.295,656.741L952.295,652.436L954.495,646.48L951.995,642.821L955.996,636.866L959.696,626.892L957.996,619.358L962.796,614.766L972.897,613.546L976.498,611.179Z" },
  { id: 'uaq', path: "M819.682,742.053L821.582,748.152L827.083,755.614L830.583,756.906L825.283,748.152L829.783,744.277L842.784,746.86L849.085,759.632L857.986,767.31L865.087,769.821L867.587,772.978L872.887,768.673L879.288,765.587L884.888,748.726L885.889,739.111L888.089,733.802L895.89,726.124L897.19,722.178L895.49,717.227L905.491,707.684L900.69,706.536L902.49,700.366L900.49,696.778L891.989,693.693L883.488,693.19L880.188,694.841L876.488,701.514L875.088,706.895L870.887,712.061L857.286,722.393L842.584,727.846L833.883,734.16Z" },
  { id: 'fujairah', path: "M985.699,617.206L984.398,613.69L977.498,608.811L976.498,611.179L972.897,613.546L974.197,617.78L977.598,617.565L984.098,616.417ZM954.495,646.48L952.295,652.436L952.295,656.741L954.695,669.871L953.495,678.84L954.895,681.064L963.296,682.571L969.297,679.342L972.797,680.634L981.298,686.518L991.899,690.823L992.899,696.491L994.399,698.357L999.9,702.231L998.3,687.953L996.4,678.912L995.6,649.637L983.398,652.149L979.698,651.718L982.598,641.673L983.898,639.736L983.098,633.709L980.698,631.126L978.998,625.385L976.498,622.802L973.097,630.695L958.296,645.117ZM974.497,704.168L968.897,700.366L962.996,699.433L960.796,703.379L954.195,705.029L947.295,700.724L952.295,697.495L957.296,697.28L956.696,694.769L950.695,690.464L949.395,684.509L942.994,680.706L934.793,681.925L930.993,680.921L917.492,682.284L917.992,687.809L915.692,694.051L920.892,698.07L921.892,700.15L916.892,704.384L920.592,714.572L926.293,709.478L936.394,706.68L942.094,707.612L948.095,711.2L948.395,717.012L945.895,718.949L940.994,719.308L939.394,722.178L945.195,728.492L946.995,732.151L942.094,739.398L938.794,739.327L933.593,736.672L922.792,736.241L916.792,738.394L913.291,755.255L915.792,759.417L920.892,759.417L924.992,761.067L929.993,766.018L934.693,768.745L940.494,768.242L949.195,770.395L951.995,772.189L959.596,769.534L963.096,763.794L966.397,762.933L978.298,765.803L982.698,763.435L990.999,760.995L992.599,758.628L997.2,744.636L996.2,723.326L986.799,715.936L976.998,710.052Z" },
  { id: 'ajman', path: "M800.78,717.371L803.78,721.245L807.181,718.519L809.381,722.68L810.781,721.245L814.881,731.003L828.383,725.12L840.884,723.039L843.984,721.317L839.284,711.272L836.784,710.124L819.182,710.985L805.681,714.501ZM916.892,704.384L921.892,700.15L920.892,698.07L915.692,694.051L912.991,699.074L913.491,701.729Z" }
];

export default function CardGeneratorPanel() {
  const { selectedRegions, themeColor, setThemeColor, userName, setUserName, userPhoto, setUserPhoto } = useMapStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        // 1080 is the fixed size of our export card
        setScale(entries[0].contentRect.width / 1080);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const percentage = Math.round((selectedRegions.length / TOTAL_REGIONS) * 100) || 0;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserPhoto(url);
    }
  };

  const handleDownload = async (format: 'png' | 'jpg') => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await (format === 'png' 
        ? htmlToImage.toPng(cardRef.current, { quality: 1.0, pixelRatio: 2 })
        : htmlToImage.toJpeg(cardRef.current, { quality: 1.0, pixelRatio: 2 }));
      
      saveAs(dataUrl, `my-unseen-uae.${format}`);
    } catch (err) {
      console.error('Error generating image:', err);
      alert('Failed to generate image.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Controls Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-6">
        
        {/* Theme Picker */}
        <div className="flex items-center gap-3 border-r pr-6 border-gray-100">
          <Palette className="w-5 h-5 text-gray-400" />
          <div className="flex gap-2">
            {THEMES.map(color => (
              <button
                key={color}
                onClick={() => setThemeColor(color)}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${themeColor === color ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
                title={`Select theme color ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Photo Upload */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl cursor-pointer transition-colors text-sm font-semibold text-gray-700">
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>

        {/* Name Input */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Enter your name..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* The Downloadable Card */}
      <div className="flex justify-center bg-gray-100/50 rounded-3xl p-4 md:p-8 border border-gray-200 border-dashed overflow-hidden">
        {/* Responsive Container for Scaling */}
        <div ref={containerRef} className="w-full max-w-[540px] aspect-square relative rounded-[2rem]">
          <div 
            ref={cardRef} 
            className="absolute top-0 left-0 bg-[#0f172a] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col justify-between origin-top-left"
            style={{ width: '1080px', height: '1080px', transform: `scale(${scale})` }} 
          >
            {/* Card Header */}
            <div className="p-12 flex justify-between items-start relative z-10 pointer-events-none">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-800 shrink-0">
                  {userPhoto ? (
                    <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-3xl font-bold">
                      {userName ? userName.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-gray-400 font-medium text-xl uppercase tracking-widest mb-1">Explorer Profile</p>
                  <h2 className="text-white font-black text-5xl tracking-tight">{userName || 'My UAE Journey'}</h2>
                </div>
              </div>
              
              <div className="flex items-baseline gap-2">
                <motion.span 
                  key={selectedRegions.length}
                  initial={{ scale: 1.5, color: '#ffffff' }}
                  animate={{ scale: 1, color: themeColor }}
                  className="text-7xl font-black"
                >
                  {selectedRegions.length}
                </motion.span>
                <span className="text-gray-500 font-bold text-3xl">/{TOTAL_REGIONS}</span>
              </div>
            </div>

            {/* Stylized Node & Choropleth Map Area */}
            <div className="flex-1 flex items-center justify-center relative p-12">
               {/* Background Geographic Choropleth Map */}
               <svg viewBox="0 0 1000 1000" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid meet">
                  {EMIRATE_PATHS.map((emirate) => {
                    // Find matching emirate data to calculate fill percentage
                    const emirateData = EMIRATES_DATA.find(e => e.id === emirate.id);
                    let fillRatio = 0;
                    if (emirateData) {
                       const selectedCount = emirateData.regions.filter(r => selectedRegions.includes(r.id)).length;
                       fillRatio = selectedCount / emirateData.regions.length;
                    }
                    
                    return (
                      <motion.path 
                        key={emirate.id}
                        d={emirate.path}
                        initial={false}
                        animate={{
                          fill: fillRatio > 0 ? themeColor : '#1e293b',
                          fillOpacity: fillRatio > 0 ? (0.2 + (fillRatio * 0.8)) : 0.3,
                          stroke: fillRatio > 0 ? themeColor : '#334155',
                          strokeWidth: fillRatio > 0 ? 2 : 1
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    );
                  })}
               </svg>

               {/* Map Nodes */}
               <div className="absolute inset-0 w-full h-full pointer-events-none">
                 <div className="relative w-full h-full">
                    {Object.entries(REGION_COORDS).map(([id, coord]) => {
                      const isSelected = selectedRegions.includes(id);
                      if (!isSelected) return null; // Only show nodes if they are selected!
                      return (
                        <motion.div
                          key={id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                        >
                          <div 
                            className="w-4 h-4 rounded-full border-2 shadow-lg"
                            style={{ backgroundColor: '#ffffff', borderColor: themeColor }}
                          />
                          <span className="absolute top-6 text-white text-sm font-bold whitespace-nowrap bg-black/80 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-xl border border-white/10">
                             {coord.name}
                          </span>
                        </motion.div>
                      )
                    })}
                 </div>
               </div>
            </div>

            {/* Card Footer */}
            <div className="p-12 border-t border-gray-800/50 flex justify-between items-end relative z-10 pointer-events-none">
              <div className="flex-1 pr-12">
                <div className="h-4 w-full max-w-md bg-gray-800 rounded-full mb-6 overflow-hidden relative">
                  <motion.div 
                    className="absolute top-0 left-0 h-full rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%`, backgroundColor: themeColor }}
                    transition={{ type: 'spring', damping: 20 }}
                  />
                </div>
                <h3 className="text-white font-black text-4xl mb-2">{percentage}% of the UAE Explored</h3>
                <p className="text-gray-400 text-2xl">Keep exploring with <span className="text-white font-bold">{userName || 'me'}</span></p>
              </div>

              <div className="flex items-center gap-5 bg-black/40 px-8 py-5 rounded-3xl backdrop-blur-xl border border-white/5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-black font-black text-3xl">U</span>
                </div>
                <div>
                  <p className="text-white font-black text-2xl leading-tight">Unseen UAE</p>
                  <p className="text-gray-400 text-lg font-medium">unseenuae.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDownload('png')}
          className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
        >
          <Download className="w-5 h-5" />
          Download PNG
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDownload('jpg')}
          className="flex items-center gap-2 px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download className="w-5 h-5" />
          Download JPG
        </motion.button>
      </div>

    </motion.div>
  );
}
