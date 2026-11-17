<template>
  <div class="header-actions" role="group" aria-label="站点快捷操作">
    <a class="header-icon-action" href="#" aria-label="Telegram" title="Telegram" @click.prevent>
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.94 4.67 18.9 19c-.23 1.01-.83 1.26-1.67.79l-4.63-3.41-2.23 2.15c-.25.25-.46.46-.95.46l.33-4.71 8.58-7.75c.37-.33-.08-.52-.57-.19L7.15 13.02l-4.57-1.43c-.99-.31-1.01-.99.21-1.47L20.66 3.23c.83-.31 1.56.2 1.28 1.44Z"/>
      </svg>
    </a>
    <a class="header-icon-action" href="#" aria-label="GitHub" title="GitHub" @click.prevent>
      <svg viewBox="0 0 1000 1000" fill="currentColor" aria-hidden="true">
        <path d="M500.5 74.2Q381.3 74.2 279.8 133.8Q180.2 192.4 122.6 291.0Q63 392.6 63 510.7Q63 604.5 101.1 689.5Q138.2 771.5 204.6 833.0Q271 894.5 356 923.8Q369.6 926.8 373.5 920.9Q375.5 917 375.5 906.2L375.5 826.2Q323.7 832 289.6 818.4Q264.2 807.6 248.5 785.2Q239.7 772.5 232.9 750.0Q230 742.2 228 739.3Q220.2 725.6 194.8 708.0Q183.1 701.2 181.2 697.3Q176.3 691.4 181.2 686.5Q202.6 674.8 226.6 689.0Q250.5 703.1 276.9 743.2Q294.4 768.6 328.6 772.5Q351.1 775.4 378.4 768.6Q387.2 733.4 412.6 709.0Q314 691.4 264.2 632.8Q218.3 580.1 218.3 501.0Q218.3 426.8 265.1 372.1Q253.4 335.9 259.3 296.9Q262.2 276.4 270 255.9L270 254.9Q306.2 252 350.1 274.4Q372.6 286.1 390.1 299.8Q439.9 286.1 500.5 286.1Q561 286.1 611.8 299.8Q631.3 285.2 654.8 273.4Q696.8 253.9 730 256.8L731 257.8Q738.8 278.3 740.7 298.8Q746.6 336.9 735.8 372.1Q782.7 426.8 782.7 501.0Q782.7 581.1 736.8 633.8Q687 692.4 587.4 709.0Q605 726.6 614.7 749.5Q624.5 772.5 624.5 797.9L625.5 910.2Q625.5 918 627.4 920.9Q630.4 925.8 640.1 925.8Q726.1 896.5 793.5 835.0Q860.8 773.4 897.9 691.4Q937 605.5 937 511.7Q937 392.6 877.4 291.0Q819.8 192.4 720.2 133.8Q618.7 74.2 500.5 74.2Z"/>
      </svg>
    </a>
  </div>
</template>

<style scoped>
.header-actions {
  display:flex;
  align-items:center;
  flex:none;
  gap:4px;
  margin-inline-start:auto;
}
@media (width > 780px) {
  .header-actions::after {
    content:'';
    width:1px;
    height:24px;
    margin-inline:4px;
    background:var(--line);
  }
}
@media (max-width:780px) {
  .header-actions {
    margin-top:12px;
    gap:0;
    border-radius:var(--control-radius);
    background:var(--header-actions-surface);
    color:var(--muted);
  }
  .fq-site .header-actions > .header-icon-action {
    width:44px;
    height:44px;
  }
}
</style>
