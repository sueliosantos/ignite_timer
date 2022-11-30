import { HandPalm, Play } from "phosphor-react";
import { createContext, useState } from "react";
import { HomeContainer, StartButton, StopButton } from "./styles";
import { Countdown } from "./components/Countdown";
import { NewCycleForm } from "./components/NewCycleForm";
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from "react-hook-form";

interface Cycle {
  id: string;
  task: string;
  minutes: number;
  startData: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  activeCycle: Cycle | undefined;
  idCycleActive: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function Home() {

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [idCycleActive, setIdCycleActive] = useState<string | null>(null);
  const activeCycle = cycles.find((cycle) => cycle.id === idCycleActive);

  const newFormCycleValidationShema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutes: zod.number().min(1).max(60, 'Máximo de 60 minutos'),
  })

  type NewCycleFormData = zod.infer<typeof newFormCycleValidationShema>

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newFormCycleValidationShema),
    defaultValues: {
      task: '',
      minutes: 0
    }
  })

  const { handleSubmit, watch, reset } = newCycleForm

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
    setAmountSecondsPassed(seconds)

  }

  function handleInterruptCycle() {
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

  function handleCreate(data: NewCycleFormData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id: id,
      task: data.task,
      minutes: data.minutes,
      startData: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setIdCycleActive(id)
    setAmountSecondsPassed(0)
    reset()
  }

  const task = watch('task')

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreate)} action=''>
        <CyclesContext.Provider
          value={{
            activeCycle,
            idCycleActive,
            amountSecondsPassed,
            markCurrentCycleAsFinished,
            setSecondsPassed
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>

          <Countdown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopButton onClick={handleInterruptCycle} type='button'>
            <HandPalm size={24} />
            Interromper
          </StopButton>
        ) : (
          <StartButton disabled={!task} type='submit'>
            <Play size={24} />
            Começar
          </StartButton>
        )}
      </form>
    </HomeContainer>
  );
}
