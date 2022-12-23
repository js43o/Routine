import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { insertExercise } from 'modules/user';
import { hideScroll, unhideScroll } from 'lib/methods';

const useDragExercise = () => {
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
    routineId: string,
    dayIdx: number,
    fromIdx: number,
    elem: HTMLLIElement,
    x: number,
  ) => {
    hideScroll();

    elem.classList.add('hold');
    document.onpointermove = (e) => {
      elem.style.transform = `scale(1.1) translate(${e.clientX - x}px)`;
    };
    document.onpointerup = (e) => {
      elem.classList.remove('hold');
      elem.style.transform = '';
      onDragEnd(e, routineId, dayIdx, fromIdx, x);
    };
  };

  const onDragEnd = (
    e: PointerEvent,
    routineId: string,
    dayIdx: number,
    fromIdx: number,
    init: number,
  ) => {
    unhideScroll();

    if (!ref.current) return;

    const items = Array.from(ref.current.querySelectorAll('li'));
    if (!items) return;

    if (e.clientX < init) {
      items.every((item, idx) => {
        const pos =
          (item.getBoundingClientRect().left +
            item.getBoundingClientRect().right) /
          2;
        if (e.clientX < pos) {
          dispatch(insertExercise({ routineId, dayIdx, fromIdx, toIdx: idx }));
          return false;
        }
        return true;
      });
    } else if (e.clientX > init) {
      [...items].reverse().every((item, idx) => {
        const pos =
          (item.getBoundingClientRect().left +
            item.getBoundingClientRect().right) /
          2;
        if (e.clientX > pos) {
          dispatch(
            insertExercise({
              routineId,
              dayIdx,
              fromIdx,
              toIdx: items.length - idx - 1,
            }),
          );
          return false;
        }
        return true;
      });
    }

    document.onpointermove = null;
    document.onpointerup = null;
  };

  return { ref, moveTo, onDragStart };
};

export default useDragExercise;
