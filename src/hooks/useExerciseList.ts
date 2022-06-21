import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { insertExercise } from 'modules/routine';

const useScroll = () => {
  const ref = useRef<HTMLUListElement>(null);
  const x = useRef(0);
  const dispatch = useDispatch();

  const moveTo = (direction: string) => {
    if (!ref.current) return;

    const maxWidth = ref.current ? ref.current.scrollWidth : 0;
    const vWidth = ref.current ? ref.current.clientWidth : 0;

    switch (direction) {
      case 'next':
        if (x.current >= maxWidth - ref.current.clientWidth) return;
        x.current = Math.min(
          x.current + vWidth * 0.75,
          maxWidth - ref.current.clientWidth,
        );
        break;
      case 'prev':
        if (x.current <= 0) return;
        x.current = Math.max(x.current - vWidth * 0.75, 0);
        break;
      case 'init':
        x.current = 0;
        break;
      case 'end':
        x.current = maxWidth - ref.current.clientWidth;
        break;
      default:
        break;
    }
    ref.current.scrollLeft = x.current;
  };

  const onDragStart = (
    id: string,
    day: number,
    fromIdx: number,
    elem: HTMLLIElement,
    x: number,
  ) => {
    elem.classList.add('hold');
    document.onpointermove = (e) => {
      elem.style.transform = `scale(1.1) translate(${e.clientX - x}px)`;
    };
    document.onpointerup = (e) => {
      elem.classList.remove('hold');
      elem.style.transform = '';
      onDragEnd(e, id, day, fromIdx, x);
    };
  };

  const onDragEnd = (
    e: PointerEvent,
    id: string,
    day: number,
    fromIdx: number,
    init: number,
  ) => {
    if (!ref.current) return;

    const items = Array.from(ref.current.querySelectorAll('li'));
    if (!items) return;

    if (e.clientX < init)
      for (let i = 0; i < items.length; i += 1) {
        const pos =
          (items[i].getBoundingClientRect().left +
            items[i].getBoundingClientRect().right) /
          2;
        if (e.clientX < pos) {
          dispatch(insertExercise({ id, day, fromIdx, toIdx: i }));
          break;
        }
      }
    else if (e.clientX > init)
      for (let i = items.length - 1; i >= 0; i -= 1) {
        const pos =
          (items[i].getBoundingClientRect().left +
            items[i].getBoundingClientRect().right) /
          2;
        if (e.clientX > pos) {
          dispatch(insertExercise({ id, day, fromIdx, toIdx: i }));
          break;
        }
      }

    document.onpointermove = null;
    document.onpointerup = null;
  };

  // const onDragStart = (e: Reac
  return { ref, moveTo, onDragStart };
};

export default useScroll;
