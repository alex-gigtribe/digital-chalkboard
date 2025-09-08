// import { useMemo } from "react";
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
// import { generateMockData, getFilteredData } from "../../data/mockData";

// interface BinTrackingChartProps {
//     selectedPUC: string;
//     selectedVariety: string;
//     setSelectedVariety: (variety: string) => void;
//     period: "day" | "week";
//     selectedProducer: string;
// }

// export function BinTrackingChart({ 
//     selectedPUC,
//     selectedVariety, 
//     period,
//     selectedProducer 
// }: BinTrackingChartProps) {
    
//     // Use real mock data
//     const data = useMemo(() => generateMockData(), []);
    
//     // Use unified filtering to match Overview and Historical components
//     const filteredData = useMemo(() => {
//         return getFilteredData(data, period, selectedPUC, selectedVariety, selectedProducer);
//     }, [data, period, selectedPUC, selectedVariety, selectedProducer]);

//     // Group filtered data by date for chart display
//     const chartData = useMemo(() => {
//         const grouped = filteredData.reduce((acc, item) => {
//             const date = item.scanDate;
//             if (!acc[date]) {
//                 acc[date] = {
//                     date,
//                     bins: 0,
//                     varieties: {} as Record<string, number>
//                 };
//             }
//             acc[date].bins += item.binCount;
//             acc[date].varieties[item.variety] = (acc[date].varieties[item.variety] || 0) + item.binCount;
//             return acc;
//         }, {} as Record<string, any>);

//         const sortedResults = Object.values(grouped).sort((a: any, b: any) => a.date.localeCompare(b.date));
        
//         // For week period, ensure exactly 7 days
//         if (period === 'week' && sortedResults.length > 7) {
//             return sortedResults.slice(-7);
//         }
        
//         return sortedResults;
//     }, [filteredData, period]);
    
//     // Define variety configurations
//     const varieties = [
//         { key: "Fuji", name: "Fuji", color: "#d7e2ebff" },
//         { key: "Gala", name: "Gala", color: "#729FD9" },
//         { key: "Granny Smith", name: "Granny Smith", color: "#007D5C" },
//         { key: "Honeycrisp", name: "Honeycrisp", color: "#AAAAAA" },
//         { key: "Red Delicious", name: "Red Delicious", color: "#E37169" }
//     ];

//     // Transform chart data for the chart
//     const formattedChartData = chartData.map((item: any) => ({
//         date: new Date(item.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
//         ...item.varieties,
//         total: item.bins
//     }));

//     return (
//         <div className="bg-background-accent rounded-2xl p-6 shadow-lg">
//             {/* Header */}
//             <div className="flex flex-col space-y-4 mb-6">
//                 <h2 className="text-xl font-semibold text-white">
//                     {period === "day" ? "Daily" : "7-Day"} Picking Trends: Total Bins
//                 </h2>
//             </div>

//             {/* Chart */}
//             <div className="h-80 w-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                     {period === "day" ? (
//                         <BarChart data={formattedChartData}>
//                             <CartesianGrid strokeDasharray="3 3" stroke="#2A5B84" />
//                             <XAxis 
//                                 dataKey="date" 
//                                 stroke="#AAAAAA"
//                                 fontSize={12}
//                                 tick={{ fill: "#AAAAAA" }}
//                             />
//                             <YAxis 
//                                 stroke="#AAAAAA"
//                                 fontSize={12}
//                                 tick={{ fill: "#AAAAAA" }}
//                             />
//                             <Tooltip
//                                 contentStyle={{
//                                     backgroundColor: "#2A5B84",
//                                     border: "none",
//                                     borderRadius: "8px",
//                                     color: "#FFFFFF"
//                                 }}
//                                 labelStyle={{ color: "#FFFFFF" }}
//                             />
//                             <Legend 
//                                 wrapperStyle={{ color: "#FFFFFF" }}
//                             />
//                             {varieties.map(variety => {
//                                 const shouldShow = selectedVariety === "all" || selectedVariety === variety.name;
//                                 if (!shouldShow) return null;
//                                 return (
//                                     <Bar
//                                         key={variety.key}
//                                         dataKey={variety.key}
//                                         name={variety.name}
//                                         fill={variety.color}
//                                         radius={[4, 4, 0, 0]}
//                                     />
//                                 );
//                             })}
//                         </BarChart>
//                     ) : (
//                         <LineChart data={formattedChartData}>
//                             <CartesianGrid strokeDasharray="3 3" stroke="#2A5B84" />
//                             <XAxis 
//                                 dataKey="date" 
//                                 stroke="#AAAAAA"
//                                 fontSize={12}
//                                 tick={{ fill: "#AAAAAA" }}
//                             />
//                             <YAxis 
//                                 stroke="#AAAAAA"
//                                 fontSize={12}
//                                 tick={{ fill: "#AAAAAA" }}
//                             />
//                             <Tooltip
//                                 contentStyle={{
//                                     backgroundColor: "#2A5B84",
//                                     border: "none",
//                                     borderRadius: "8px",
//                                     color: "#FFFFFF"
//                                 }}
//                                 labelStyle={{ color: "#FFFFFF" }}
//                             />
//                             <Legend 
//                                 wrapperStyle={{ color: "#FFFFFF" }}
//                             />
//                             {varieties.map(variety => {
//                                 const shouldShow = selectedVariety === "all" || selectedVariety === variety.name;
//                                 if (!shouldShow) return null;
//                                 return (
//                                     <Line
//                                         key={variety.key}
//                                         type="monotone"
//                                         dataKey={variety.key}
//                                         name={variety.name}
//                                         stroke={variety.color}
//                                         strokeWidth={3}
//                                         dot={{ fill: variety.color, strokeWidth: 2, r: 5 }}
//                                         activeDot={{ r: 7, stroke: "#FFFFFF", strokeWidth: 2 }}
//                                     />
//                                 );
//                             })}
//                         </LineChart>
//                     )}
//                 </ResponsiveContainer>
//             </div>
//         </div>
//     );
// }

// // Add default export for compatibility
// export default BinTrackingChart;