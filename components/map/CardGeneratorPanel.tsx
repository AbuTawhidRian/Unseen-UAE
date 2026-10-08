'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useMapStore } from '@/store/useMapStore';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { Download, Upload, Palette, Share2, X, Copy, Check } from 'lucide-react';
import { EMIRATES_DATA } from './RegionSelectorPanel';
import { TOURIST_SPOTS, TOTAL_TOURIST_SPOTS } from '@/data/touristSpots';
import { motion } from 'framer-motion';

// UAE Flag colors as themes
const THEMES = [
  '#009639', // UAE Green
  '#EF3340', // UAE Red
  '#000000', // UAE Black
  '#1d4ed8', // Royal Blue
  '#7c3aed', // Violet
  '#0891b2', // Cyan
  '#d97706', // Amber
];

// Label positions in absolute SVG units (viewBox 0 0 1000 1000)
// Dot = position of the red marker; lx/ly = label text anchor offset
const EMIRATE_LABELS: Record<string, {
  x: number; y: number;        // red dot position
  lx: number; ly: number;      // label text centre
  anchor: 'inherit' | 'start' | 'middle' | 'end'; // text-anchor
  name: string;
  fontSize: number;
}> = {
  'abu-dhabi': { x: 350, y: 620, lx: 350, ly: 660, anchor: 'middle', name: 'Abu Dhabi', fontSize: 38 },
  'dubai':     { x: 795, y: 408, lx: 795, ly: 445, anchor: 'middle', name: 'Dubai',     fontSize: 28 },
  'sharjah':   { x: 870, y: 348, lx: 870, ly: 380, anchor: 'middle', name: 'Sharjah',   fontSize: 22 },
  'rak':       { x: 940, y: 225, lx: 870, ly: 195, anchor: 'middle', name: 'RAK',       fontSize: 20 },
  'fujairah':  { x: 982, y: 355, lx: 982, ly: 390, anchor: 'middle', name: 'Fujairah',  fontSize: 18 },
  'ajman':     { x: 823, y: 278, lx: 750, ly: 250, anchor: 'middle', name: 'Ajman',     fontSize: 18 },
  'uaq':       { x: 855, y: 258, lx: 790, ly: 222, anchor: 'middle', name: 'UAQ',       fontSize: 18 },
};

export interface RegionMarker {
  id: string;
  name: string;
  emirateId: string;
  x: number;
  y: number;
  lx: number;
  ly: number;
  anchor: 'inherit' | 'start' | 'middle' | 'end';
  fontSize: number;
}

// All 20 regions across the 7 emirates
export const REGION_MARKERS: RegionMarker[] = [
  // Abu Dhabi (3 regions)
  { id: 'al-dhafra',  name: 'Al Dhafra (Liwa)', emirateId: 'abu-dhabi', x: 340, y: 685, lx: 340, ly: 710, anchor: 'middle', fontSize: 18 },
  { id: 'ad-city',    name: 'Abu Dhabi City',   emirateId: 'abu-dhabi', x: 600, y: 450, lx: 600, ly: 428, anchor: 'middle', fontSize: 15 },
  { id: 'al-ain',     name: 'Al Ain',           emirateId: 'abu-dhabi', x: 800, y: 615, lx: 800, ly: 638, anchor: 'middle', fontSize: 15 },

  // Dubai (3 regions)
  { id: 'dxb-city',   name: 'Dubai City',       emirateId: 'dubai',     x: 760, y: 345, lx: 742, ly: 345, anchor: 'end',    fontSize: 14 },
  { id: 'marmoom',    name: 'Al Marmoom',       emirateId: 'dubai',     x: 795, y: 415, lx: 795, ly: 435, anchor: 'middle', fontSize: 13 },
  { id: 'hatta',      name: 'Hatta',            emirateId: 'dubai',     x: 948, y: 412, lx: 948, ly: 430, anchor: 'middle', fontSize: 13 },

  // Sharjah (5 regions)
  { id: 'shj-city',   name: 'Sharjah City',     emirateId: 'sharjah',   x: 825, y: 312, lx: 810, ly: 312, anchor: 'end',    fontSize: 13 },
  { id: 'dhaid',      name: 'Al Dhaid',         emirateId: 'sharjah',   x: 885, y: 338, lx: 885, ly: 355, anchor: 'middle', fontSize: 13 },
  { id: 'khorfakkan', name: 'Khorfakkan',       emirateId: 'sharjah',   x: 982, y: 310, lx: 994, ly: 310, anchor: 'start',  fontSize: 12 },
  { id: 'kalba',      name: 'Kalba',            emirateId: 'sharjah',   x: 986, y: 370, lx: 998, ly: 370, anchor: 'start',  fontSize: 12 },
  { id: 'dibba',      name: 'Dibba Al-Hisn',    emirateId: 'sharjah',   x: 982, y: 268, lx: 994, ly: 268, anchor: 'start',  fontSize: 11 },

  // Ras Al Khaimah (2 regions)
  { id: 'rak-city',   name: 'RAK City',         emirateId: 'rak',       x: 895, y: 215, lx: 880, ly: 215, anchor: 'end',    fontSize: 13 },
  { id: 'jebel-jais', name: 'Jebel Jais',       emirateId: 'rak',       x: 940, y: 155, lx: 940, ly: 140, anchor: 'middle', fontSize: 13 },

  // Fujairah (3 regions)
  { id: 'dibba-fuj',    name: 'Dibba Al-Fujairah', emirateId: 'fujairah', x: 965, y: 235, lx: 950, ly: 235, anchor: 'end',    fontSize: 11 },
  { id: 'wadi-wurayah', name: 'Wadi Wurayah',      emirateId: 'fujairah', x: 956, y: 332, lx: 942, ly: 332, anchor: 'end',    fontSize: 12 },
  { id: 'fuj-city',     name: 'Fujairah City',     emirateId: 'fujairah', x: 980, y: 395, lx: 992, ly: 395, anchor: 'start',  fontSize: 12 },

  // Ajman (2 regions)
  { id: 'ajman-city', name: 'Ajman City',       emirateId: 'ajman',     x: 818, y: 280, lx: 802, ly: 280, anchor: 'end',    fontSize: 13 },
  { id: 'masfout',    name: 'Masfout',          emirateId: 'ajman',     x: 918, y: 442, lx: 905, ly: 442, anchor: 'end',    fontSize: 12 },

  // Umm Al Quwain (2 regions)
  { id: 'uaq-city',    name: 'UAQ City',          emirateId: 'uaq',     x: 848, y: 252, lx: 832, ly: 252, anchor: 'end',    fontSize: 13 },
  { id: 'al-sinniyah', name: 'Al Sinniyah Island', emirateId: 'uaq',    x: 868, y: 232, lx: 868, ly: 216, anchor: 'middle', fontSize: 11 },
];

