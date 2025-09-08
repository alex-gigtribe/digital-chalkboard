import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface HistoricalBarChartProps {
    period: "week" | "month" | "quarter";
    selectedVariety: string;
    selectedProducer: string;
    selectedPUC: string;
}

type HistoricalChartDataItem = {
    period: string;
    [key: string]: string | number;
};

export function HistoricalBarChart({
    period,
    selectedVariety,
    selectedProducer,
    selectedPUC
}: HistoricalBarChartProps) {
    // Generate all data - no pre-filtering
    const allData: BinData[] = useMemo(() => generateMockData(), []);

    // Use getHistoricalData with all parameters
    const chartData: HistoricalChartDataItem[] = useMemo(() => {
        const historicalData = getHistoricalData(allData, period, selectedPUC, selectedVariety, selectedProducer);

        // Format the period labels based on the period type
        const formattedData = historicalData.map((item: any) => {
            let formattedPeriod = item.period;

            if (period === 'week') {
                // Format as short date (e.g., "Sep 2")
                const date = new Date(item.period);
                formattedPeriod = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                });
            } else if (period === 'month') {
                // Use week number (e.g., "W36")
                formattedPeriod = item.period; // Already in WXX format
            } else if (period === 'quarter') {
                // Keep month names as is
                formattedPeriod = item.period;
            }

            return {
                ...item,
                period: formattedPeriod
            };
        });

        return formattedData;
    }, [allData, period, selectedPUC, selectedVariety, selectedProducer]);

    // Calculate totals for the summary statistics
    const totals = useMemo(() => {
        const result: Record<string, number> = {};
        chartData.forEach(item => {
            Object.keys(item).forEach(key => {
                if (key !== 'period') {
                    const itemValue = item[key] as number;
                    if (typeof itemValue === 'number') {
                        result[key] = (result[key] || 0) + itemValue;
                    }
                }
            });
        });
        return result;
    }, [chartData]);

    const grandTotal = Object.values(totals).reduce((sum, value) => sum + value, 0);

    const varieties = [
        { key: "Fuji", name: "Fuji", color: "#2A5B84" },
        { key: "Gala", name: "Gala", color: "#729FD9" },
        { key: "Granny Smith", name: "Granny Smith", color: "#007D5C" },
        { key: "Honeycrisp", name: "Honeycrisp", color: "#AAAAAA" },
        { key: "Red Delicious", name: "Red Delicious", color: "#E37169" }
    ];

    const getVisibleVarieties = () => {
        if (selectedVariety === "all") return varieties;
        return varieties.filter(v => v.name === selectedVariety);
    };

    const totalTons = Math.round(grandTotal * 0.37);

    const getPeriodDescription = () => {
        switch (period) {
            case 'week':
                return 'Total Bins for Past Week';
            case 'month':
                return 'Total Bins for Current Month (by Week)';
            case 'quarter':
                return 'Total Bins for Quarter';
            default:
                return 'Total Bins';
        }
    };

    return (
        <div className="w-full p-6">
            <div className="bg-background-accent rounded-2xl p-6 shadow-lg min-h-[600px]">
                {/* Header */}
                <div className="flex flex-col space-y-4 mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        Historical Analysis by Variety: {getPeriodDescription()}
                    </h2>
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <div className="bg-background-accent rounded-lg p-4 border border-grey-contrast">
                        <div className="text-grey-contrast text-sm">Total Bins</div>
                        <div className="text-white text-xl font-bold">
                            {grandTotal.toLocaleString()}
                        </div>
                    </div>

                    <div className="bg-background-accent rounded-lg p-4 border border-grey-contrast">
                        <div className="text-grey-contrast text-sm">Total Tons</div>
                        <div className="text-white text-xl font-bold">
                            {totalTons.toLocaleString()}
                        </div>
                    </div>

                    {varieties.map(variety => (
                        <div
                            key={variety.key}
                            className="rounded-lg p-4"
                            style={{ backgroundColor: variety.color }}
                        >
                            <div className="text-white text-sm">{variety.name}</div>
                            <div className="text-white text-xl font-bold">
                                {totals[variety.key]?.toLocaleString() || 0}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart */}
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#2D3B48" />
                        <XAxis
                            dataKey="period"
                            stroke="#aaa"
                            fontSize={12}
                            angle={period === 'week' ? -45 : 0}
                            textAnchor={period === 'week' ? 'end' : 'middle'}
                            height={period === 'week' ? 80 : 60}
                        />
                        <YAxis stroke="#aaa" />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#2D3B48", border: "none" }}
                            labelStyle={{ color: "#aaa" }}
                        />
                        <Legend />
                        {getVisibleVarieties().map(v => (
                            <Bar key={v.key} dataKey={v.key} stackId="a" fill={v.color} name={v.name} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export interface BinData {
    id: string;
    scanDate: string;
    scanTime: string;
    farmArea: string;
    variety: string;
    binCount: number;
    puc: string;
    producer: string;
}

export const varietyConfig = [
    { key: "Fuji", name: "Fuji", color: "#2A5B84" },
    { key: "Gala", name: "Gala", color: "#729FD9" },
    { key: "Granny Smith", name: "Granny Smith", color: "#007D5C" },
    { key: "Honeycrisp", name: "Honeycrisp", color: "#AAAAAA" },
    { key: "Red Delicious", name: "Red Delicious", color: "#E37169" }
];

// Helper function to calculate ISO week number
const getISOWeekNumber = (date: Date): number => {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    const weekNumber = Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 + 1 + (week1.getDay() + 6) % 7) / 7);
    return weekNumber;
};

// Helper function to get the week range for a given month
const getMonthWeekRange = (date: Date): { startWeek: number; endWeek: number } => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startWeek = getISOWeekNumber(startOfMonth);
    const endWeek = getISOWeekNumber(endOfMonth);
    return { startWeek, endWeek };
};

// Generate dates for the past 90 days from the current date
const generateDates = (daysBack: number): string[] => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < daysBack; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() - i);
        dates.unshift(currentDate.toISOString().split('T')[0]);
    }
    return dates;
};

