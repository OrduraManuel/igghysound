<template>
  <div class="ambient-background" aria-hidden="true">
    <div class="light-field light-field--violet"></div>
    <div class="light-field light-field--magenta"></div>
    <div class="light-field light-field--blue"></div>
    <div class="light-field light-field--coral"></div>
  </div>
</template>

<style scoped lang="scss">
.ambient-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  isolation: isolate;
  overflow: hidden;
  pointer-events: none;
  background:
    radial-gradient(ellipse 64% 80% at -12% 4%, rgba(98, 19, 197, 0.16), transparent 82%),
    radial-gradient(ellipse 62% 88% at 112% 75%, rgba(231, 25, 150, 0.1), transparent 84%),
    #090412;
}

/* Each plane is larger than the viewport so its edges never describe a shape. */
.light-field {
  position: absolute;
  inset: -12%;
  pointer-events: none;
}

.light-field--violet {
  --field-rest: 0.94;
  --field-bright: 1;
  --field-dim: 0.9;
  background:
    radial-gradient(ellipse 25% 27% at 12% 13%, rgba(255, 61, 173, 0.86) 0%, rgba(231, 25, 150, 0.49) 28%, transparent 82%),
    radial-gradient(ellipse 48% 56% at 6% 10%, rgba(98, 19, 197, 0.66) 0%, rgba(98, 19, 197, 0.3) 34%, transparent 83%),
    radial-gradient(ellipse 42% 42% at 27% 1%, rgba(23, 104, 214, 0.32), transparent 82%);
  animation: violet-drift 61s ease-in-out -18s infinite;
}

.light-field--magenta {
  --field-rest: 0.91;
  --field-bright: 1;
  --field-dim: 0.93;
  background:
    radial-gradient(ellipse 18% 27% at 95% 48%, rgba(255, 108, 198, 0.58), rgba(255, 61, 173, 0.32) 24%, transparent 80%),
    radial-gradient(ellipse 22% 34% at 91% 50%, rgba(255, 61, 173, 0.68) 0%, rgba(231, 25, 150, 0.32) 32%, transparent 84%),
    radial-gradient(ellipse 42% 66% at 105% 54%, rgba(231, 25, 150, 0.5) 0%, rgba(98, 19, 197, 0.2) 52%, transparent 88%),
    radial-gradient(ellipse 35% 44% at 97% 69%, rgba(98, 19, 197, 0.23), transparent 82%);
  animation: magenta-drift 73s ease-in-out -39s infinite;
}

.light-field--blue {
  --field-rest: 0.9;
  --field-bright: 1;
  --field-dim: 0.92;
  background:
    radial-gradient(ellipse 26% 37% at 4% 85%, rgba(23, 104, 214, 0.53) 0%, rgba(23, 104, 214, 0.22) 38%, transparent 84%),
    radial-gradient(ellipse 39% 44% at 0% 105%, rgba(231, 25, 150, 0.32) 0%, rgba(98, 19, 197, 0.12) 52%, transparent 86%),
    radial-gradient(ellipse 24% 32% at 105% 98%, rgba(23, 104, 214, 0.26), transparent 84%);
  animation: blue-drift 67s ease-in-out -11s infinite;
}

.light-field--coral {
  --field-rest: 0.82;
  --field-bright: 0.94;
  --field-dim: 0.86;
  background:
    radial-gradient(ellipse 16% 27% at 95% 10%, rgba(255, 122, 64, 0.44), rgba(255, 61, 173, 0.18) 42%, transparent 83%),
    radial-gradient(ellipse 35% 38% at 107% 98%, rgba(231, 25, 150, 0.24), transparent 86%);
  animation: coral-drift 79s ease-in-out -52s infinite;
}

/* The dark center belongs to the background, never to the interactive UI. */
.ambient-background::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 58% 72% at 50% 47%, rgba(9, 4, 18, 0.76), rgba(9, 4, 18, 0.28) 57%, transparent 88%);
}

@keyframes violet-drift {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: var(--field-rest); }
  32% { transform: translate3d(2.5vw, 2vh, 0) scale(1.035); opacity: var(--field-bright); }
  69% { transform: translate3d(-1.5vw, -2.5vh, 0) scale(0.98); opacity: var(--field-dim); }
}

@keyframes magenta-drift {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: var(--field-rest); }
  37% { transform: translate3d(-2.5vw, -2vh, 0) scale(1.025); opacity: var(--field-bright); }
  74% { transform: translate3d(1.5vw, 2.5vh, 0) scale(0.985); opacity: var(--field-dim); }
}

@keyframes blue-drift {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: var(--field-rest); }
  41% { transform: translate3d(2vw, -3vh, 0) scale(1.03); opacity: var(--field-bright); }
  77% { transform: translate3d(-2vw, 1vh, 0) scale(0.985); opacity: var(--field-dim); }
}

@keyframes coral-drift {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: var(--field-rest); }
  46% { transform: translate3d(-2vw, 2vh, 0) scale(1.04); opacity: var(--field-bright); }
  81% { transform: translate3d(1vw, -2vh, 0) scale(0.98); opacity: var(--field-dim); }
}

@media only screen and (max-width: 960px) {
  .light-field--violet { --field-rest: 0.86; --field-bright: 0.92; --field-dim: 0.82; }
  .light-field--magenta { --field-rest: 0.82; --field-bright: 0.9; --field-dim: 0.8; }
  .light-field--coral { --field-rest: 0.7; --field-bright: 0.78; --field-dim: 0.66; }
}

@media only screen and (max-width: 767px) {
  .light-field--violet {
    --field-rest: 0.82;
    --field-bright: 0.88;
    --field-dim: 0.78;
    background:
      radial-gradient(ellipse 39% 27% at 7% 9%, rgba(255, 61, 173, 0.48), rgba(231, 25, 150, 0.21) 36%, transparent 84%),
      radial-gradient(ellipse 70% 51% at -8% 0%, rgba(98, 19, 197, 0.46), transparent 86%);
  }

  .light-field--magenta {
    --field-rest: 0.78;
    --field-bright: 0.85;
    --field-dim: 0.75;
    background:
      radial-gradient(ellipse 40% 31% at 105% 49%, rgba(255, 61, 173, 0.45), rgba(231, 25, 150, 0.17) 40%, transparent 86%),
      radial-gradient(ellipse 64% 55% at 117% 58%, rgba(98, 19, 197, 0.27), transparent 89%);
  }

  .light-field--blue {
    background: radial-gradient(ellipse 53% 34% at -11% 94%, rgba(23, 104, 214, 0.34), rgba(98, 19, 197, 0.13) 48%, transparent 85%);
  }

  .light-field--coral { display: none; }

  .ambient-background::after {
    background: radial-gradient(ellipse 67% 58% at 50% 48%, rgba(9, 4, 18, 0.78), rgba(9, 4, 18, 0.3) 58%, transparent 89%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .light-field {
    animation: none;
    transform: none;
    opacity: var(--field-rest);
  }
}
</style>
