<script setup>
import { computed } from 'vue'
const props=defineProps({type:{type:String,default:'beginner'}})
const shapes={
 download:['M7 30v10h34V30','M24 7v24m-9-9 9 9 9-9'],
 grid:['M7 7h13v13H7zM28 7h13v13H28zM7 28h13v13H7zM28 28h13v13H28z'],
 toolkit:['M5 16h38v24H5z','M16 16V9h16v7M5 25h38M20 23v5h8v-5'],
 megaphone:['M6 19h10l19-9v28l-19-9H6z','m13 29 4 10h7l-5-11M40 19l4-3M40 24h5M40 29l4 3'],
 beginner:['M7 9h11l6 4 6-4h11v27H30l-6 4-6-4H7z','M24 13v27M12 15h6M12 21h6M30 16h6M30 22h6'],
 clash:['M6 9h36v28H6z','M6 17h36M13 13h1M18 13h1M13 24h15M13 30h22M32 22v5M20 28v5'],
 singbox:['M8 14 24 5l16 9v20l-16 9-16-9z','m8 14 16 10 16-10M24 24v19M16 10l16 9v8'],
 nodes:['M18 5h12v11H18zM5 31h12v11H5zM31 31h12v11H31z','M24 16v9M11 31v-6h26v6M20 10h8M8 36h6M34 36h6'],
 review:['M7 7h34v34H7z','M14 32V22M24 32V14M34 32V19M11 35h27'],
 eye:['M3 24s8-12 21-12 21 12 21 12-8 12-21 12S3 24 3 24Z','M31 24a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z'],
 rules:['M18 5h12v10H18zM4 33h10v10H4zM19 33h10v10H19zM34 33h10v10H34z','M24 15v18M9 33v-9h30v9'],
 clock:['M42 24a18 18 0 1 1-36 0 18 18 0 0 1 36 0Z','M24 13v11l7 4'],
 update:['M11 5h19l9 9v29H11z','M30 5v10h9M17 27a8 8 0 1 1 1 8M15 35h5v-5'],
 ai:['M22 7c1 10 7 16 17 17-10 1-16 7-17 17-1-10-7-16-17-17 10-1 16-7 17-17Z','M37 5v10m-5-5h10'],
 privacy:['M24 4 41 10v13c0 11-17 21-17 21S7 34 7 23V10z','M18 25v-6a6 6 0 0 1 12 0v6M16 25h16v11H16z'],
 speed:['M5 35a20 20 0 1 1 38 0z','M24 30l10-14M11 29h4M15 16l3 3M24 10v5M35 29h4'],
 mobile:['M13 4h22v40H13z','M13 10h22M13 37h22M22 41h4M21 22l3 3 6-7']
}
const paths=computed(()=>shapes[props.type]||shapes.beginner)
</script>
<template><svg class="portal-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path :d="paths[0]" fill="currentColor" opacity=".14" transform="translate(1 2)"/><path :d="paths[0]" fill="currentColor" opacity=".13"/><path :d="paths[0]" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path v-if="paths[1]" :d="paths[1]" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></template>
