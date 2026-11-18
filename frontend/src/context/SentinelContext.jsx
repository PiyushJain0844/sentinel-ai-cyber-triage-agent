import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

const SentinelContext = createContext(null);

export const SentinelProvider = ({ children }) => {
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(prev => (prev?.id === prev?.id ? null : prev));
    }, 4500);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const openEvidenceViewer = useCallback(async (eventId) => {
    try {
      // Fetch event from API or search
      const events = await api.getEvents({ search: eventId, limit: 5 });
      const found = events.find(e => e.id === eventId) || events[0];
      if (found) {
        setSelectedEvidence(found);
      } else {
        setSelectedEvidence({ id: eventId, details: { note: "Historical evidence cited in security graph" } });
      }
      setIsEvidenceModalOpen(true);
    } catch (err) {
      setSelectedEvidence({ id: eventId, error: "Could not load detailed event log" });
      setIsEvidenceModalOpen(true);
    }
  }, []);

  const closeEvidenceViewer = useCallback(() => {
    setIsEvidenceModalOpen(false);
    setSelectedEvidence(null);
  }, []);

  const runSampleSimulation = useCallback(async () => {
    setIsSimulationRunning(true);
    try {
      const res = await api.startSimulation();
      showNotification('Sample attack scenario successfully injected & processed across all 6 agents!', 'success');
      triggerRefresh();
      return res;
    } catch (err) {
      showNotification(`Simulation failed: ${err.message}`, 'error');
      throw err;
    } finally {
      setIsSimulationRunning(false);
    }
  }, [showNotification, triggerRefresh]);

  const resetEnvironment = useCallback(async () => {
    setIsSimulationRunning(true);
    try {
      await api.resetSimulation();
      showNotification('Environment reset to clean baseline.', 'info');
      triggerRefresh();
    } catch (err) {
      showNotification(`Reset failed: ${err.message}`, 'error');
    } finally {
      setIsSimulationRunning(false);
    }
  }, [showNotification, triggerRefresh]);

  return (
    <SentinelContext.Provider value={{
      selectedEvidence,
      isEvidenceModalOpen,
      openEvidenceViewer,
      closeEvidenceViewer,
      isSimulationRunning,
      runSampleSimulation,
      resetEnvironment,
      refreshTrigger,
      triggerRefresh,
      notification,
      showNotification
    }}>
      {children}
    </SentinelContext.Provider>
  );
};

export const useSentinel = () => {
  const context = useContext(SentinelContext);
  if (!context) throw new Error('useSentinel must be used within SentinelProvider');
  return context;
};
