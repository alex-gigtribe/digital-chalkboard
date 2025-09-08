import { useState, useMemo, useEffect, useRef } from 'react';
import BinTrackingWidget from '../components/panel/BinTrackingPanel';
import BinTrackingChart from '../components/charts/BinTrackingChart';
import HistoricalBarChart from '../components/charts/HistoricalBarChart';
import CustomDropdown from '../components/ui/CustomDropdown';
import { generateMockData, BinData, getFilteredData } from '../data/mockData';
import { ChevronDown } from 'lucide-react';

// Declare the global google object to satisfy TypeScript
declare global {
  interface Window {
    google: any;
  }
}

// Custom hook to handle state persistence in localStorage
const useLocalStorageState = (key: string, defaultValue: any) => {
  const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

// Map Component
const MapComponent = ({ selectedDetailId, setSelectedDetailId, filteredData, showMap, setShowMap }: any) => {
  const [googleMapsLoadError, setGoogleMapsLoadError] = useState(false);
  const mapRef = useRef(null);

  // PUC locations - 5 distinct coordinates
  const pucLocations = useMemo(() => ({
    '1': { lat: -33.84737897053899, lng: 18.856154180850158 },
    '2': { lat: -33.84733979465297, lng: 18.85557470216871 },
    '3': { lat: -33.847705170374304, lng: 18.856140851542968 },
    '4': { lat: -33.84792552390468, lng: 18.855211842463845 },
    '5': { lat: -33.847702927169095, lng: 18.855479443257078 }
  }), []);

  // Initialize and render the Google Map
  useEffect(() => {
    if (showMap && !googleMapsLoadError) {
      const scriptId = 'google-maps-script';
      
      const initMap = async () => {
        try {
          const mapCenter = selectedDetailId
            ? getCurrentCoordinates()
            : { lat: -33.84751, lng: 18.85585 }; // Default center
          
          const map = new window.google.maps.Map(mapRef.current, {
            zoom: 16,
            center: mapCenter,
            mapTypeId: window.google.maps.MapTypeId.SATELLITE,
            mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
          });

          // Import the AdvancedMarkerElement library
          const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker');

          // Add markers using AdvancedMarkerElement
          const markers = selectedDetailId
            ? [getCurrentCoordinates()]
            : Object.values(pucLocations);

          markers.forEach(coords => {
            new AdvancedMarkerElement({
              map: map,
              position: coords,
            });
          });
          setGoogleMapsLoadError(false); // Clear any previous error
        } catch (error) {
          console.error("Failed to initialize Google Map:", error);
          setGoogleMapsLoadError(true);
        }
      };

      if (window.google?.maps) {
        initMap();
        return;
      }

      if (document.getElementById(scriptId)) {
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&loading=async`;
      script.async = true;
      script.onerror = () => {
        setGoogleMapsLoadError(true);
      };
      script.onload = () => {
        initMap();
      };
      document.body.appendChild(script);
    }
  }, [showMap, selectedDetailId, pucLocations, googleMapsLoadError]);
  
  // Get current coordinates based on selected row or default to center
  const getCurrentCoordinates = () => {
    if (selectedDetailId) {
      const selectedItem = filteredData.find((item: any) => item.id === selectedDetailId);
      if (selectedItem && pucLocations[selectedItem.puc as keyof typeof pucLocations]) {
        const coords = pucLocations[selectedItem.puc as keyof typeof pucLocations];
        return { lat: coords.lat, lng: coords.lng };
      }
    }
    // Default center coordinates (average of all PUCs)
    return { lat: -33.84751, lng: 18.85585 };
  };

  return showMap ? (
    <div className="bg-background-accent rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">
          {selectedDetailId ? `PUC ${filteredData.find((item: any) => item.id === selectedDetailId)?.puc} Location` : 'All PUC Locations'}
        </h3>
        <button
          onClick={() => {
            setShowMap(false);
            setSelectedDetailId(null);
          }}
          className="text-grey-contrast hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="w-full h-96 rounded-lg overflow-hidden border border-grey-raised">
        {!googleMapsLoadError ? (
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} className="rounded-lg"></div>
        ) : (
          <iframe
            key="osm-map-iframe"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={selectedDetailId ?
              `https://www.openstreetmap.org/export/embed.html?bbox=${getCurrentCoordinates().lng - 0.005},${getCurrentCoordinates().lat - 0.005},${getCurrentCoordinates().lng + 0.005},${getCurrentCoordinates().lat + 0.005}&layer=mapnik&marker=${getCurrentCoordinates().lat},${getCurrentCoordinates().lng}`
              :
              `https://www.openstreetmap.org/export/embed.html?bbox=18.8540,-33.8485,18.8575,-33.8470&layer=mapnik&marker=${Object.values(pucLocations).map(loc => `${loc.lat},${loc.lng}`).join('&marker=')}`
            }
            allowFullScreen
            title="OpenStreetMap"
            className="rounded-lg"
          />
        )}
      </div>
    </div>
  ) : (
    // Map is hidden - show "Show Map" button
    <div className="bg-background-accent rounded-xl p-6 text-center">
      <button
        onClick={() => setShowMap(true)}
        className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all font-medium"
      >
        Show Map
      </button>
    </div>
  );
};

// Table Component
const TableComponent = ({ showDetails, setShowDetails, selectedDetailId, setSelectedDetailId, filteredData, period }: any) => {
  const pucLocations = useMemo(() => ({
    '1': { lat: -33.84737897053899, lng: 18.856154180850158 },
    '2': { lat: -33.84733979465297, lng: 18.85557470216871 },
    '3': { lat: -33.847705170374304, lng: 18.856140851542968 },
    '4': { lat: -33.84792552390468, lng: 18.855211842463845 },
    '5': { lat: -33.847702927169095, lng: 18.855479443257078 }
  }), []);

  return (
    <>
      {/* Details Toggle */}
      <div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full bg-grey-raised hover:bg-grey-darker rounded-xl p-4 transition-colors 
                     flex items-center justify-between group"
        >
          <span className="text-white font-medium">
            View Details by PUC and Variety
          </span>
          <ChevronDown className={`w-5 h-5 text-grey-contrast transition-transform 
                                   ${showDetails ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Collapsible Details - Table Format */}
      {showDetails && (
        <div className="space-y-4 animate-in slide-in-from-top-2">
          <div className="bg-background-accent rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-grey-raised">
                    <th className="text-left p-3 text-sm font-semibold text-grey-contrast">PUC</th>
                    <th className="text-left p-3 text-sm font-semibold text-grey-contrast">Variety</th>
                    <th className="text-left p-3 text-sm font-semibold text-grey-contrast">Date</th>
                    <th className="text-left p-3 text-sm font-semibold text-grey-contrast">Bins</th>
                    <th className="text-left p-3 text-sm font-semibold text-grey-contrast">Producer</th>
                    <th className="text-left p-3 text-sm font-semibold text-grey-contrast">Zone</th>
                    <th className="text-left p-3 text-sm font-semibold text-grey-contrast">Time</th>
                    <th className="text-left p-3 text-sm font-semibold text-grey-contrast">Weight</th>
                    <th className="text-left p-3 text-sm font-semibold text-grey-contrast">Latitude</th>
                    <th className="text-left p-3 text-sm font-semibold text-grey-contrast">Longitude</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item: any) => {
                    const pucCoords = pucLocations[item.puc as keyof typeof pucLocations];
                    const lat = pucCoords ? pucCoords.lat : -33.84751;
                    const lng = pucCoords ? pucCoords.lng : 18.85585;
                    
                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          setSelectedDetailId(item.id === selectedDetailId ? null : item.id);
                        }}
                        className={`cursor-pointer hover:bg-grey-raised transition-all ${
                          item.id === selectedDetailId ? 'bg-grey-raised border border-white' : ''
                        }`}
                      >
                        <td className="p-3 text-sm">
                          <span className="font-bold text-white">PUC {item.puc}</span>
                        </td>
                        <td className="p-3 text-sm">
                          <span className="font-semibold text-white">{item.variety}</span>
                        </td>
                        <td className="p-3 text-sm text-grey-contrast">
                          {period === "day" 
                            ? new Date(item.scanDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                            : new Date(item.scanDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="p-3 text-sm">
                          <span className="font-bold text-primary text-lg">{item.binCount}</span>
                        </td>
                        <td className="p-3 text-sm text-white">{item.producer}</td>
                        <td className="p-3 text-sm text-white">{item.farmArea.replace('Zone-', 'A')}</td>
                        <td className="p-3 text-sm text-grey-contrast">{item.scanTime}</td>
                        <td className="p-3 text-sm text-white">{(item.binCount * 0.37).toFixed(1)}t</td>
                        <td className="p-3 text-sm text-grey-contrast">{lat.toFixed(6)}</td>
                        <td className="p-3 text-sm text-grey-contrast">{lng.toFixed(6)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface DashboardProps {
  selectedProducer: string;
  setSelectedProducer: (producer: string) => void;
}

export function Dashboard({ selectedProducer, setSelectedProducer }: DashboardProps) {
  const [activeTab, setActiveTab] = useLocalStorageState('activeTab', 'overview');
  const [selectedPUC, setSelectedPUC] = useLocalStorageState('selectedPUC', 'all');
  const [selectedVariety, setSelectedVariety] = useLocalStorageState('selectedVariety', 'all');
  const [period, setPeriod] = useLocalStorageState('period', 'week'); // lands on week view by default
  const [historicalPeriod, setHistoricalPeriod] = useLocalStorageState('historicalPeriod', 'week');
  
  // Map and table state
  const [showMap, setShowMap] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);

  const allData = useMemo(() => generateMockData(), []);

  // Get filtered data for map and table
  const filteredData = useMemo(() => {
    let filtered;
    if (period === 'day') {
      const today = new Date().toISOString().split('T')[0];
      filtered = allData.filter(item => {
        let matchesDate = item.scanDate === today;
        let matchesProducer = selectedProducer === 'All Producers' || item.producer === selectedProducer;
        let matchesPUC = selectedPUC === 'all' || item.puc === selectedPUC;
        let matchesVariety = selectedVariety === 'all' || item.variety === selectedVariety;
        
        return matchesDate && matchesProducer && matchesPUC && matchesVariety;
      });
    } else {
      filtered = getFilteredData(allData, period, selectedPUC, selectedVariety, selectedProducer);
    }
    return filtered;
  }, [allData, selectedProducer, selectedPUC, selectedVariety, period]);

  const allProducers = useMemo(() => {
    const uniqueProducers = new Set<string>();
    uniqueProducers.add('All Producers');
    allData.forEach((item: BinData) => uniqueProducers.add(item.producer));
    return Array.from(uniqueProducers);
  }, [allData]);

  const allPUCs = useMemo(() => {
    const uniquePUCs = new Set<string>();
    uniquePUCs.add('all');
    const filteredDataForDropdown = selectedProducer === 'All Producers'
      ? allData
      : allData.filter((item: BinData) => item.producer === selectedProducer);

    filteredDataForDropdown.forEach((item: BinData) => uniquePUCs.add(item.puc));
    return Array.from(uniquePUCs);
  }, [allData, selectedProducer]);

  const allVarieties = useMemo(() => {
    const uniqueVarieties = new Set<string>();
    uniqueVarieties.add('all');
    const filteredDataForDropdown = selectedProducer === 'All Producers'
      ? allData
      : allData.filter((item: BinData) => item.producer === selectedProducer);

    filteredDataForDropdown.forEach((item: BinData) => uniqueVarieties.add(item.variety));
    return Array.from(uniqueVarieties);
  }, [allData, selectedProducer]);

  const hasActiveFilters = useMemo(() => {
    return (
      selectedProducer !== 'All Producers' ||
      selectedPUC !== 'all' ||
      selectedVariety !== 'all'
    );
  }, [selectedProducer, selectedPUC, selectedVariety]);

  const handleResetFilters = () => {
    setSelectedProducer('All Producers');
    setSelectedPUC('all');
    setSelectedVariety('all');
    setSelectedDetailId(null); // Clear selected row when filters reset
  };

  const isProjectionDisabled = activeTab === 'projection';

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col space-y-4 mb-6 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex bg-grey-raised rounded-lg p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-primary text-white shadow-md'
                : 'text-grey-contrast hover:text-white hover:bg-grey-darker'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('historical')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'historical'
                ? 'bg-primary text-white shadow-md'
                : 'text-grey-contrast hover:text-white hover:bg-grey-darker'
            }`}
          >
            Historical Analysis
          </button>
          <button
            onClick={() => setActiveTab('projection')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'projection'
                ? 'bg-primary text-white shadow-md'
                : 'text-grey-contrast hover:text-white hover:bg-grey-darker'
            }`}
          >
            Forecast
          </button>
        </div>
        {activeTab !== 'projection' && (
          <div className="flex bg-grey-raised rounded-lg p-1">
            {activeTab === 'overview' && (
              <>
                <button
                  onClick={() => setPeriod('day')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    period === 'day'
                      ? 'bg-secondary text-white'
                      : 'text-grey-contrast hover:text-white'
                  }`}
                >
                  Daily View
                </button>
                <button
                  onClick={() => setPeriod('week')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    period === 'week'
                      ? 'bg-secondary text-white'
                      : 'text-grey-contrast hover:text-white'
                  }`}
                >
                  7-Day View
                </button>
              </>
            )}
            {activeTab === 'historical' && (
              <>
                <button
                  onClick={() => setHistoricalPeriod('week')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    historicalPeriod === 'week'
                      ? 'bg-secondary text-white'
                      : 'text-grey-contrast hover:text-white'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setHistoricalPeriod('month')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    historicalPeriod === 'month'
                      ? 'bg-secondary text-white'
                      : 'text-grey-contrast hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setHistoricalPeriod('quarter')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    historicalPeriod === 'quarter'
                      ? 'bg-secondary text-white'
                      : 'text-grey-contrast hover:text-white'
                  }`}
                >
                  Quarterly
                </button>
              </>
            )}
          </div>
        )}
      </div>
      {!isProjectionDisabled && (
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <CustomDropdown
            options={allProducers}
            value={selectedProducer}
            onChange={(value) => {
              setSelectedProducer(value);
              setSelectedPUC('all');
              setSelectedVariety('all');
            }}
            label="All Producers"
          />
          <CustomDropdown
            options={allPUCs}
            value={selectedPUC}
            onChange={(value) => {
              setSelectedPUC(value);
            }}
            label="All PUCs"
          />
          <CustomDropdown
            options={allVarieties}
            value={selectedVariety}
            onChange={(value) => {
              setSelectedVariety(value);
            }}
            label="All Varieties"
          />
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white rounded-lg transition-all text-sm"
            >
              Clear Filter
            </button>
          )}
        </div>
      )}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* 1. KPI Tiles & Variety Distribution */}
            <BinTrackingWidget
              selectedPUC={selectedPUC}
              selectedVariety={selectedVariety}
              setSelectedVariety={(value) => {
                setSelectedVariety(value);
              }}
              period={period}
              selectedProducer={selectedProducer}
            />
            
            {/* 2. Chart/Graph */}
            <BinTrackingChart
              selectedPUC={selectedPUC}
              selectedVariety={selectedVariety}
              setSelectedVariety={(value) => {
                setSelectedVariety(value);
              }}
              period={period}
              selectedProducer={selectedProducer}
            />
            
            {/* 3. Map */}
            <MapComponent 
              selectedDetailId={selectedDetailId}
              setSelectedDetailId={setSelectedDetailId}
              filteredData={filteredData}
              showMap={showMap}
              setShowMap={setShowMap}
            />
            
            {/* 4. Table */}
            <TableComponent
              showDetails={showDetails}
              setShowDetails={setShowDetails}
              selectedDetailId={selectedDetailId}
              setSelectedDetailId={setSelectedDetailId}
              filteredData={filteredData}
              period={period}
            />
          </>
        )}
        {activeTab === 'historical' && (
          <HistoricalBarChart
            period={historicalPeriod}
            selectedVariety={selectedVariety}
            selectedProducer={selectedProducer}
            selectedPUC={selectedPUC}
          />
        )}
        {activeTab === 'projection' && (
          <div className="bg-background-accent rounded-2xl p-6 shadow-lg flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-xl font-semibold">Projection Analysis Coming Soon!</h2>
              <p className="mt-2 text-sm text-grey-contrast">
                This section will display future projections based on historical data and trends.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;