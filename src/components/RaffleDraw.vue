<template>
  <div class="raffle">
    <header class="raffle-header">
      <span class="eyebrow">A little luck. A big moment.</span>
      <h1>It's your lucky number.</h1>
      <div class="range-badge">
        <span></span> Numbers 1–{{ MAX_RAFFLE_NUMBER }}
      </div>
    </header>

    <section
      class="draw-stage"
      :class="{ 'is-drawing': isDrawing, 'is-winner': hasWinner }"
      aria-label="Raffle draw"
    >
      <div class="stage-label">
        {{
          isDrawing
            ? 'Finding our winner'
            : hasWinner
              ? 'Winner'
              : 'Ready when you are'
        }}
      </div>
      <div class="number-orbit">
        <div class="orbit orbit-one" aria-hidden="true"></div>
        <div class="orbit orbit-two" aria-hidden="true"></div>
        <div v-if="isDrawing" class="sparks" aria-hidden="true">
          <i v-for="spark in 16" :key="spark" :style="sparkStyle(spark)"></i>
        </div>
        <div
          v-if="celebrating"
          :key="celebrationId"
          class="fireworks"
          aria-hidden="true"
        >
          <div
            v-for="burst in 3"
            :key="burst"
            class="burst"
            :class="`burst-${burst}`"
          >
            <i
              v-for="particle in 32"
              :key="particle"
              :style="particleStyle(particle, burst)"
            ></i>
          </div>
        </div>
        <div class="draw-number" aria-hidden="true">
          {{ displayNumber ?? '—' }}
        </div>
        <span class="number-caption">{{
          hasWinner ? 'Congratulations!' : 'YOUR LUCKY NUMBER'
        }}</span>
      </div>
      <p class="draw-hint">{{ hint }}</p>
      <button
        class="draw-button"
        :disabled="isDrawing || !store.availableNumbers.length"
        @click="draw"
      >
        <q-icon
          :name="isDrawing ? 'autorenew' : 'auto_awesome'"
          size="22px"
          aria-hidden="true"
        />
        {{
          isDrawing
            ? 'Drawing…'
            : !store.availableNumbers.length
              ? 'Raffle complete'
              : 'Draw'
        }}
      </button>
      <p class="remaining">
        {{ store.availableNumbers.length }} numbers remaining · No repeat
        winners
      </p>
      <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>
    </section>

    <section class="winners-panel" aria-labelledby="winners-title">
      <div class="winners-heading">
        <h2 id="winners-title">
          <q-icon name="emoji_events" size="23px" aria-hidden="true" /> Winners
          <span>{{ store.winners.length }}</span>
        </h2>
        <button
          v-if="store.winners.length"
          class="reset-button"
          :disabled="isDrawing"
          @click="confirmReset"
        >
          New raffle
        </button>
      </div>
      <ol v-if="store.winners.length" class="winner-list">
        <li
          v-for="(winner, index) in store.winners"
          :key="winner"
          :class="{ latest: index === store.winners.length - 1 }"
        >
          <span class="winner-order"
            >#{{ String(index + 1).padStart(2, '0') }}</span
          >
          <strong>{{ winner }}</strong>
          <span class="winner-note">{{
            index === store.winners.length - 1 ? 'LATEST' : 'WINNER'
          }}</span>
        </li>
      </ol>
      <div v-else class="empty-winners">
        <q-icon name="confirmation_number" size="30px" aria-hidden="true" />
        <p>The lucky ones will appear here.</p>
        <span>Hit Draw to find your first winner.</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useQuasar } from 'quasar';
import {
  MAX_RAFFLE_NUMBER,
  randomIndex,
  useRaffleStore,
} from '../stores/raffle-store';

const store = useRaffleStore();
const $q = useQuasar();
const displayNumber = ref<number | null>(
  store.winners[store.winners.length - 1] ?? null,
);
const isDrawing = ref(false);
const hasWinner = ref(displayNumber.value !== null);
const celebrating = ref(false);
const celebrationId = ref(0);
const announcement = ref('');
let drawTimer: ReturnType<typeof setTimeout> | undefined;
let celebrationTimer: ReturnType<typeof setTimeout> | undefined;

const hint = computed(() => {
  if (isDrawing.value) return 'A little suspense… a little luck…';
  if (!store.availableNumbers.length)
    return 'Every number has had its moment. Start a new raffle to play again.';
  return hasWinner.value
    ? 'One lucky number. One more reason to celebrate.'
    : 'Your next winner is just a click away.';
});