const TOTAL_EMIRATES = EMIRATES_DATA.length; // 7
const TOTAL_REGIONS = EMIRATES_DATA.reduce((acc, emirate) => acc + emirate.regions.length, 0);

// Exact topological paths for the 7 Emirates
const EMIRATE_PATHS = [
  { id: 'abu-dhabi', path: "M93.209,526.512L88.309,526.799L90.409,519.767L94.709,521.203ZM476.448,523.57L482.548,527.086L495.45,530.53L497.55,536.414L494.749,541.221L488.349,543.23L480.948,542.943L474.847,540.719L473.647,536.055L471.047,535.409L470.447,540.719L464.846,544.019L458.046,545.239L451.245,544.593L439.244,539.714L430.043,538.925L427.543,536.557L433.443,532.109L440.744,529.31L447.245,524.503L452.645,523.57L457.146,525.077L463.546,520.772L471.547,517.4ZM546.255,519.767L544.454,525.077L542.454,521.346L528.353,515.821L525.953,510.44L528.853,506.135L533.353,504.413L543.954,514.601ZM556.456,513.453L552.255,513.812L542.954,506.852L543.254,502.26L547.255,498.816L553.255,498.027L557.056,504.484L561.656,509.364ZM215.822,516.539L212.421,519.624L209.721,516.969L205.021,508.503L205.421,504.341L211.421,497.381L216.422,494.726L221.222,496.09L223.522,499.462L224.222,507.929ZM574.557,496.664L572.557,505.561L569.057,507.068L562.856,496.592L569.557,498.529L565.557,492.358L568.257,492.071ZM386.039,503.982L373.937,509.651L366.037,512.305L364.236,517.687L361.336,514.386L354.535,512.377L352.435,515.391L341.634,513.956L335.934,514.96L337.534,509.364L345.335,510.87L365.637,502.404L369.437,505.776L373.337,505.991L372.337,499.39L380.038,488.914L383.738,486.547L385.139,490.852L390.039,493.363L388.739,501.399ZM602.66,483.964L594.359,483.892L574.457,478.152L574.457,474.851L587.159,463.73L585.759,468.107L587.359,471.838L598.66,478.08ZM157.116,472.412L154.715,473.488L148.215,469.039L148.115,466.313L153.715,460.214L158.516,463.156L159.916,468.107ZM34.403,447.729L35.304,449.595L33.403,454.904L31.703,448.805ZM314.431,390.687L313.631,394.992L310.231,390.902L309.731,386.669L313.731,387.171ZM552.955,313.913L554.655,321.16L549.455,320.012L546.055,316.353L548.755,312.765ZM878.888,428.285L882.588,438.617L876.788,443.568L875.488,450.527L870.487,456.196L873.287,469.398L873.587,483.82L881.088,491.426L880.388,501.471L870.887,517.615L869.587,524.431L888.689,528.306L900.29,524.001L906.491,526.44L912.191,542.728L919.892,555.356L917.592,558.728L904.49,561.67L880.288,570.711L876.388,570.28L870.987,566.406L863.886,568.271L847.085,567.123L835.384,570.209L825.283,575.303L816.482,578.388L807.581,579.967L808.581,586.711L819.482,593.743L822.882,598.335L824.482,620.004L823.582,622.802L811.981,639.52L805.181,665.279L790.579,682.499L788.279,689.388L783.978,710.124L779.378,722.895L759.576,754.825L753.075,774.843L752.375,781.014L753.675,811.293L751.375,841.572L737.674,858.29L734.473,858.721L210.621,794.288L201.32,789.409L5.001,556.002L0.8,545.741L1.3,527.086L0,519.05L4.4,513.166L4.6,504.054L1,496.592L5.001,492.287L11.201,501.758L12.101,517.902L13.501,525.149L16.402,526.871L19.502,523.929L21.502,514.53L26.303,525.651L30.903,525.938L35.504,514.601L39.304,511.947L43.604,517.902L44.204,522.351L42.004,535.696L44.904,550.692L44.904,560.02L49.905,572.146L64.906,573.581L74.607,579.608L75.208,574.801L94.409,574.801L103.41,579.823L113.911,578.317L121.712,579.249L124.912,577.814L136.114,577.743L147.415,572.002L160.316,570.711L168.017,564.397L174.417,562.818L181.718,559.231L184.318,554.71L190.519,552.199L196.42,547.392L208.821,540.719L210.121,530.817L214.121,528.808L221.122,532.826L228.623,542.226L239.024,540.862L252.025,543.589L263.826,540.647L268.527,542.226L286.229,543.589L295.63,540.647L297.13,537.849L311.131,546.961L319.432,543.661L327.533,547.105L326.733,537.849L331.533,536.844L341.934,542.871L349.935,551.769L361.336,552.343L387.939,547.392L396.54,552.773L405.041,552.199L413.841,557.222L417.942,562.244L427.843,560.45L433.643,562.173L443.144,557.58L449.245,559.231L474.547,559.374L482.048,557.006L494.749,550.692L507.851,548.755L521.852,543.661L530.353,542.226L536.854,537.921L543.754,530.028L557.456,526.369L571.957,516.036L584.358,519.409L593.659,511.588L597.56,506.637L605.761,491.641L605.261,483.964L608.661,482.385L605.761,479.443L617.162,482.385L611.561,473.703L624.162,479.443L623.562,473.99L619.662,472.268L608.561,470.905L591.559,461.147L605.761,453.972L607.461,459.64L611.461,465.236L616.462,468.752L621.462,468.035L617.162,465.093L625.763,466.672L629.363,462.438L637.164,448.088L632.863,443.281L638.564,441.272L640.364,435.531L644.164,433.953L637.964,420.033L640.464,414.867L648.565,409.844L651.765,405.252L658.566,408.194L664.566,405.755L662.766,399.799L685.369,387.673L705.971,373.18L711.171,371.601L715.672,372.964L741.274,439.908L745.875,447.012L754.275,448.662L798.28,447.083L810.381,443.855L824.382,436.392L847.185,427.854L851.985,424.984L868.187,428.787Z" },
  { id: 'dubai', path: "M741.074,340.389L745.575,343.762L744.574,344.479L740.474,340.748ZM955.996,401.091L952.495,408.84L948.095,413.863L944.894,419.531L936.194,420.607L936.094,416.087L942.394,401.88L955.896,401.091ZM711.171,371.601L704.97,368.587L703.87,364.139L706.371,359.906L704.67,367.368L711.871,371.171L714.271,370.381L710.671,364.569L707.871,362.919L713.171,361.125L711.071,363.35L714.871,370.094L717.872,364.354L716.772,369.233L722.972,365.933L721.872,361.699L729.673,361.054L745.275,344.479L766.477,319.797L767.277,313.626L771.277,310.397L774.577,310.828L778.778,317.716L775.178,324.317L780.878,322.667L782.078,319.079L775.778,305.733L780.078,300.782L791.079,303.796L797.08,303.366L805.881,300.854L811.081,306.236L817.782,309.751L822.582,313.841L837.384,322.954L843.184,330.344L849.285,353.161L848.985,355.816L841.384,364.641L846.585,376.265L849.885,386.31L850.585,397.288L854.085,412.499L853.985,418.742L851.985,424.984L847.185,427.854L824.382,436.392L810.381,443.855L798.28,447.083L754.275,448.662L745.875,447.012L741.274,439.908L715.672,372.964Z" },
  { id: 'sharjah', path: "M979.098,311.473L974.997,312.765L974.297,307.24L977.198,306.092L980.198,308.029ZM977.598,382.435L974.197,382.22L972.897,386.454L962.796,385.234L957.996,380.642L959.696,373.108L955.996,363.134L951.995,357.179L954.495,353.52L958.296,354.883L973.097,369.305L976.498,377.198L976.798,379.135ZM978.998,374.615L980.698,368.874L983.098,366.291L983.898,360.264L982.598,358.327L979.698,348.282L983.398,347.851L995.6,350.363L995.5,352.587L1000,369.018L988.699,370.166L986.699,372.319L985.999,379.063L981.998,377.987ZM996.2,276.674L996.9,282.199L995.2,288.226L999.9,297.769L994.399,301.643L992.899,303.509L984.698,301.93L980.698,296.549L974.497,295.832L976.998,289.948L986.799,284.064ZM905.491,292.316L908.791,296.908L911.591,291.383L913.291,284.638L916.092,283.634L920.592,285.428L916.892,295.616L913.491,298.271L912.991,300.926L915.692,305.949L917.992,312.191L917.492,317.716L912.291,322.738L910.591,327.689L915.992,334.362L910.191,347.062L909.991,355.457L914.291,363.924L915.392,370.309L906.991,369.161L898.89,371.027L891.689,375.26L884.888,380.929L878.688,388.247L876.488,394.633L878.188,410.562L877.288,422.186L878.888,428.285L868.187,428.787L851.985,424.984L853.985,418.742L854.085,412.499L850.585,397.288L849.885,386.31L846.585,376.265L841.384,364.641L848.985,355.816L849.285,353.161L843.184,330.344L837.384,322.954L822.582,313.841L817.782,309.751L811.081,306.236L805.881,300.854L797.08,303.366L791.079,303.796L780.078,300.782L783.078,297.769L788.079,297.195L787.279,292.172L790.879,288.728L793.079,290.379L800.78,282.629L805.681,285.499L819.182,289.015L836.784,289.876L839.284,288.728L843.984,278.683L840.884,276.961L828.383,274.88L814.881,268.997L817.782,265.911L815.282,264.692L819.682,257.947L833.883,265.84L842.584,272.154L857.286,277.607L870.887,287.939L875.088,293.105L876.488,298.486L880.188,305.159L883.488,306.81L891.989,306.307L900.49,303.222L902.49,299.634L900.69,293.464Z" },
  { id: 'rak', path: "M867.587,227.022L872.687,221.784L877.188,220.852L881.488,217.838L887.589,216.259L894.989,210.878L906.291,197.819L911.991,193.443L907.291,203.201L910.491,204.133L914.591,189.424L923.392,182.034L926.693,177.442L928.893,170.626L921.992,176.222L927.393,167.971L931.793,159.217L936.394,144.149L941.294,143.791L951.795,141.279L954.195,141.495L958.496,153.764L956.696,163.809L955.796,182.393L950.395,190.501L950.295,197.102L955.096,202.985L954.595,208.367L949.695,212.313L950.495,225.228L951.995,227.811L949.195,229.605L940.494,231.758L934.693,231.255L929.993,233.982L924.992,238.933L920.892,240.583L915.792,240.583L913.291,244.745L916.792,261.606L922.792,263.759L933.593,263.328L938.794,260.673L942.094,260.602L946.995,267.849L945.195,271.508L939.394,277.822L940.994,280.692L945.895,281.051L948.395,282.988L948.095,288.8L942.094,292.388L936.394,293.32L926.293,290.522L920.592,285.428L916.092,283.634L913.291,284.638L911.591,291.383L908.791,296.908L905.491,292.316L895.49,282.773L897.19,277.822L895.89,273.876L888.089,266.198L885.889,260.889L884.888,251.274L879.288,234.413L872.887,231.327ZM977.498,391.189L970.497,397.288L966.797,398.938L955.996,401.091L955.896,401.091L942.394,401.88L930.993,392.337L925.593,388.893L923.892,379.781L921.492,373.682L915.392,370.309L914.291,363.924L909.991,355.457L910.191,347.062L915.992,334.362L910.591,327.689L912.291,322.738L917.492,317.716L930.993,319.079L934.793,318.075L942.994,319.294L949.395,315.491L950.695,309.536L956.696,305.231L957.296,302.72L952.295,302.505L947.295,299.276L954.195,294.971L960.796,296.621L962.996,300.567L968.897,299.634L971.297,306.81L963.696,311.545L963.296,317.429L954.895,318.936L953.495,321.16L954.695,330.129L952.295,343.259L952.295,347.564L954.495,353.52L951.995,357.179L955.996,363.134L959.696,373.108L957.996,380.642L962.796,385.234L972.897,386.454L976.498,388.821Z" },
  { id: 'uaq', path: "M819.682,257.947L821.582,251.848L827.083,244.386L830.583,243.094L825.283,251.848L829.783,255.723L842.784,253.14L849.085,240.368L857.986,232.69L865.087,230.179L867.587,227.022L872.887,231.327L879.288,234.413L884.888,251.274L885.889,260.889L888.089,266.198L895.89,273.876L897.19,277.822L895.49,282.773L905.491,292.316L900.69,293.464L902.49,299.634L900.49,303.222L891.989,306.307L883.488,306.81L880.188,305.159L876.488,298.486L875.088,293.105L870.887,287.939L857.286,277.607L842.584,272.154L833.883,265.84Z" },
  { id: 'fujairah', path: "M985.699,382.794L984.398,386.31L977.498,391.189L976.498,388.821L972.897,386.454L974.197,382.22L977.598,382.435L984.098,383.583ZM954.495,353.52L952.295,347.564L952.295,343.259L954.695,330.129L953.495,321.16L954.895,318.936L963.296,317.429L969.297,320.658L972.797,319.366L981.298,313.482L991.899,309.177L992.899,303.509L994.399,301.643L999.9,297.769L998.3,312.047L996.4,321.088L995.6,350.363L983.398,347.851L979.698,348.282L982.598,358.327L983.898,360.264L983.098,366.291L980.698,368.874L978.998,374.615L976.498,377.198L973.097,369.305L958.296,354.883ZM974.497,295.832L968.897,299.634L962.996,300.567L960.796,296.621L954.195,294.971L947.295,299.276L952.295,302.505L957.296,302.72L956.696,305.231L950.695,309.536L949.395,315.491L942.994,319.294L934.793,318.075L930.993,319.079L917.492,317.716L917.992,312.191L915.692,305.949L920.892,301.93L921.892,299.85L916.892,295.616L920.592,285.428L926.293,290.522L936.394,293.32L942.094,292.388L948.095,288.8L948.395,282.988L945.895,281.051L940.994,280.692L939.394,277.822L945.195,271.508L946.995,267.849L942.094,260.602L938.794,260.673L933.593,263.328L922.792,263.759L916.792,261.606L913.291,244.745L915.792,240.583L920.892,240.583L924.992,238.933L929.993,233.982L934.693,231.255L940.494,231.758L949.195,229.605L951.995,227.811L959.596,230.466L963.096,236.206L966.397,237.067L978.298,234.197L982.698,236.565L990.999,239.005L992.599,241.372L997.2,255.364L996.2,276.674L986.799,284.064L976.998,289.948Z" },
  { id: 'ajman', path: "M800.78,282.629L803.78,278.755L807.181,281.481L809.381,277.32L810.781,278.755L814.881,268.997L828.383,274.88L840.884,276.961L843.984,278.683L839.284,288.728L836.784,289.876L819.182,289.015L805.681,285.499ZM916.892,295.616L921.892,299.85L920.892,301.93L915.692,305.949L912.991,300.926L913.491,298.271Z" }
];

