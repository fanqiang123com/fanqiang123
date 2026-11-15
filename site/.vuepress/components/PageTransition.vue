<script setup>
// Explicit duration prevents navigation waiting forever for a browser transition event.
defineEmits(['beforeEnter', 'beforeLeave'])
</script>

<template>
  <Transition name="fade-in-down" mode="out-in" :duration="150"
    @before-enter="$emit('beforeEnter')" @before-leave="$emit('beforeLeave')">
    <slot />
  </Transition>
</template>
