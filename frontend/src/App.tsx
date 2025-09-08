import { useState, useEffect } from 'react';
import { Layout } from './layout/Layout';
import { Dashboard } from './pages/Dashboard';

// Function to get the initial producer from localStorage or use a default
const getInitialProducer = () => {
    const savedProducer = localStorage.getItem('selectedProducer');
    return savedProducer || 'All Producers';
};

export default function App() {
    const [selectedProducer, setSelectedProducer] = useState<string>(getInitialProducer);

    // useEffect hook to save the selectedProducer to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('selectedProducer', selectedProducer);
    }, [selectedProducer]);
    
    return (
        <Layout>
            <Dashboard selectedProducer={selectedProducer} setSelectedProducer={setSelectedProducer} />
        </Layout>
    );
}