// // src/components/widgets/BinTrackingWidget.tsx

// import { useMemo } from "react";
// import { TrendingUp, Package, Calendar } from "lucide-react";
// import { generateMockData, getStatistics, getFilteredData } from "../../data/mockData";

// interface BinTrackingWidgetProps {
//     selectedPUC: string;
//     selectedVariety: string;
//     setSelectedVariety: (variety: string) => void;
//     period: "day" | "week";
//     selectedProducer: string;
// }

// export function BinTrackingWidget({ 
//     selectedPUC, 
//     selectedVariety, 
//     setSelectedVariety,
//     period,
//     selectedProducer,
// }: BinTrackingWidgetProps) {
//     // The following state variables and functions were moved to Dashboard.tsx:
//     // const [showDetails, setShowDetails] = useState(false);
//     // const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
//     // const [showMap, setShowMap] = useState(true);
//     // const pucLocations = useMemo(...)
//     // const getCurrentCoordinates = () => { ... }

//     // Use memoization to avoid redundant data generation
//     const allData = useMemo(() => generateMockData(), []);

//     // Use the unified filtering function to ensure consistency with Historical and BinTrackingChart
//     const filteredData = useMemo(() => {
//         console.log('Filtering data with:', { selectedProducer, selectedPUC, selectedVariety, period });
        
//         // For daily view, we need to ensure we get today's data
//         let filtered;
//         if (period === 'day') {
//             const today = new Date().toISOString().split('T')[0];
//             filtered = allData.filter(item => {
//                 let matchesDate = item.scanDate === today;
//                 let matchesProducer = selectedProducer === 'All Producers' || item.producer === selectedProducer;
//                 let matchesPUC = selectedPUC === 'all' || item.puc === selectedPUC;
//                 let matchesVariety = selectedVariety === 'all' || item.variety === selectedVariety;
                
//                 return matchesDate && matchesProducer && matchesPUC && matchesVariety;
//             });
//         } else {
//             filtered = getFilteredData(allData, period, selectedPUC, selectedVariety, selectedProducer);
//         }
        
//         console.log('Filtered data length:', filtered.length);
//         return filtered;
//     }, [allData, selectedProducer, selectedPUC, selectedVariety, period]);

//     const stats = useMemo(() => getStatistics(filteredData, period), [filteredData, period]);
    
//     // Calculate Total Unique PUCs (distinct count to match dropdown)
//     const totalUniquePUCs = useMemo(() => {
//         const uniquePUCs = new Set(filteredData.map(item => item.puc));
//         return uniquePUCs.size;
//     }, [filteredData]);
    
//     // Variety colors matching the Metaship theme
//     const varieties = [
//         { name: "Fuji", color: "#2A5B84", count: stats.varietyBreakdown['Fuji'] || 0 },
//         { name: "Gala", color: "#729FD9", count: stats.varietyBreakdown['Gala'] || 0 },
//         { name: "Granny Smith", color: "#007D5C", count: stats.varietyBreakdown['Granny Smith'] || 0 },
//         { name: "Honeycrisp", color: "#AAAAAA", count: stats.varietyBreakdown['Honeycrisp'] || 0 },
//         { name: "Red Delicious", color: "#E37169", count: stats.varietyBreakdown['Red Delicious'] || 0 }
//     ];

//     const totalBins = filteredData.reduce((sum, item) => sum + item.binCount, 0);

//     return (
//         <div className="w-full space-y-6">
//             {/* KPI Cards Wrapper */}
//             <div className="bg-background-accent rounded-2xl p-6 shadow-lg">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {/* Total Bins Card */}
//                     <div className="rounded-xl p-6 text-white border border-white">
//                         <div className="flex items-center justify-between mb-2">
//                             <Package className="w-6 h-6 opacity-80" />
//                             <span className="text-sm opacity-80">
//                                 {period === "day" ? "Today" : "7 Days"}
//                             </span>
//                         </div>
//                         <div className="text-4xl lg:text-5xl font-bold mb-1">{totalBins.toLocaleString()}</div>
//                         <div className="text-sm opacity-90">Total Bins Picked</div>
//                         <div className="mt-3 pt-3 border-t border-white/20">
//                             <div className="flex justify-between text-sm">
//                                 <span>Total PUCs: {totalUniquePUCs}</span>
//                                 <span>Weight: {stats.totalTons}t</span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Top Variety Card */}
//                     <div className="rounded-xl p-6 text-white border border-white">
//                         <div className="flex items-center justify-between mb-2">
//                             <TrendingUp className="w-6 h-6 opacity-80" />
//                             <span className="text-sm opacity-80">Leader</span>
//                         </div>
//                         <div className="text-4xl lg:text-5xl font-bold mb-1">
//                             {stats.topVariety ? stats.topVariety[0] : 'N/A'}
//                         </div>
//                         <div className="text-sm opacity-90">Top Performing Variety</div>
//                         <div className="mt-3 pt-3 border-t border-white/20">
//                             <div className="text-sm">
//                                 {stats.topVariety ? `${stats.topVariety[1].toLocaleString()} bins` : '0 bins'}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Daily Average Card */}
//                     <div className="rounded-xl p-6 text-white border border-white">
//                         <div className="flex items-center justify-between mb-2">
//                             <Calendar className="w-6 h-6 opacity-80" />
//                             <span className="text-sm opacity-80">Average</span>
//                         </div>
//                         <div className="text-4xl lg:text-5xl font-bold mb-1">{stats.avgBinsPerDay}</div>
//                         <div className="text-sm opacity-90">Bins per Day</div>
//                         <div className="mt-3 pt-3 border-t border-white/20">
//                             <div className="text-sm">
//                                 Across all varieties
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Variety Breakdown */}
//             <div className="bg-background-accent rounded-xl p-6">
//                 <h3 className="text-white font-semibold mb-4">Variety Distribution</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                     {varieties.map(variety => (
//                         <button
//                             key={variety.name}
//                             onClick={() => setSelectedVariety(variety.name)}
//                             className={`rounded-lg p-3 transition-all
//                                         ${selectedVariety === variety.name 
//                                             ? 'ring-2 ring-white shadow-lg scale-105' 
//                                             : ''
//                                         }
//                                         hover:scale-105 hover:ring-2 hover:ring-white`}
//                             style={{ backgroundColor: variety.color }}
//                         >
//                             <div className="text-white text-xs font-medium opacity-90">
//                                 {variety.name}
//                             </div>
//                             <div className="text-white text-xl font-bold">
//                                 {variety.count.toLocaleString()}
//                             </div>
//                             <div className="text-white text-xs opacity-75">
//                                 {stats.totalBins > 0 
//                                     ? `${Math.round((variety.count / stats.totalBins) * 100)}%`
//                                     : '0%'}
//                             </div>
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );

// }

// // Add a default export as well for compatibility
// export default BinTrackingWidget;