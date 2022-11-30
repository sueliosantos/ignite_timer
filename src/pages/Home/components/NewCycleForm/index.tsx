import { FormContainer, MinutesInput, TaskInput } from "./styles";
import { useContext } from "react";
import { CyclesContext } from "../..";
import { useFormContext } from "react-hook-form";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput id="task"
        placeholder='De um nome para seu projeto' list={"sugestions"}
        {...register('task')}
        disabled={!!activeCycle}
      />

      <datalist id="sugestions">
        <option value="Estudar React" />
        <option value="Projeto Cartola" />
        <option value="Projeto Intech" />
        <option value="Projeto Vendas" />
      </datalist>
      <label htmlFor="minutes">durante</label>
      <MinutesInput id="minutes" placeholder='00' type="number"
        step={1}
        min={1}
        max={60}
        {...register('minutes', { valueAsNumber: true })}
        disabled={!!activeCycle}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}