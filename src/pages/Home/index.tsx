import { HandPalm, Play } from "phosphor-react";
import { createContext, useContext, useState } from "react";
import { HomeContainer, StartButton, StopButton } from "./styles";
import { Countdown } from "./components/Countdown";
import { NewCycleForm } from "./components/NewCycleForm";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { CyclesContext } from "../../context/CycleContext";

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)
  const newFormCycleValidationShema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutes: zod.number().min(1).max(60, "Máximo de 60 minutos"),
  });

  type NewCycleFormData = zod.infer<typeof newFormCycleValidationShema>;

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newFormCycleValidationShema),
    defaultValues: {
      task: "",
      minutes: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const task = watch("task");


  function hadleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(hadleCreateNewCycle)} action=''>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <Countdown />

        {activeCycle ? (
          <StopButton onClick={interruptCurrentCycle} type='button'>
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
