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

// Shared variety configuration (consistent across all components)
export const varietyConfig = [
    { key: "Fuji", name: "Fuji", color: "#2A5B84" },
    { key: "Gala", name: "Gala", color: "#729FD9" },
    { key: "Granny Smith", name: "Granny Smith", color: "#007D5C" },
    { key: "Honeycrisp", name: "Honeycrisp", color: "#AAAAAA" },
    { key: "Red Delicious", name: "Red Delicious", color: "#E37169" }
];

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
            cutoffDate.setDate(today.getDate() - 6); // last 7 days incl. today
            cutoffDate.setHours(0, 0, 0, 0);
            break;
        case 'month':
            cutoffDate.setDate(today.getDate() - 30);
            cutoffDate.setHours(0, 0, 0, 0);
            break;
        case 'quarter':
            cutoffDate.setDate(today.getDate() - 90);
            cutoffDate.setHours(0, 0, 0, 0);
            break;
    }

    let filteredData = data.filter(item => new Date(item.scanDate) >= cutoffDate);

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

    if (period === 'week') {
        filteredData.forEach(item => {
            const dateKey = item.scanDate;
            if (!aggregated[dateKey]) {
                aggregated[dateKey] = { period: dateKey };
            }
            const currentCount = aggregated[dateKey][item.variety] as number || 0;
            aggregated[dateKey][item.variety] = currentCount + item.binCount;
        });
    } else if (period === 'month') {
        filteredData.forEach(item => {
            const date = new Date(item.scanDate);
            const weekNum = Math.ceil(date.getDate() / 7);
            const weekKey = `Week ${weekNum}`;
            if (!aggregated[weekKey]) {
                aggregated[weekKey] = { period: weekKey };
            }
            const currentCount = aggregated[weekKey][item.variety] as number || 0;
            aggregated[weekKey][item.variety] = currentCount + item.binCount;
        });
    } else if (period === 'quarter') {
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

    return Object.values(aggregated).sort((a, b) => {
        if (period === 'week') {
            return new Date(a.period as string).getTime() - new Date(b.period as string).getTime();
        } else if (period === 'month') {
            const aWeek = parseInt((a.period as string).replace('Week ', ''));
            const bWeek = parseInt((b.period as string).replace('Week ', ''));
            return aWeek - bWeek;
        } else {
            const monthOrder = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            return monthOrder.indexOf(a.period as string) - monthOrder.indexOf(b.period as string);
        }
    });
};
