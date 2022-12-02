import { createContext, useState } from "react";

interface CreateCycleData {
  task: string;
  minutes: number;
}
interface Cycle {
  id: string;
  task: string;
  minutes: number;
  startData: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  idCycleActive: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
  children: React.ReactNode;
}
export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [idCycleActive, setIdCycleActive] = useState<string | null>(null);
  const activeCycle = cycles.find((cycle) => cycle.id === idCycleActive);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
  function markCurrentCycleAsFinished() {
    setCycles(
      cycles.map((cycle) => {
        if (activeCycle && cycle.id === idCycleActive) {
          return { ...cycle, finishedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function interruptCurrentCycle() {
    setCycles(
      cycles.map((cycle) => {
        if (activeCycle && cycle.id === activeCycle.id) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
    setIdCycleActive(null);
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());
    const newCycle: Cycle = {
      id: id,
      task: data.task,
      minutes: data.minutes,
      startData: new Date(),
    };

    setCycles((state) => [...state, newCycle]);
    setIdCycleActive(id);
    setAmountSecondsPassed(0);
    // reset();
  }
  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        idCycleActive,
        amountSecondsPassed,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}