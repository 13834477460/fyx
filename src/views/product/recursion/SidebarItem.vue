<template>
  <div>
    <v-slot>
      <ul class="add1">
        <li>
          {{ item.name }}
          <SidebarItem v-for="child in item.children" :key="child.name" :item="child" />
        </li>
      </ul>
    </v-slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['item'])
</script>

<style scoped>
.add1 {
  margin-left: 20px;
}
</style>