export default function CardGeneratorPanel() {
  const { 
    selectedRegions, 
    selectedSpots = [], 
    toggleRegion, 
    toggleSpot, 
    labelMode, 
    setLabelMode, 
    themeColor, 
    setThemeColor, 
    userName, 
    setUserName, 
    userPhoto, 
    setUserPhoto 
  } = useMapStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [onlySelected, setOnlySelected] = useState(true);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setScale(entries[0].contentRect.width / 1080);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Count selected emirates (at least 1 region from that emirate)
  const selectedEmiratesCount = EMIRATES_DATA.filter(e =>
    e.regions.some(r => selectedRegions.includes(r.id))
  ).length;

  const percentage = Math.round((selectedEmiratesCount / TOTAL_EMIRATES) * 100) || 0;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserPhoto(url);
    }
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (format: 'png' | 'jpg') => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    const el = cardRef.current;
    // Temporarily remove the CSS scale so html-to-image captures at native 1080×1080
    const prevTransform = el.style.transform;
    el.style.transform = 'scale(1)';

    // Small wait to let the browser re-paint at full size
    await new Promise(r => setTimeout(r, 80));

    try {
      const opts = { quality: 1.0, width: 1080, height: 1080, pixelRatio: 2 };
      const dataUrl = await (format === 'png'
        ? htmlToImage.toPng(el, opts)
        : htmlToImage.toJpeg(el, opts));
      saveAs(dataUrl, `my-unseen-uae.${format}`);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to generate image. Please try again.');
    } finally {
      // Always restore the preview scale
      el.style.transform = prevTransform;
      setIsDownloading(false);
    }
  };


  // ── Share state ──────────────────────────────────────────────
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [imgCopied, setImgCopied] = useState(false);

  const SITE_URL = 'https://unseenuae.com';

  const shareCaption = [
    userName ? `${userName} has explored ${selectedEmiratesCount}/7 Emirates of the UAE! 🇦🇪` :
               `I've explored ${selectedEmiratesCount}/7 Emirates of the UAE! 🇦🇪`,
    `${percentage}% of the UAE discovered so far!`,
    '',
    '#UnseenUAE #UAE #ExploreUAE #VisitUAE #MyUAEJourney #Emirates #DubaiLife #AbuDhabi',
    SITE_URL,
  ].join('\n');

  /** Generate the card image and open the share modal */
  const handleOpenShare = async () => {
    if (!cardRef.current) return;
    setIsGeneratingShare(true);
    const el = cardRef.current;
    const prevTransform = el.style.transform;
    el.style.transform = 'scale(1)';
    await new Promise(r => setTimeout(r, 80));
    try {
      const url = await htmlToImage.toPng(el, { quality: 1.0, width: 1080, height: 1080, pixelRatio: 2 });
      setShareImageUrl(url);
      setShowShareModal(true);
    } catch (err) {
      console.error('Share generation error:', err);
      alert('Could not generate image for sharing.');
    } finally {
      el.style.transform = prevTransform;
      setIsGeneratingShare(false);
    }
  };

  const openUrl = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

  const handleNativeShare = async () => {
    if (!shareImageUrl) return;
    try {
      const blob = await (await fetch(shareImageUrl)).blob();
      const file = new File([blob], 'my-unseen-uae.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: shareCaption, url: SITE_URL });
      } else {
        await navigator.share({ text: shareCaption, url: SITE_URL });
      }
    } catch { /* user cancelled */ }
  };

  const handleFacebook = () =>
    openUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}&quote=${encodeURIComponent(shareCaption)}`);

  const handleTwitter = () =>
    openUrl(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareCaption)}`);

  const handleLinkedIn = () =>
    openUrl(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}&summary=${encodeURIComponent(shareCaption)}`);

  const handleWhatsApp = () =>
    openUrl(`https://wa.me/?text=${encodeURIComponent(shareCaption)}`);

  const handleCopyCaption = async () => {
    await navigator.clipboard.writeText(shareCaption);
    setCaptionCopied(true);
    setTimeout(() => setCaptionCopied(false), 2000);
  };

  const handleCopyImage = async () => {
    if (!shareImageUrl) return;
    try {
      const blob = await (await fetch(shareImageUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setImgCopied(true);
      setTimeout(() => setImgCopied(false), 2000);
    } catch { alert('Could not copy image. Please download and post manually.'); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Controls Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl shadow-sm border border-gray-200/80 flex flex-col gap-3.5">
        {/* Tier 1: Theme & Identity Customization */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          {/* Theme Palette */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-gray-50 border border-gray-200/70">
              {THEMES.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setThemeColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                    themeColor === color ? 'border-gray-900 scale-110 shadow-xs ring-2 ring-black/10' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color === '#000000' ? '#111' : color }}
                  title={`Select theme color ${color}`}
                />
              ))}
              {/* UAE Flag mini button */}
              <div 
                onClick={() => setThemeColor('#009639')}
                className="ml-1 flex h-6 w-9 rounded-full overflow-hidden border border-gray-300 cursor-pointer hover:scale-105 transition-transform" 
                title="UAE Flag Theme"
              >
                <div className="flex-1" style={{ backgroundColor: '#009639' }} />
                <div className="flex-1" style={{ backgroundColor: '#ffffff' }} />
                <div className="flex-1" style={{ backgroundColor: '#000000' }} />
                <div className="flex-1" style={{ backgroundColor: '#EF3340' }} />
              </div>
            </div>
          </div>

          {/* Photo & Name Input */}
          <div className="flex items-center gap-2 flex-1 min-w-[240px] justify-end">
            <label className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200/80 rounded-xl cursor-pointer transition-colors text-xs font-semibold text-gray-700 shrink-0 active:scale-95">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Photo</span>
              <span className="sm:hidden">Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>

            <input
              type="text"
              placeholder="Enter your name..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full max-w-[220px] bg-gray-50 border border-gray-200/80 rounded-xl py-2 px-3 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Tier 2: Map Labels & Filter */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2.5">
          {/* Label selector */}
          <div className="flex items-center gap-1 bg-gray-100/90 p-1 rounded-xl text-xs font-semibold overflow-x-auto max-w-full">
            <span className="px-2 text-gray-400 font-medium hidden sm:inline">Show:</span>
            <button
              type="button"
              onClick={() => setLabelMode('regions')}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${labelMode === 'regions' ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Regions
            </button>
            <button
              type="button"
              onClick={() => setLabelMode('spots')}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${labelMode === 'spots' ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <span>Tourist Spots</span>
              {selectedSpots.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black leading-none">
                  {selectedSpots.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setLabelMode('emirates')}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${labelMode === 'emirates' ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Emirates
            </button>
            <button
              type="button"
              onClick={() => setLabelMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${labelMode === 'all' || labelMode === 'both' ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-800'}`}
            >
              All Labels
            </button>
          </div>

          {/* Visibility toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200/70 transition-colors">
            <input
              type="checkbox"
              checked={onlySelected}
              onChange={e => setOnlySelected(e.target.checked)}
              className="w-3.5 h-3.5 accent-emerald-600 rounded"
            />
            <span>Show After Selection Only</span>
          </label>
        </div>
      </div>

      <div className="flex justify-center bg-gradient-to-b from-gray-100/70 to-gray-200/50 rounded-3xl p-2 sm:p-4 border border-gray-200/80 overflow-hidden shadow-inner">
        <div ref={containerRef} className="w-full max-w-[900px] aspect-square relative rounded-[2rem]">
          <div
            ref={cardRef}
            className="absolute top-0 left-0 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col origin-top-left"
            style={{
              width: '1080px',
              height: '1080px',
              transform: `scale(${scale})`,
              background: 'linear-gradient(160deg, #e8f4fd 0%, #dbeeff 40%, #eaf7f0 100%)',
            }}
          >
            {/* UAE Flag Top Stripe */}
            <div className="flex h-10 w-full shrink-0">
              <div className="flex-1" style={{ backgroundColor: '#009639' }} />
              <div className="flex-1" style={{ backgroundColor: '#ffffff' }} />
              <div className="flex-1" style={{ backgroundColor: '#000000' }} />
              <div className="flex-1" style={{ backgroundColor: '#EF3340' }} />
            </div>

            {/* Card Header */}
            <div className="px-14 pt-10 pb-4 flex items-center justify-between relative z-10 pointer-events-none">
              <div className="flex items-center gap-7">
                {/* Profile Photo */}
                <div
                  className="w-28 h-28 rounded-2xl overflow-hidden bg-white shrink-0 shadow-lg"
                  style={{ border: `4px solid ${themeColor}` }}
                >
                  {userPhoto ? (
                    <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-4xl font-black"
                      style={{ color: themeColor }}
                    >
                      {userName ? userName.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 font-semibold uppercase tracking-widest mb-1" style={{ fontSize: '26px' }}>
                    UAE Travel Map
                  </p>
                  <h2 className="font-black tracking-tight text-gray-800 leading-tight" style={{ fontSize: '52px' }}>
                    {userName ? `${userName}\u2019s UAE` : 'My UAE Journey'}
                  </h2>
                </div>
              </div>

              {/* Count Badge */}
              <div className="flex items-baseline gap-1">
                <motion.span
                  key={selectedEmiratesCount}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="font-black leading-none"
                  style={{ fontSize: '120px', color: themeColor, lineHeight: 1 }}
                >
                  {selectedEmiratesCount}
                </motion.span>
                <span className="font-bold text-gray-400" style={{ fontSize: '52px' }}>/{TOTAL_EMIRATES}</span>
              </div>
            </div>

            {/* MAP AREA */}
            <div className="flex-1 flex items-center justify-center relative">
              <svg
                viewBox="0 0 1000 1000"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* 1. Base Map: All 7 Emirates divided by small white borders */}
                {EMIRATE_PATHS.map((emirate) => {
                  const emirateData = EMIRATES_DATA.find(e => e.id === emirate.id);
                  let fillRatio = 0;
                  if (emirateData) {
                    const selectedCount = emirateData.regions.filter(r => selectedRegions.includes(r.id)).length;
                    fillRatio = selectedCount / emirateData.regions.length;
                  }
                  const isSelected = fillRatio > 0;

                  return (
                    <path
                      key={emirate.id}
                      d={emirate.path}
                      fill={isSelected ? themeColor : '#cbdceb'}
                      fillOpacity={isSelected ? (0.75 + fillRatio * 0.25) : 0.55}
                      stroke="#ffffff"
                      strokeWidth={2.5}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      style={{
                        transition: 'fill 0.4s, fill-opacity 0.4s',
                        cursor: 'pointer',
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08))',
                      }}
                      onClick={() => {
                        if (emirateData) {
                          emirateData.regions.forEach(r => toggleRegion(r.id));
                        }
                      }}
                    />
                  );
                })}

                {/* 2. Emirate Badges (7 main emirates) */}
                {(labelMode === 'emirates' || labelMode === 'both' || labelMode === 'all') && Object.entries(EMIRATE_LABELS).map(([id, label]) => {
                  const emirateData = EMIRATES_DATA.find(e => e.id === id);
                  const isSelected = emirateData ? emirateData.regions.some(r => selectedRegions.includes(r.id)) : false;

                  // Only show after selection if onlySelected is enabled
                  if (onlySelected && !isSelected) return null;

                  return (
                    <g key={`emirate-badge-${id}`} style={{ pointerEvents: 'none' }}>
                      {/* Connector line for offset labels */}
                      {(label.lx !== label.x || Math.abs(label.ly - label.y) > 40) && (
                        <line
                          x1={label.x} y1={label.y}
                          x2={label.lx} y2={label.ly}
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                          opacity="0.8"
                        />
                      )}
                      {/* Pill background */}
                      <rect
                        x={label.lx - (label.name.length * label.fontSize * 0.32)}
                        y={label.ly - label.fontSize * 0.72}
                        width={label.name.length * label.fontSize * 0.64}
                        height={label.fontSize * 1.45}
                        rx={label.fontSize * 0.4}
                        fill={isSelected ? themeColor : '#ffffff'}
                        fillOpacity={isSelected ? 0.95 : 0.92}
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                      {/* Label text */}
                      <text
                        x={label.lx}
                        y={label.ly}
                        textAnchor={label.anchor}
                        dominantBaseline="middle"
                        fontSize={label.fontSize}
                        fontWeight="800"
                        fill={isSelected ? '#ffffff' : '#1e3a5f'}
                        style={{ userSelect: 'none' }}
                      >
                        {label.name}
                      </text>
                    </g>
                  );
                })}

                {/* 3. Region Markers & Names (All 20 regions - styled like Bangladesh reference map) */}
                {(labelMode === 'regions' || labelMode === 'both' || labelMode === 'all') && REGION_MARKERS.map((r) => {
                  const isRegionSelected = selectedRegions.includes(r.id);

                  // Only show after selection if onlySelected is enabled
                  if (onlySelected && !isRegionSelected) return null;

                  return (
                    <g
                      key={`region-marker-${r.id}`}
                      className="cursor-pointer group"
                      onClick={() => toggleRegion(r.id)}
                    >
                      {/* Selection outer pulse ring */}
                      {isRegionSelected && (
                        <circle
                          cx={r.x}
                          cy={r.y}
                          r={9}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth={2}
                          opacity={0.9}
                        />
                      )}

                      {/* Red dot marker with white border (matching reference image) */}
                      <circle
                        cx={r.x}
                        cy={r.y}
                        r={isRegionSelected ? 6 : 4.5}
                        fill="#EF3340"
                        stroke="#ffffff"
                        strokeWidth={isRegionSelected ? 2.5 : 1.8}
                      />

                      {/* Region Name with dark halo for contrast + crisp white text */}
                      <text
                        x={r.lx}
                        y={r.ly}
                        textAnchor={r.anchor}
                        dominantBaseline="middle"
                        fontSize={r.fontSize}
                        fontWeight={isRegionSelected ? '900' : '700'}
                        fill="none"
                        stroke="#0a2540"
                        strokeWidth={3.5}
                        strokeLinejoin="round"
                        style={{ userSelect: 'none' }}
                      >
                        {r.name}
                      </text>
                      <text
                        x={r.lx}
                        y={r.ly}
                        textAnchor={r.anchor}
                        dominantBaseline="middle"
                        fontSize={r.fontSize}
                        fontWeight={isRegionSelected ? '900' : '700'}
                        fill="#ffffff"
                        style={{ userSelect: 'none' }}
                      >
                        {r.name}
                      </text>
                    </g>
                  );
                })}

                {/* 4. Tourist Attraction Markers & Pins (Amber/Gold Landmark Pins) */}
                {(labelMode === 'spots' || labelMode === 'both' || labelMode === 'all') && TOURIST_SPOTS.map((spot) => {
                  const isSpotSelected = selectedSpots.includes(spot.id);

                  // Only show after selection if onlySelected is enabled
                  if (onlySelected && !isSpotSelected) return null;

                  return (
                    <g
                      key={`spot-marker-${spot.id}`}
                      className="cursor-pointer group"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSpot(spot.id, spot.regionId);
                      }}
                    >
                      {/* Selection outer pulse ring */}
                      {isSpotSelected && (
                        <circle
                          cx={spot.x}
                          cy={spot.y}
                          r={11}
                          fill="none"
                          stroke={spot.highlight ? '#f59e0b' : '#38bdf8'}
                          strokeWidth={2}
                          strokeDasharray="3 2"
                          opacity={0.9}
                        />
                      )}

                      {/* Amber / Gold Landmark Badge Pin */}
                      <circle
                        cx={spot.x}
                        cy={spot.y}
                        r={isSpotSelected ? 6.5 : 4.5}
                        fill={isSpotSelected ? (spot.highlight ? '#f59e0b' : '#0284c7') : '#94a3b8'}
                        stroke="#ffffff"
                        strokeWidth={isSpotSelected ? 2.5 : 1.8}
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25))' }}
                      />

                      {/* Inner white star dot */}
                      {isSpotSelected && (
                        <circle
                          cx={spot.x}
                          cy={spot.y}
                          r={2}
                          fill="#ffffff"
                        />
                      )}

                      {/* Landmark Name Label: Dark halo for high contrast + bright text */}
                      <text
                        x={spot.lx}
                        y={spot.ly}
                        textAnchor={spot.anchor}
                        dominantBaseline="middle"
                        fontSize={isSpotSelected ? 12 : 10}
                        fontWeight={isSpotSelected ? '900' : '700'}
                        fill="none"
                        stroke="#0a2540"
                        strokeWidth={3.5}
                        strokeLinejoin="round"
                        style={{ userSelect: 'none' }}
                      >
                        ★ {spot.name}
                      </text>
                      <text
                        x={spot.lx}
                        y={spot.ly}
                        textAnchor={spot.anchor}
                        dominantBaseline="middle"
                        fontSize={isSpotSelected ? 12 : 10}
                        fontWeight={isSpotSelected ? '900' : '700'}
                        fill={isSpotSelected ? (spot.highlight ? '#fef08a' : '#ffffff') : '#cbd5e1'}
                        style={{ userSelect: 'none' }}
                      >
                        ★ {spot.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Card Footer */}
            <div className="px-14 pt-4 pb-10 flex flex-col gap-4 relative z-10 pointer-events-none">
              {/* Progress Bar */}
              <div className="h-4 w-full bg-white/60 rounded-full overflow-hidden border border-gray-200">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${percentage}%`, backgroundColor: themeColor }}
                />
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="font-black text-gray-800" style={{ fontSize: '38px' }}>
                    {percentage}% UAE Explored
                  </p>
                  <p className="text-gray-500 font-medium" style={{ fontSize: '24px' }}>
                    {selectedEmiratesCount} Emirates &middot; {selectedRegions.length} Regions{selectedSpots.length > 0 ? ` · ${selectedSpots.length} Tourist Places` : ''} visited
                  </p>
                  <p className="font-bold mt-1" style={{ fontSize: '22px', color: themeColor }}>
                    Keep exploring the UAE with {userName || 'me'} 🇦🇪
                  </p>
                </div>

                {/* Branding */}
                <div className="flex items-center gap-4 bg-white/70 px-7 py-4 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex w-10 h-7 rounded-md overflow-hidden border border-gray-200">
                    <div className="flex-1" style={{ backgroundColor: '#009639' }} />
                    <div className="flex-1" style={{ backgroundColor: '#ffffff' }} />
                    <div className="flex-1" style={{ backgroundColor: '#000000' }} />
                    <div className="flex-1" style={{ backgroundColor: '#EF3340' }} />
                  </div>
                  <div>
                    <p className="font-black text-gray-800" style={{ fontSize: '24px', lineHeight: 1.1 }}>Unseen UAE</p>
                    <p className="text-gray-400 font-medium" style={{ fontSize: '18px' }}>unseenuae.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UI Tip (Only visible on web, not included in exported/shared image) */}
      <p className="text-xs text-gray-400 text-center font-medium -mt-2">
        💡 Tip: Click an emirate or tourist spot on the map to mark it as visited
      </p>

      {/* Action Buttons (Responsive on Mobile & Desktop - Identically Sized) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl mx-auto">
        <motion.button
          whileHover={{ scale: isDownloading ? 1 : 1.02 }}
          whileTap={{ scale: isDownloading ? 1 : 0.98 }}
          onClick={() => handleDownload('png')}
          disabled={isDownloading || isGeneratingShare}
          className="h-12 w-full flex items-center justify-center gap-2 px-4 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap border border-transparent active:scale-95"
          style={{ backgroundColor: themeColor }}
        >
          <Download className={`w-4 h-4 shrink-0 ${isDownloading ? 'animate-bounce' : ''}`} />
          <span>{isDownloading ? 'Exporting...' : 'Download PNG'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: isDownloading ? 1 : 1.02 }}
          whileTap={{ scale: isDownloading ? 1 : 0.98 }}
          onClick={() => handleDownload('jpg')}
          disabled={isDownloading || isGeneratingShare}
          className="h-12 w-full flex items-center justify-center gap-2 px-4 bg-white text-gray-800 border border-gray-200/90 rounded-2xl text-xs sm:text-sm font-bold hover:bg-gray-50 transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap active:scale-95"
        >
          <Download className="w-4 h-4 shrink-0 text-gray-500" />
          <span>Download JPG</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: isGeneratingShare ? 1 : 1.02 }}
          whileTap={{ scale: isGeneratingShare ? 1 : 0.98 }}
          onClick={handleOpenShare}
          disabled={isDownloading || isGeneratingShare}
          className="h-12 w-full flex items-center justify-center gap-2 px-4 rounded-2xl text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed text-white bg-gradient-to-tr from-emerald-600 to-teal-600 whitespace-nowrap border border-transparent active:scale-95"
        >
          <Share2 className={`w-4 h-4 shrink-0 ${isGeneratingShare ? 'animate-spin' : ''}`} />
          <span>{isGeneratingShare ? 'Preparing...' : 'Share Card'}</span>
        </motion.button>
      </div>

      {/* ── Share Modal ──────────────────────────────────── */}
      {showShareModal && shareImageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
          onClick={() => setShowShareModal(false)}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-12 rounded-lg overflow-hidden border border-gray-200">
                  <div className="flex-1" style={{ backgroundColor: '#009639' }} />
                  <div className="flex-1" style={{ backgroundColor: '#ffffff' }} />
                  <div className="flex-1" style={{ backgroundColor: '#000000' }} />
                  <div className="flex-1" style={{ backgroundColor: '#EF3340' }} />
                </div>
                <h3 className="font-black text-gray-800 text-lg">Share Your UAE Journey</h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Card Preview */}
              <div className="flex justify-center">
                <img
                  src={shareImageUrl}
                  alt="Your UAE Journey Card"
                  className="w-48 h-48 object-cover rounded-2xl shadow-lg border border-gray-100"
                />
              </div>

              {/* Caption Box */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Auto-generated Caption</span>
                  <button
                    onClick={handleCopyCaption}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                    style={{ backgroundColor: captionCopied ? '#009639' : '#f3f4f6', color: captionCopied ? '#fff' : '#374151' }}
                  >
                    {captionCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {captionCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{shareCaption}</p>
              </div>

              {/* Platform Buttons */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Share on</p>
                <div className="grid grid-cols-2 gap-2.5">

                  {/* Native Share */}
                  {'share' in navigator && (
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={handleNativeShare}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm text-white shadow-md transition-all"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                      <span className="text-xl">📲</span> Share (Native)
                    </motion.button>
                  )}

                  {/* Facebook */}
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleFacebook}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm text-white shadow-md"
                    style={{ background: 'linear-gradient(135deg, #1877f2, #0d6eef)' }}
                  >
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </motion.button>

                  {/* Twitter / X */}
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleTwitter}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm text-white shadow-md"
                    style={{ background: 'linear-gradient(135deg, #000000, #1a1a1a)' }}
                  >
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    X (Twitter)
                  </motion.button>

                  {/* LinkedIn */}
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleLinkedIn}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm text-white shadow-md"
                    style={{ background: 'linear-gradient(135deg, #0077b5, #005885)' }}
                  >
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </motion.button>

                  {/* WhatsApp */}
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleWhatsApp}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm text-white shadow-md"
                    style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)' }}
                  >
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </motion.button>

                  {/* Instagram (copy image) */}
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleCopyImage}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm text-white shadow-md"
                    style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}
                  >
                    {imgCopied
                      ? <><Check className="w-5 h-5" /> Copied!</>
                      : <><svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> Instagram (Copy)</>
                    }
                  </motion.button>
                </div>

                {imgCopied && (
                  <p className="text-xs text-center text-gray-500 mt-2">
                    ✅ Image copied! Open Instagram → New Post → Paste image
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

    </motion.div>
  );
}
