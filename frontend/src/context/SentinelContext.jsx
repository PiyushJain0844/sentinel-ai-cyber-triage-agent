<<<<<<< HEAD
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { api } from '../services/api';

const SentinelContext = createContext(null);
const SimulationContext = createContext(null);
=======
import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

const SentinelContext = createContext(null);
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d

export const SentinelProvider = ({ children }) => {
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [notification, setNotification] = useState(null);
<<<<<<< HEAD
  const [simulationProgress, setSimulationProgress] = useState(null);
=======
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d

  const showNotification = useCallback((message, type = 'info') => {
    const notifId = Date.now();
    setNotification({ message, type, id: notifId });
    setTimeout(() => {
      setNotification(prev => (prev?.id === notifId ? null : prev));
    }, 4500);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const openEvidenceViewer = useCallback(async (eventId) => {
    try {
      const event = await api.getEventById(eventId);
      setSelectedEvidence(event);
      setIsEvidenceModalOpen(true);
    } catch (err) {
      try {
        const events = await api.getEvents({ search: eventId, limit: 5 });
        const found = events.find(e => e.id === eventId) || events[0];
        if (found) {
          setSelectedEvidence(found);
        } else {
          setSelectedEvidence({ id: eventId, details: { note: "Historical evidence cited in security graph" } });
        }
      } catch (e) {
        setSelectedEvidence({ id: eventId, error: "Could not load detailed event log" });
      }
      setIsEvidenceModalOpen(true);
    }
  }, []);

  const closeEvidenceViewer = useCallback(() => {
    setIsEvidenceModalOpen(false);
    setSelectedEvidence(null);
  }, []);

<<<<<<< HEAD
  const runSimulation = useCallback(async () => {
    setIsSimulationRunning(true);
    try {
      const res = await api.startSimulation();
      const simulationId = res.simulation_id;
      let status = res;
      const deadline = Date.now() + 150000;
      setSimulationProgress(status);
      while (status.status === 'running' && Date.now() < deadline) {
        await new Promise(resolve => setTimeout(resolve, 850));
        status = await api.getSimulationStatus();
        setSimulationProgress(status);
        if (status.simulation_id !== simulationId) throw new Error('Simulation run was replaced before completion');
      }
      if (status.status === 'failed') throw new Error(status.error || 'Simulation failed');
      if (status.status !== 'complete') throw new Error('Simulation is taking longer than expected. Refresh to check progress.');
      const result = status.result || {};
      showNotification(`Synthetic run complete: ${result.events_processed || 0} events, ${result.alerts_detected || 0} alerts, ${result.incidents_created || 0} incidents. No external systems were changed.`, 'success');
      triggerRefresh();
      return status;
=======
  const runSampleSimulation = useCallback(async () => {
    setIsSimulationRunning(true);
    try {
      const res = await api.startSimulation();
      showNotification('Sample attack scenario successfully injected & processed across all 6 agents!', 'success');
      triggerRefresh();
      return res;
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
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

<<<<<<< HEAD
  const appValue = useMemo(() => ({
=======
  return (
    <SentinelContext.Provider value={{
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
      selectedEvidence,
      isEvidenceModalOpen,
      openEvidenceViewer,
      closeEvidenceViewer,
<<<<<<< HEAD
=======
      isSimulationRunning,
      runSampleSimulation,
      resetEnvironment,
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
      refreshTrigger,
      triggerRefresh,
      notification,
      showNotification
<<<<<<< HEAD
  }), [selectedEvidence, isEvidenceModalOpen, openEvidenceViewer, closeEvidenceViewer, refreshTrigger, triggerRefresh, notification, showNotification]);

  const simulationValue = useMemo(() => ({ isSimulationRunning, simulationProgress, runSimulation, resetEnvironment }),
    [isSimulationRunning, simulationProgress, runSimulation, resetEnvironment]);

  return (
    <SentinelContext.Provider value={appValue}>
      <SimulationContext.Provider value={simulationValue}>{children}</SimulationContext.Provider>
=======
    }}>
      {children}
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
    </SentinelContext.Provider>
  );
};

export const useSentinel = () => {
  const context = useContext(SentinelContext);
  if (!context) throw new Error('useSentinel must be used within SentinelProvider');
  return context;
};
<<<<<<< HEAD

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within SentinelProvider');
  return context;
};
=======
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