// Define the farm structure and PUCs
const farms = [
    { name: 'Welgelegen', id: 'welgelegen', pucs: ['1', '2'] },
    { name: 'Boplaas', id: 'boplaas', pucs: ['3', '4', '5'] }
];

// Define varieties and their assignment to PUCs
const allVarieties = varietyConfig.map(v => v.name);
const getPucVarieties = (pucId: string): string[] => {
    switch (pucId) {
        case '1': return ['Fuji', 'Gala', 'Granny Smith'];
        case '2': return ['Red Delicious', 'Honeycrisp'];
        case '3': return ['Gala'];
        case '4': return ['Granny Smith', 'Fuji'];
        case '5': return ['Red Delicious', 'Gala', 'Honeycrisp'];
        default: return allVarieties;
    }
};

// Simple seeded random number generator for consistent data
class SeededRandom {
    private seed: number;
    constructor(seed: number) {
        this.seed = seed;
    }
    next(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
    nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
}

export const generateMockData = (selectedProducer?: string): BinData[] => {
    const data: BinData[] = [];
    const dates = generateDates(90);

    dates.forEach((date) => {
        const today = new Date().toISOString().split('T')[0];
        let dateRng: SeededRandom;
        
        if (date === today) {
            const fiveMinuteWindow = Math.floor(Date.now() / (5 * 60 * 1000));
            dateRng = new SeededRandom(new Date(date).getTime() + fiveMinuteWindow);
        } else {
            dateRng = new SeededRandom(new Date(date).getTime() + 12345);
        }
        
        farms.forEach(farm => {
            if (selectedProducer && selectedProducer !== 'All Producers' && farm.name !== selectedProducer) {
                return;
            }

            farm.pucs.forEach(pucId => {
                const varieties = getPucVarieties(pucId);
                const isPucActive = dateRng.next() > 0.1;
                if (!isPucActive) return;

                const scansPerDay = dateRng.nextInt(1, 5);
                for (let scan = 0; scan < scansPerDay; scan++) {
                    const variety = varieties[dateRng.nextInt(0, varieties.length - 1)];
                    const binCount = dateRng.nextInt(1, 80);
                    const zone = `Zone-${dateRng.nextInt(1, 10)}`;
                    
                    data.push({
                        id: `${date}-${farm.id}-${pucId}-${scan}`,
                        scanDate: date,
                        scanTime: `${dateRng.nextInt(0, 23).toString().padStart(2, '0')}:${dateRng.nextInt(0, 59).toString().padStart(2, '0')}`,
                        farmArea: zone,
                        variety,
                        binCount,
                        puc: pucId,
                        producer: farm.name
                    });
                }
            });
        });
    });

    return data.sort((a, b) => new Date(a.scanDate).getTime() - new Date(b.scanDate).getTime());
};

export const getStatistics = (data: BinData[], period: 'day' | 'week' | 'month' = 'week') => {
    const totalBins = data.reduce((sum, item) => sum + item.binCount, 0);
    
    const varietyBreakdown = data.reduce((acc, item) => {
        acc[item.variety] = (acc[item.variety] || 0) + item.binCount;
        return acc;
    }, {} as Record<string, number>);
    
    const topVarietyEntry = Object.entries(varietyBreakdown).sort((a, b) => b[1] - a[1])[0];
    
    let avgBinsPerDay = 0;
    if (period === 'day') {
        avgBinsPerDay = totalBins;
    } else if (period === 'week') {
        avgBinsPerDay = Math.round(totalBins / 7);
    } else {
        avgBinsPerDay = Math.round(totalBins / 30);
    }
    
    return {
        totalBins,
        varietyBreakdown,
        avgBinsPerDay,
        topVariety: topVarietyEntry || null,
        totalTons: Math.round(totalBins * 0.37)
    };
};

export const getFilteredData = (
    data: BinData[],
    period: 'day' | 'week' | 'month' | 'quarter',
    selectedPUC?: string,
    selectedVariety?: string,
    selectedProducer?: string
) => {
    const today = new Date();
    let cutoffDate = new Date(today);
    
    switch (period) {
        case 'day':
            const todayStr = today.toISOString().split('T')[0];
            return data.filter(item => item.scanDate === todayStr);
        case 'week':
            cutoffDate.setDate(today.getDate() - 6); // Last 7 days incl. today
            cutoffDate.setHours(0, 0, 0, 0);
            break;
        case 'month':
            // Filter for the current month (September 2025)
            cutoffDate = new Date(today.getFullYear(), today.getMonth(), 1);
            cutoffDate.setHours(0, 0, 0, 0);
            break;
        case 'quarter':
            cutoffDate.setDate(today.getDate() - 90);
            cutoffDate.setHours(0, 0, 0, 0);
            break;
    }

    let filteredData = data.filter(item => {
        const itemDate = new Date(item.scanDate);
        if (period === 'month') {
            return itemDate.getFullYear() === today.getFullYear() && itemDate.getMonth() === today.getMonth();
        }
        return itemDate >= cutoffDate;
    });

    if (selectedPUC && selectedPUC !== 'all') {
        filteredData = filteredData.filter(item => item.puc === selectedPUC);
    }
    if (selectedVariety && selectedVariety !== 'all') {
        filteredData = filteredData.filter(item => item.variety === selectedVariety);
    }
    if (selectedProducer && selectedProducer !== 'All Producers') {
        filteredData = filteredData.filter(item => item.producer === selectedProducer);
    }

    return filteredData;
};

export const getHistoricalData = (
    data: BinData[],
    period: 'week' | 'month' | 'quarter',
    selectedPUC: string,
    selectedVariety: string,
    selectedProducer?: string
) => {
    const filteredData = getFilteredData(data, period, selectedPUC, selectedVariety, selectedProducer);
    const aggregated: Record<string, { period: string, [key: string]: number | string }> = {};

    const today = new Date();

    if (period === 'week') {
        // Aggregate by date for the last 7 days
        filteredData.forEach(item => {
            const dateKey = item.scanDate;
            if (!aggregated[dateKey]) {
                aggregated[dateKey] = { period: dateKey };
            }
            const currentCount = aggregated[dateKey][item.variety] as number || 0;
            aggregated[dateKey][item.variety] = currentCount + item.binCount;
        });
    } else if (period === 'month') {
        // Aggregate by ISO week number for the current month
        const { startWeek, endWeek } = getMonthWeekRange(today);
        for (let weekNum = startWeek; weekNum <= endWeek; weekNum++) {
            const weekKey = `W${weekNum}`;
            aggregated[weekKey] = { period: weekKey };
        }

        filteredData.forEach(item => {
            const date = new Date(item.scanDate);
            const weekNumber = getISOWeekNumber(date);
            const weekKey = `W${weekNumber}`;
            if (!aggregated[weekKey]) {
                aggregated[weekKey] = { period: weekKey };
            }
            const currentCount = aggregated[weekKey][item.variety] as number || 0;
            aggregated[weekKey][item.variety] = currentCount + item.binCount;
        });
    } else if (period === 'quarter') {
        // Aggregate by month
        filteredData.forEach(item => {
            const date = new Date(item.scanDate);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
            if (!aggregated[monthKey]) {
                aggregated[monthKey] = { period: monthKey };
            }
            const currentCount = aggregated[monthKey][item.variety] as number || 0;
            aggregated[monthKey][item.variety] = currentCount + item.binCount;
        });
    }

    const allVarieties = varietyConfig.map(v => v.name);
    Object.values(aggregated).forEach(item => {
        allVarieties.forEach(variety => {
            if (!(variety in item)) {
                item[variety] = 0;
            }
        });
    });

    // Sort and limit data
    let result = Object.values(aggregated);
    if (period === 'week') {
        // Sort by date and take the last 7 days
        result = result
            .sort((a, b) => new Date(a.period as string).getTime() - new Date(b.period as string).getTime())
            .slice(-7);
    } else if (period === 'month') {
        // Sort by week number
        result = result.sort((a, b) => {
            const aWeek = parseInt((a.period as string).replace('W', ''));
            const bWeek = parseInt((b.period as string).replace('W', ''));
            return aWeek - bWeek;
        });
    } else {
        // Sort by month order
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        result = result.sort((a, b) => monthOrder.indexOf(a.period as string) - monthOrder.indexOf(b.period as string))
            .slice(-3);
    }

    return result;
};

export default HistoricalBarChart;