function draw() {
  if (isDrawing.value) return;
  const winner = store.pickWinner();
  if (winner === null) return;
  clearTimeout(celebrationTimer);
  celebrating.value = false;
  hasWinner.value = false;
  isDrawing.value = true;
  announcement.value = 'Drawing a winner.';
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const steps = reducedMotion ? 1 : 56;
  let step = 0;

  function tick() {
    if (step === steps) {
      displayNumber.value = winner;
      store.recordWinner(winner!);
      isDrawing.value = false;
      hasWinner.value = true;
      celebrationId.value++;
      celebrating.value = true;
      announcement.value = `Winner: number ${winner}. ${store.winners.length} winners drawn.`;
      celebrationTimer = setTimeout(() => {
        celebrating.value = false;
      }, 3200);
      return;
    }
    // The rolling display is decorative; the winner is selected independently.
    displayNumber.value = reducedMotion
      ? null
      : randomIndex(MAX_RAFFLE_NUMBER) + 1;
    const delay = reducedMotion ? 450 : 40 + 550 * (step / (steps - 1)) ** 4;
    step++;
    drawTimer = setTimeout(tick, delay);
  }
  tick();
}

function confirmReset() {
  $q.dialog({
    title: 'Start a new raffle?',
    message:
      'This clears the saved winners and puts all 100 numbers back in the draw.',
    cancel: true,
    ok: { label: 'New raffle', color: 'deep-orange' },
  }).onOk(() => {
    clearTimeout(celebrationTimer);
    store.reset();
    displayNumber.value = null;
    hasWinner.value = false;
    celebrating.value = false;
    announcement.value = 'New raffle ready. All 100 numbers are available.';
  });
}

function sparkStyle(index: number) {
  return { '--angle': `${index * 22.5}deg`, '--delay': `${-index * 0.13}s` };
}

function particleStyle(index: number, burst: number) {
  const angle = (index / 32) * Math.PI * 2;
  const distance = 110 + (index % 3) * 30;
  return {
    '--x': `${Math.cos(angle) * distance}px`,
    '--y': `${Math.sin(angle) * distance}px`,
    '--delay': `${(burst - 1) * 0.25}s`,
    '--color': ['#ffd700', '#ffbf46', '#fff1a8', '#e8a52b'][index % 4],
  };
}

onBeforeUnmount(() => {
  clearTimeout(drawTimer);
  clearTimeout(celebrationTimer);
});
</script>

