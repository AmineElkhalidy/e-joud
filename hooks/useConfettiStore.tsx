// import { create } from "zustand";

// type ConfettiStore = {
//   isOpen: boolean;
//   onOpen: () => void;
//   onClose: () => void;
// };

// export const useConfettiStore = create<ConfettiStore>((set) => ({
//   isOpen: false,
//   onOpen: () => set({ isOpen: true }),
//   onClose: () => set({ isOpen: false }),
// }));

import { create } from "zustand";

type ConfettiStore = {
  isOpen: boolean;
  hasFired: boolean;
  onOpen: () => void;
  onClose: () => void;
  reset: () => void;
};

export const useConfettiStore = create<ConfettiStore>((set) => ({
  isOpen: false,
  hasFired: false, // Track if confetti has been fired

  onOpen: () =>
    set(
      (state) => (state.hasFired ? state : { isOpen: true, hasFired: true }) // Fire only if not fired before
    ),

  onClose: () => set({ isOpen: false }),
  reset: () => set({ isOpen: false, hasFired: false }), // Reset when needed
}));
