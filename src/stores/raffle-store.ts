import { defineStore } from 'pinia';

export const DEFAULT_MAX_RAFFLE_NUMBER = 100;

// Rejection sampling keeps every remaining ticket equally likely.
export function randomIndex(length: number): number {
  if (!Number.isInteger(length) || length < 1 || length > 2 ** 32) {
    throw new RangeError(
      'The raffle pool must contain 1–4,294,967,296 numbers.',
    );
  }
  const range = 2 ** 32;
  const limit = range - (range % length);
  const sample = new Uint32Array(1);
  do {
    crypto.getRandomValues(sample);
  } while (sample[0]! >= limit);
  return sample[0]! % length;
}

export const useRaffleStore = defineStore('raffle', {
  state: () => ({
    winners: [] as number[],
    maxNumber: DEFAULT_MAX_RAFFLE_NUMBER,
  }),
  getters: {
    availableNumbers: (state) =>
      Array.from({ length: state.maxNumber }, (_, index) => index + 1).filter(
        (number) => !state.winners.includes(number),
      ),
  },
  actions: {
    pickWinner(): number | null {
      const pool = this.availableNumbers;
      return pool.length ? pool[randomIndex(pool.length)]! : null;
    },
    recordWinner(number: number) {
      if (this.availableNumbers.includes(number)) this.winners.push(number);
    },
    reset(maxNumber = DEFAULT_MAX_RAFFLE_NUMBER) {
      if (
        !Number.isInteger(maxNumber) ||
        maxNumber < 1 ||
        maxNumber >= 2 ** 32
      ) {
        throw new RangeError(
          'Enter a positive whole number below 4,294,967,296.',
        );
      }
      this.maxNumber = maxNumber;
      this.winners = [];
    },
  },
  persist: { pick: ['winners', 'maxNumber'] },
});