<style scoped lang="scss">
.raffle {
  --gold: #ffd18a;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 16px;
  width: 100%;
  height: 100dvh;
  min-height: 740px;
  padding: clamp(16px, 3cqw, 32px);
  color: #f8f0e6;
}
.raffle-header {
  text-align: center;
}
.eyebrow {
  color: #b5a79b;
  text-transform: uppercase;
  font-size: clamp(10px, 1.8cqw, 15px);
  letter-spacing: 2.8px;
}
h1 {
  margin: 12px 0 19px;
  font-size: clamp(26px, 6cqw, 54px);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -1.3px;
}
.range-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #473a2d;
  border-radius: 30px;
  padding: 7px 13px;
  font-size: clamp(12px, 2.2cqw, 18px);
  color: #d4c4b2;
  background: #211c16;
}
.range-badge span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 10px #ffd18a88;
}
.draw-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 0;
  text-align: center;
  padding: 8px 0;
}
.stage-label {
  min-height: 23px;
  color: #b7aa9b;
  text-transform: uppercase;
  font-size: clamp(13px, 2.5cqw, 22px);
  letter-spacing: 4px;
}
.number-orbit {
  container-type: size;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-height: 0;
  width: 100%;
  margin: 6px auto 0;
  isolation: isolate;
}
.orbit {
  position: absolute;
  width: min(100cqw, 100cqh);
  aspect-ratio: 1;
  border: 1px solid #a9814930;
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
}
.orbit-one {
  width: min(84cqw, 84cqh);
  background: radial-gradient(circle, #a66b1e20, transparent 70%);
}
.orbit-two {
  border-style: dashed;
  border-color: #a981491c;
}
.draw-number {
  font-size: clamp(90px, min(42cqw, 65cqh), 340px);
  line-height: 1.15;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: -7px;
  color: var(--gold);
  text-shadow: 0 0 55px #ffb34222;
}
.number-caption {
  margin-top: 8px;
  color: #a49787;
  font-size: clamp(10px, 2.8cqw, 18px);
  letter-spacing: 2.4px;
}
.draw-hint {
  margin: 12px 0 16px;
  font-size: clamp(12px, 2.3cqw, 18px);
  color: #bcafa0;
  min-height: 18px;
}
.draw-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 11px;
  flex-shrink: 0;
  width: 100%;
  min-height: clamp(60px, 8dvh, 88px);
  border: 1px solid #ffdda0;
  border-radius: 12px;
  background: linear-gradient(115deg, #ffe1a6, #efba6b);
  color: #302214;
  font: inherit;
  font-size: clamp(22px, 4cqw, 32px);
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 5px 30px #dc9b3f18;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.draw-button:hover:enabled {
  transform: translateY(-2px);
  box-shadow: 0 7px 35px #dc9b3f38;
}
button:focus-visible {
  outline: 3px solid #fff3d4;
  outline-offset: 5px;
}
button:disabled {
  cursor: default;
  opacity: 0.6;
}
.remaining {
  margin: 14px 0 0;
  font-size: clamp(11px, 2cqw, 16px);
  color: #ac9c8b;
}
.is-winner .stage-label {
  color: var(--gold);
  font-size: clamp(20px, 4cqw, 34px);
  letter-spacing: 6px;
}
.is-winner .number-caption {
  color: var(--gold);
  letter-spacing: 1px;
  font-size: clamp(14px, 3.5cqw, 50px);
}
.is-drawing .orbit-two {
  animation: orbit-spin 15s linear infinite;
}
.is-drawing .draw-button .q-icon {
  animation: orbit-spin 2s linear infinite;
}
.sparks {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.sparks i {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ffe7b6;
  box-shadow: 0 0 8px 2px #ffbd66;
  animation: spark 1.4s var(--delay) ease-out infinite;
}
.fireworks {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}
.burst {
  position: absolute;
  top: 30%;
  left: 10%;
}
.burst-2 {
  top: 17%;
  left: 80%;
}
.burst-3 {
  top: 78%;
  left: 78%;
}
.burst i {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: 0;
  background: var(--color);
  box-shadow:
    0 0 10px 2px var(--color),
    0 0 22px #ffc24780;
  animation: firework 1.25s var(--delay) ease-out 2;
}
.winners-panel {
  max-height: max(160px, 23dvh);
  overflow: auto;
  border: 1px solid #40372c;
  border-radius: 16px;
  background: #211d1880;
  padding: 20px;
}
.winners-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
h2 {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0;
  font-size: clamp(18px, 3cqw, 26px);
  font-weight: 500;
  line-height: 1.5;
}
h2 .q-icon {
  color: var(--gold);
}
h2 span {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 23px;
  height: 23px;
  padding: 0 5px;
  border-radius: 6px;
  background: #3c3224;
  color: var(--gold);
  font-size: 11px;
}
.reset-button {
  border: 0;
  background: transparent;
  color: #c7b39a;
  font-size: clamp(12px, 2cqw, 16px);
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
  padding: 5px;
}
.empty-winners {
  padding: 25px 0 12px;
  text-align: center;
  color: #a3937f;
}
.empty-winners > .q-icon {
  opacity: 0.55;
}
.empty-winners p {
  margin: 10px 0 4px;
  font-size: clamp(14px, 2.3cqw, 18px);
}
.empty-winners > span {
  font-size: clamp(12px, 2cqw, 16px);
  color: #9a8d7c;
}
.winner-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(83px, 1fr));
  gap: 10px;
  padding: 0;
  margin: 18px 0 0;
  list-style: none;
  max-height: 300px;
  overflow: auto;
}
.winner-list li {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #473b2c;
  background: #251f18;
  border-radius: 10px;
  padding: 9px;
}
.winner-list li.latest {
  border-color: #b3894c;
  background: #392c1a;
}
.winner-order {
  font-size: 9px;
  color: #ae9e89;
  align-self: flex-start;
}
.winner-list strong {
  color: var(--gold);
  font-size: clamp(36px, 6cqw, 54px);
  font-weight: 500;
  line-height: 1.35;
}
.winner-note {
  font-size: 7px;
  letter-spacing: 1.2px;
  color: #c4ad8e;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@keyframes orbit-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes spark {
  0% {
    transform: rotate(var(--angle)) translateX(min(40cqw, 40cqh)) scale(0.2);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: rotate(var(--angle)) translateX(min(49cqw, 49cqh)) scale(0);
    opacity: 0;
  }
}
@keyframes firework {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.2);
  }
  12% {
    opacity: 1;
    transform: translate(calc(var(--x) * 0.2), calc(var(--y) * 0.2)) scale(1);
  }
  75% {
    opacity: 1;
    transform: translate(calc(var(--x) * 0.9), calc(var(--y) * 0.9)) scale(0.7);
  }
  100% {
    opacity: 0;
    transform: translate(var(--x), var(--y)) scale(0.2);
  }
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }
  .sparks,
  .fireworks {
    display: none;
  }
}
</style>
