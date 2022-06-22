import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { addProgress } from 'modules/user';
import { getDatestr } from 'lib/methods';

const AddProgressBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  .submit {
    width: 100%;
  }
  @media (min-width: 380px) {
    flex-direction: row;
    .submit {
      width: 5rem;
      height: 3rem;
    }
  }
`;

const ConfirmBlock = styled.div`
  display: flex;
  gap: 0.5rem;
  div {
    display: grid;
    place-items: center;
    input {
      font-size: 2rem;
      width: 5rem;
    }
  }
`;

const AddProgressButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_sub};
  font-size: 1.5rem;
  font-weight: bold;
  @media (hover: hover) {
    &:hover {
      opacity: 0.75;
    }
  }
  &:active {
    background: ${({ theme }) => theme.primary};
  }
  cursor: pointer;
`;

const AddProgress = () => {
  const [input, setInput] = useState({
    weight: 0,
    muscleMass: 0,
    fatMass: 0,
  });
  const dispatch = useDispatch();

  const onChange = (
    type: 'weight' | 'muscleMass' | 'fatMass',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.value.length > 3) return;
    setInput({ ...input, [type]: e.target.value });
  };

  const onSubmit = () => {
    if (!input.weight || !input.muscleMass || !input.fatMass) return;
    dispatch(
      addProgress({
        date: getDatestr(new Date()),
        weight: input.weight,
        muscleMass: input.muscleMass,
        fatMass: input.fatMass,
      }),
    );
    setInput({
      weight: 0,
      muscleMass: 0,
      fatMass: 0,
    });
  };

  return (
    <AddProgressBlock>
      <ConfirmBlock>
        <div className="weight">
          <b>체중</b>
          <input
            type="number"
            min={0}
            max={300}
            value={input.weight}
            onChange={(e) => onChange('weight', e)}
          />
          kg
        </div>
        <div className="muscleMass">
          <b>골격근량</b>
          <input
            type="number"
            min={0}
            max={150}
            value={input.muscleMass}
            onChange={(e) => onChange('muscleMass', e)}
          />
          kg
        </div>
        <div className="fatMass">
          <b>지방량</b>
          <input
            type="number"
            min={0}
            max={150}
            value={input.fatMass}
            onChange={(e) => onChange('fatMass', e)}
          />
          kg
        </div>
      </ConfirmBlock>
      <AddProgressButton className="submit" onClick={onSubmit}>
        확인
      </AddProgressButton>
    </AddProgressBlock>
  );
};

export default AddProgress;
